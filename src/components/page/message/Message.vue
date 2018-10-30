<template>
    <div>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" align="center">
                    <!--<template slot-scope="scope">-->
                    <!--<router-link :to="{path: '/userdetail', query: {'userId': scope.row.id}}">{{scope.row.name}}</router-link>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column prop="created_at" label="发布时间" align="center">
                </el-table-column>
                <el-table-column prop="get_group.title" label="发布用户" align="center">
                </el-table-column>
                <!--暂无-->
                <el-table-column prop="mobile" label="手机号" align="center">
                </el-table-column>
                <el-table-column prop="content" label="留言内容" align="center">
                </el-table-column>
                <el-table-column label="处理状态" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status===0" type="primary" @click="toDone(scope.$index, scope.row)">未处理</el-button>
                        <el-button v-else type="info" disabled>已处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination v-if="totalPage > 10" background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
                </el-pagination>
            </div>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确认操作？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="toDoneConfirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import { CANTACT_UPDATE, CANTACT_LIST } from '@/api/api-type'

    export default {
        name: 'Message',
        data() {
            return {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                tableData: [{}],
                cur_page: 1,
                totalPage: 0, // 总页数
                delVisible: false,
                contactId: 0,
            }
        },
        created() {
            this.getData()
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                let _this = this
                this.$axios.post(CANTACT_LIST, {
                    page: _this.cur_page,
                    pagesize: 10,
                    token: _this.token
                }).then((res) => {
                    if (res.data.error_code === 0) {
                        console.log(res.data.data.data)
                        _this.totalPage = res.data.data.count
                        _this.tableData = res.data.data.data;
                    }
                    if (res.data.error_code === 1010) {
                        _this.totalPage = 0
                    }
                })
            },
            toDone(index, row) {
                this.contactId = row.id;
                this.delVisible = true;
            },
            // 确定处理
            toDoneConfirm(){
                let _this = this
                this.$axios.post(CANTACT_UPDATE, {token: _this.token, contact_id: _this.contactId}).then(res => {
                    if (res.data.error_code == 0) {
                        _this.$message.success('成功处理！');
                        _this.delVisible = false;
                        _this.getData()
                    } else {
                        _this.$message.waiting(res.data.error_msg)
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
