<template>
<div class="container">
    <h3>订单状态：{{listData.status | filterStatus}}</h3>
    <dl class="detail">
        <dt>基本信息</dt>
        <dd>订单编号:<span>{{listData.sn}}</span></dd>
        <dd>下单时间:<span>{{listData.created_at}}</span></dd>
        <dd>购买用户:<span>{{listData.get_user.name}}</span></dd>
        <dd>支付方式:<span>{{listData.type | filterType}}</span></dd>
        <dd>支付单号:<span>{{listData.pay_sn}}</span></dd>
        <dd>支付金额:<span>{{listData.total}}</span></dd>
    </dl>
    <dl class="detail">
        <dt>收货信息</dt>
        <dd>收货人:<span>{{listData.name}}</span></dd>
        <dd>收货电话:<span>{{listData.mobile}}</span></dd>
        <dd>收货地址:<span>{{listData.prov + listData.city + listData.area + listData.address}}</span></dd>
    </dl>
    <el-row :gutter="20">
        <el-col :span="2" class="title">物流单号:</el-col>
        <el-col :span="8">
            <el-input v-model="logistics" :placeholder="listData.status === 3 ? '该订单已发货' : '请输入物流单号'" style="width: 60%" :disabled="listData.status !== 2"></el-input>
            <el-button type="primary" :disabled="is_deliver || listData.status !== 2" @click="deliver">{{listData.status === 3 || is_deliver ? '已发货' : '发货'}}</el-button>
        </el-col>
    </el-row>
    <el-table
        :data="tableData"
        border
        style="width: 60%; margin-top: 30px;">
        <el-table-column
            prop="title"
            label="商品名称">
        </el-table-column>
        <el-table-column
            prop="price"
            label="单价">
        </el-table-column>
        <el-table-column
            prop="num"
            label="数量">
        </el-table-column>
        <el-table-column
            prop="total"
            label="合计">
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import { ORDER_DETAIL, ORDER_UPDATE } from '@/api/api-type'
export default {
    name: 'ListDetail',
    data () {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            orderId: this.$route.query.orderId,
            listData: {
                get_user: {
                    name: ''
                }
            },
            tableData: [],
            is_deliver: false, // 是否发货
            logistics: '' // 物流单号
        }
    },
    created() {
        this.initData()
    },
    filters: {
        filterType (val) {
            switch (val) {
                case 0:
                    return '未支付';
                    break;
                case 1:
                    return '微信支付';
                    break;
                default:
                    return
            }
        },
        filterStatus (val) {
            switch (val) {
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
    methods: {
        initData() {
            this.$axios.post(ORDER_DETAIL, {token: this.token, order_id: this.orderId}).then(res => {
                if (res.data.error_code == 0) {
                    this.listData = res.data.data
                    this.tableData = res.data.data.get_goods
                }
                // console.log(this.listData)
            })
        },
        deliver() {
            this.$axios.post(ORDER_UPDATE, {token: this.token, logistics: this.logistics, order_id: this.orderId}).then(res => {
                if(res.data.error_code == 0) {
                    this.is_deliver = true
                    this.initData()
                } else {
                    this.$message.error(res.data.error_msg);
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.detail{
    dt{
        font-size: 16px;
        color: #333;
        line-height: 32px;
        margin-top: 30px;
    }
    dd{
        font-size: 14px;
        color: #666;
        line-height: 32px;
        span{
            margin-left: 10px;
        }
    }
}
.el-row{
    margin-top: 30px;
    .title{
        font-size: 16px;
        color: #333;
        line-height: 32px;
    }
    .el-input__inner{
    
    }
}
</style>
