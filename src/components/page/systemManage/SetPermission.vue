<template>
<div class="container">
    <div class="title">权限设置</div>
    <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :default-checked-keys="defaultData"
        ref="tree"
        @check="getCheckedKeys">
    </el-tree>
    <el-button class="button" type="primary" @click="submit">保存</el-button>
</div>
</template>

<script>
import { GETALLROULES, ROULE_UPDATE, ROULE_DETAIL } from '@/api/api-type'
export default {
    name: 'SetPermission',
    data () {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            adminId: this.$route.query.adminId,
            groupId: this.$route.query.groupId,
            treeData: [],
            defaultProps: {
                children: 'get_child',
                label: 'title'
            },
            defaultData: []
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            this.$axios.post(GETALLROULES).then(res => {
                if (res.data.error_code == 0) {
                    this.treeData = res.data.data
                }
            })
            this.$axios.post(ROULE_DETAIL, {token: this.token, admin_id: this.adminId, group_id: this.groupId}).then(res => {
                if (res.data.error_code == 0) {
                    this.defaultData = res.data.data.rules
                }
            })
        },
        getCheckedKeys(data) {
            console.log(data)
        },
        submit() {
            let ruleArr = this.$refs.tree.getCheckedKeys()
            this.$axios.post(ROULE_UPDATE, {token: this.token, admin_id: this.adminId, rule_id: ruleArr, group_id: this.groupId}).then(res => {
                // console.log(res)
                if (res.data.error_code == 0) {
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                    // this.$message.success('保存成功！')
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.title{
    font-size: 18px;
    line-height: 40px;
    color: #333 ;
}
    .button{
        margin-top: 30px;
    }
</style>
