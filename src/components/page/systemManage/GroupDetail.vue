<template>
<div class="container">
    <div class="title">管理组详情</div>
    <ul class="detail">
        <li>管理组名称: {{listData.title}}</li>
        <li>描述: {{listData.desc}}</li>
        <li>创建人: {{createName}}</li>
        <li>创建时间: {{listData.created_at}}</li>
        <li>更新时间: {{listData.updated_at}}</li>
    </ul>
</div>
</template>

<script>
import { GROUP_DETAIL } from '@/api/api-type'
export default {
name: 'GroupDetail',
    data () {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            groupId: this.$route.query.groupId,
            listData: [],
            createName: this.$route.query.createName
        }
    },
    created() {
    console.log(this.createName)
        this.initData()
    },
    methods: {
        initData() {
            this.$axios.post(GROUP_DETAIL, {token: this.token, group_id: this.groupId}).then(res => {
                if (res.data.error_code == 0) {
                    this.listData = res.data.data
                }
                console.log(res)
            })
        }
    }
}
</script>

<style scoped lang="less">
.title{
    font-size: 18px;
    color: #333;
    line-height: 40px;
}
.detail{
    list-style: none;
    font-size: 14px;
    color: #666;
    line-height: 30px;
}
</style>
