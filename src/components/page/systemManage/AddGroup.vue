<template>
<div class="container">
    <el-form id="form" ref="form"  :rules="rules" :model="form" label-width="120px">
       <el-form-item label="管理组名称：" prop="title">
           <el-input v-model="form.title" placeholder="请输入管理组名称" :maxlength="20"></el-input>
       </el-form-item>
        <el-form-item label="管理组描述：" prop="desc">
            <el-input v-model="form.desc" placeholder="请输入管理组描述"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">创建</el-button>
            <!--<el-button>重置</el-button>-->
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { GROUP_ADD, GROUP_LIST} from '@/api/api-type'
export default {
    name: 'AddGroup',
    data () {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            form: {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                title: '',
                desc: '',
            },
            rules: {
                title: [{required: true, message: '管理组名称不能为空', trigger: 'blur' }]
            },
            groupList: []
        }
    },
    created() {
        this.$axios.post(GROUP_LIST, {token: this.token, page: 1, pagesize: 100}).then(res => {
            if(res.data.error_code == 0) {
                this.groupList = res.data.data.data
            }
        })
    },
    methods: {
        onSubmit (formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    // _this.form.token = _this.token
                    _this.$axios.post(GROUP_ADD, _this.form).then(res => {
                        console.log(res)
                        if(res.data.error_code == 0) {
                            // console.log(11111111111)
                            _this.$message.success('admin创建成功！');
                            _this.$router.push('/groupmanage')
                        } else {
                            this.$message.error(res.data.error_msg)
                        }
                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped lang="less">

</style>
