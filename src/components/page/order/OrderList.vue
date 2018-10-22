<template>
    <div class="wraper">
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <el-input placeholder="请输入订单号进行查询" v-model="orderSn" clearable @focus="orderSnFocus">
                            <el-button slot="append" icon="el-icon-search" @click="searchOrderSn"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="2" align="right"> <span class="jiansuo">订单检索：</span></el-col>
                    <el-col :span="3">
                        <el-select v-model="select_status" placeholder="订单状态" class="handle-select mr10">
                            <el-option key="0" label="已取消" value="0"></el-option>
                            <el-option key="1" label="待支付" value="1"></el-option>
                            <el-option key="2" label="已支付" value="2"></el-option>
                            <el-option key="4" label="已发货" value="3"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <el-date-picker
                            v-model="orderDate"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                        <!--<el-button type="primary" icon="search" @click="search">搜索</el-button>-->
                        <el-button type="primary" icon="search" @click="searchAll">查看全部订单</el-button>
                    </el-col>
                    <!--<el-col :span="2"><el-button type="primary" icon="search" @click="searchAll">查看全部订单</el-button></el-col>-->
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                </el-row>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column prop="sn" label="订单编号" align="center">
                    <template slot-scope="scope">
                        <router-link :to="{path: '/orderlistdetail', query: {orderId: scope.row.id}}">{{scope.row.sn}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" :formatter='filterStatus'>
                </el-table-column>
                <el-table-column prop="get_user.name" label="购买用户" align="center">
                </el-table-column>
                <el-table-column prop="mobile" label="联系电话" align="center">
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
    import { ORDER_LIST, ORDER_SN, ORDER_SEARCH } from '@/api/api-type'
    export default {
        name: 'OrderList',
        data() {
            return {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                tableData: [],
                cur_page: 1,
                select_status: '',
                is_searchSn: false, // 是否为订单号搜索内容
                is_search: false, // 是否为订单号检索
                form: {
                    sn: '', // 订单编号
                    catogrey: '', // 分类
                    status: '', // 订单状态
                    total: '', // 价格
                    createTime: '', // 创建时间
                    sent_at: '',
                    mobile: ''
                },
                totalPage: 0, // 总页数
                value1: 0,
                orderSn: '', // 订单号
                orderDate: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                if (this.is_search) {
                    this.search()
                } else if (this.is_searchSn) {
                    this.searchOrderSn()
                } else {
                    this.getData();
                }
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
                }
            },
            // 订单检索
            search() {
                this.orderSn = ''
                let params = {
                    token: this.token,
                    status: this.select_status,
                    began_at: this.orderDate[0],
                    ended_at: this.orderDate[1],
                    page: this.cur_page,
                    pagesize: 10
                }
                this.$axios.post(ORDER_SEARCH, params).then(res => {
                    // console.log(this.orderDate[0])
                    if (res.data.error_code == 0) {
                        this.tableData = res.data.data.data;
                        this.totalPage = res.data.data.count
                    }
                    if (res.data.error_code == 5304) {
                        this.tableData = [];
                        this.totalPage = 0
                    }
                    // console.log(res.data)
                })
                this.is_search = true;
                this.is_searchSn = false;
            },
            // 订单号搜索
            searchOrderSn() {
                // alert(1)
                let _this = this
                this.$axios.post(ORDER_SN, {token: this.token, sn: this.orderSn, page: this.cur_page, pagesize: 10}).then(res => {
                    // console.log(res)
                    if (res.data.error_code == 0) {
                        this.tableData = res.data.data.data;
                        this.totalPage = res.data.data.count
                    } else if (res.data.error_code == 5304) {
                        this.tableData = res.data.data.data;
                        this.totalPage = 0
                    } else if (res.data.error_code == 1) {
                        _this.$message.error('搜索内容不能为空');
                    } else {
                        _this.$message.error(res.data.error_msg);
                    }
                })
                this.is_searchSn = true
                this.is_search = false;
            },
            // 订单号搜索 检索内容置空
            orderSnFocus() {
                this.select_status = ''
                this.orderDate = ''
            },
            searchAll() {
                this.select_status = ''
                this.orderDate = ''
                this.orderSn = ''
                this.getData()
            }
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

