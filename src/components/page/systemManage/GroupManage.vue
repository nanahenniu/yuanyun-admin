<template>
    <div class="container">
        <div class="handle-box">
            <el-row :gutter="20">
                <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                <el-col :span="20" align="right"><el-button type="primary" icon="search" @click="creatGroup">新建</el-button></el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable">
            <el-table-column prop="title" label="权限组名称" align="center">
                <!--<template slot-scope="scope">-->
                    <!--<router-link :to="{path: '/userdetail', query: {'userId': scope.row.id}}">{{scope.row.name}}</router-link>-->
                <!--</template>-->
            </el-table-column>
            <el-table-column prop="desc" label="描述" align="center">
            </el-table-column>
            <el-table-column prop="get_address.mobile" label="创建人" align="center">
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" class="red" @click="preview(scope.$index, scope.row)">查看</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination v-if="totalPage > 10" background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { GROUP_LIST, GROUP_DELETE } from '@/api/api-type'
export default {
    name: 'GroupManage',
    data () {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            tableData: [{
            }],
            cur_page: 1,
            totalPage: 0, // 总页数
            delVisible: false,
            idx: -1,
            groupId: 0
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
            this.$axios.post(GROUP_LIST, {
                page: this.cur_page,
                pagesize: 10,
                token: this.token
            }).then((res) => {
                if (res.data.error_code == 0) {
                    console.log(res.data.data.data)
                    this.totalPage = res.data.data.count
                    this.tableData = res.data.data.data;
                }
                if (res.data.error_code == 9002) {
                    this.totalPage = 0
                }
            })
        },
        handleDelete(index, row) {
            this.idx = index;
            this.groupId = row.id;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow(){
            this.tableData.splice(this.idx, 1);
            this.$axios.post(GROUP_DELETE, {token: this.token, group_id: this.groupId}).then(res => {
                if (res.data.error_code == 0) {
                    this.$message.success('删除成功');
                    this.delVisible = false;
                } else {
                    this.$message.waiting(res.data.error_msg)
                }
            })
        },
        creatGroup() {
            this.$router.push('/addgroup')
        }
    }
}
</script>

<style scoped lang="less">
    .handle-box {
        margin-bottom: 20px;
        .total-num{
            font-size: 14px;
            color: #333;
            line-height: 32px;
            margin-top: 15px;
        }
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
</style>
