<template>
    <div class="wraper">
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="3">
                    <el-select v-model="select_cate" placeholder="订单状态" class="handle-select mr10">
                        <el-option key="1" label="广东省" value="广东省"></el-option>
                        <el-option key="2" label="湖南省" value="湖南省"></el-option>
                    </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            v-model="value1"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                    <!--<el-col :span="20" align="right"><el-button type="primary" icon="search" @click="createGood">创建商品</el-button></el-col>-->
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="sn" label="订单编号" align="center">
                </el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" :formatter='filterStatus'>
                </el-table-column>
                <el-table-column prop="get_user.name" label="购买用户" align="center">
                </el-table-column>
                <el-table-column prop="type" label="联系电话" align="center">
                </el-table-column>
                <el-table-column prop="total" label="订单金额" align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center">
                </el-table-column>
                <el-table-column prop="sent_at" label="发货时间" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 3">{{scope.row.sent_at}}</span>
                    </template>
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
    import { ORDER_LIST, ORDER_SN } from '@/api/api-type'
    export default {
        name: 'OrderList',
        data() {
            return {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                tableData: [],
                cur_page: 1,
                select_cate: '',
                select_word: '',
                is_search: false,
                form: {
                    goodName: '', // 商品名称
                    catogrey: '', // 分类
                    goodStatus: '', // 商品状态
                    recommendStatus: '', // 推荐状态
                    price: '', // 价格
                    sort: '', // 排序
                    createTime: '', // 创建时间
                    address: ''
                },
                totalPage: 0, // 总页数
                value1: 0
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 创建商品
            createGood() {
                this.$router.push('/creategoods')
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post(ORDER_LIST, {
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
            filterStatus (row, column, cellValue, index) {
                if (cellValue !== null) {
                    switch (cellValue) {
                        case 0:
                            return '已取消';
                            break;
                        case 1:
                            return '待支付';
                            break;
                        case 2:
                            return '已支付';
                            break;
                        case 3:
                            return '已发货';
                            break;
                        default:
                            return
                    }
                    
                    // if (cellValue == 0) {
                    //     return '已取消'
                    // } else if (cellValue == 1) {
                    //     return '待支付'
                    // } else if (cellValue == 2) {
                    //     return '已支付'
                    // } else if (cellValue == 3) {
                    //     return '已发货'
                    // } else {
                    //     return ''
                    // }
                }
            },
            search() {
                this.is_search = true;
            },
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
            }
        }
        .table{
            width: 100%;
            font-size: 14px;
        }
    }
</style>

