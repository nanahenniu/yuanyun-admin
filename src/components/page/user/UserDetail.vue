<template>
<div class="container">
    <p class="title">基本信息</p>
    <ul>
        <li>微信昵称：碗里没有水</li>
    
        <li>姓名：时振川</li>
    
        <li>性别：男</li>
    
        <li>订单累计：￥3091.00</li>
    
        <li>收货人：时振川</li>
    
        <li>联系电话：17600220747</li>
    
        <li>收货地址：四川省，广元市，新城区麒麟大厦2301</li>
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
    methods: {
        initData() {
            this.$axios.post(USER_DETAIL, {token: this.token, user_id: this.userId}).then(res => {
                if(res.data.error_code == 0) {
                
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
