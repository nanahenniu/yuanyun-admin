<template>
<div class="container">
    <el-form id="form" ref="form"  :rules="rules" :model="form" label-width="120px">
       <el-form-item label="用户账号：" prop="name">
           <el-input v-model="form.name" placeholder="请输入用户账号" :maxlength="20"></el-input>
       </el-form-item>
        <el-form-item label="密码：" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="管理组:" prop="group_id">
            <el-select v-model="form.group_id" placeholder="请选择">
                <el-option v-for="(list, index) in groupList" :key="index" :label="list.title" :value="list.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">创建</el-button>
            <!--<el-button>重置</el-button>-->
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { ADMIN_ADD, GROUP_LIST} from '@/api/api-type'
export default {
    name: 'AddAdmin',
    data () {
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            form: {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                name: '',
                password: '',
                group_id: ''
            },
            rules: {
                name: [{required: true, message: '用户账号不能为空', trigger: 'blur' }],
                password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
                group_id: [{required: true, message: '请选择管理组', trigger: 'change'}],
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
                    _this.$axios.post(ADMIN_ADD, _this.form).then(res => {
                        console.log(res)
                        if(res.data.error_code == 0) {
                            // console.log(11111111111)
                            _this.$message.success('admin创建成功！');
                            _this.$router.push('/adminManage')
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
