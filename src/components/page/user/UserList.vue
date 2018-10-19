<template>
    <div class="wraper">
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <el-input placeholder="请输入用户名进行查询" v-model="seachUser" clearable>
                            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="name" label="用户昵称" align="center">
                </el-table-column>
                <el-table-column prop="" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="get_user.name" label="联系电话" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="订单累计" align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination v-if="totalPage > 10" background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { USER_LIST } from '@/api/api-type'
    export default {
        name: 'UserList',
        data() {
            return {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                tableData: [],
                cur_page: 1,
                totalPage: 0, // 总页数
                seachUser: ''
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                this.$axios.post(USER_LIST, {
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
            searchUser() {}
        }
    }
</script>

<style scoped lang="less">
    .wraper{
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
        .jiansuo{
            line-height: 32px;
            font-size: 14px;
            color: #999;
        }
    }
</style>

