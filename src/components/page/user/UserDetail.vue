<template>
<div class="container">
    <p class="title">基本信息</p>
    <ul>
        <li>微信昵称：{{listData.name}}</li>
    
        <li>姓名：{{listData.get_address.name}}</li>
    
        <li>性别：{{listData.sex | fiflterSex}}</li>
    
        <li>订单累计：</li>
    
        <li>收货人：{{listData.get_address.name}}</li>
    
        <li>联系电话：{{listData.get_address.mobile}}</li>
    
        <li>收货地址：</li>
    </ul>
</div>
</template>

<script>
import { USER_DETAIL } from '@/api/api-type'
export default {
name: 'UserDetail',
    data () {
        return {
            userId: this.$route.query.userId,
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            listData: []
        }
    },
    created() {
        this.initData()
    },
    filters: {
        fiflterSex(val) {
            if (val == 1) {
                return '男'
            } else if (val == 2) {
                return '女'
            } else {
                return '保密'
            }
        }
    },
    methods: {
        initData() {
            this.$axios.post(USER_DETAIL, {token: this.token, user_id: this.userId}).then(res => {
                if(res.data.error_code == 0) {
                    this.listData = res.data.data
                } else {
                    this.$message.error(res.data.error_msg)
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.container{
    .title{
        font-size: 16px;
        line-height: 40px;
        color: #333;
    }
    ul{
        list-style: none;
        li{
            list-style: none;
            font-size: 14px;
            line-height: 30px;
            color: #666;
        }
    }
}
</style>
