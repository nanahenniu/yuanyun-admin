<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                    <el-col :span="20" align="right"><el-button type="primary" icon="search" @click="createInfo">新建</el-button></el-col>
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="title" label="管理员名称" align="center">
                    <!--<template slot-scope="scope">-->
                    <!--<router-link :to="{path: '/userdetail', query: {'userId': scope.row.id}}">{{scope.row.name}}</router-link>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column prop="get_group.title" label="所属管理组" align="center">
                </el-table-column>
                <!--暂无-->
                <el-table-column prop="" label="创建人" align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" class="red" @click="preview(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="primary" v-if="scope.row.status=='1'"  @click="changeStatus(scope.$index, scope.row)">冻结</el-button>
                        <el-button type="danger" v-else @click="changeStatus(scope.$index, scope.row)">激活</el-button>
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
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 冻结/解冻 -->
        <el-dialog title="提示" :visible.sync="delVisibleFreeze" width="300px" center>
            <div class="del-dialog-cnt">确认操作？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="delVisibleFreeze = false">取 消</el-button>
            <el-button type="primary" @click="toChange">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { ADMIN_LIST, ADMIN_DELETE, ADMIN_FREEZE, ADMIN_UNFREEZE } from '@/api/api-type'

export default {
    name: 'AdminManage',
    data() {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            tableData: [{}],
            cur_page: 1,
            totalPage: 0, // 总页数
            delVisible: false,
            delVisibleFreeze: false,
            idx: -1,
            adminId: 0,
            freezeStatus: 1 //默认是激活的
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
            this.$axios.post(ADMIN_LIST, {
                page: this.cur_page,
                pagesize: 10,
                token: this.token
            }).then((res) => {
                if (res.data.error_code === 0) {
                    console.log(res.data.data.data)
                    this.totalPage = res.data.data.count
                    this.tableData = res.data.data.data;
                }
                if (res.data.error_code === 1010) {
                    this.totalPage = 0
                }
            })
        },
        // 新建
        createInfo() {
            this.$router.push('/addadmin')
        },
        handleDelete(index, row) {
            this.idx = index;
            this.adminId = row.id;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow(){
            this.tableData.splice(this.idx, 1);
            let _this =this
            this.$axios.post(ADMIN_DELETE, {token: this.token, admin_id: this.adminId}).then(res => {
                if (res.data.error_code == 0) {
                    this.$message.success('删除成功');
                    this.delVisible = false;
                    _this.getData()
                } else {
                    this.$message.waiting(res.data.error_msg)
                }
            })
        },
        changeStatus(index, row) {
            this.idx = index;
            this.adminId = row.id;
            this.delVisibleFreeze = true;
            this.freezeStatus = row.status
        },
        // 确定删除
        toChange(){
            let _this = this;
            let url = '';
            _this.freezeStatus === 1?url = ADMIN_FREEZE : url = ADMIN_UNFREEZE
            this.$axios.post(url, {token: _this.token, admin_id: _this.adminId}).then(res => {
                if (res.data.error_code == 0) {
                    _this.$message.success('操作成功');
                    _this.delVisibleFreeze = false;
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
