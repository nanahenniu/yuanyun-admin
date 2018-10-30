<template>
<div class="container">
    <div class="title">标题：&nbsp;&nbsp;&nbsp;&nbsp;{{listData.title}}</div>
    <div class="sort">排序：&nbsp;&nbsp;&nbsp;&nbsp;{{listData.sort}}</div>
    <div class="type">推荐状态：&nbsp;&nbsp;&nbsp;&nbsp;{{listData.type == 1 ? '推荐' : '不推荐'}}</div>
    <div class="thumb">缩略图：&nbsp;&nbsp;&nbsp;&nbsp;<img :src="listData.thumb"></div>
    <div class="content">
        详情：&nbsp;&nbsp;&nbsp;&nbsp;
        <div v-html="listData.content"></div>
    </div>
</div>
</template>

<script>
import { INFO_DETAIL } from '@/api/api-type'
export default {
    name: 'InfoDetail',
    data () {
        return {
            infoId: this.$route.query.infoId,
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            listData: []
        }
    },
    created (){
      this.initData()
    },
    methods: {
        initData() {
            this.$axios.post(INFO_DETAIL, {token: this.token, info_id: this.infoId}).then(res => {
                // console.log(res)
                if (res.data.error_code == 0) {
                    this.listData = res.data.data
                } else {
                    this.$message.warning(res.data.erroe_msg)
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.container{
    div{
        font-size: 16px;
        margin-bottom: 30px;
        color: #666;
        &.thumb{
            vertical-align: middle;
            img{
                width: 300px;
                vertical-align: middle;
            }
        }
        &.content > div{
         margin-left: 66px;
        }
    }
}
</style>
