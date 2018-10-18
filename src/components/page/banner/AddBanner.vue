<template>
<div class="container">
    <el-form id="form" ref="form"  :rules="rules" :model="form" label-width="120px">
       <el-form-item label="banner名称：" prop="title">
           <el-input v-model="form.title" placeholder="请输入banner名称" :maxlength="20"></el-input>
       </el-form-item>
        <el-form-item label="排序值：" prop="sort">
            <el-input v-model="form.sort" placeholder="请输入排序值"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址：" prop="url">
            <el-input v-model="form.url" placeholder="https://"></el-input>
        </el-form-item>
        <el-form-item label="封面图片：" prop="pic">
            <el-upload
                ref="thumbUpload"
                action=""
                name="thumbUpload"
                accept="image/jpeg,image/png"
                :limit="1"
                :file-list="form.fileList"
                :auto-upload="false"
                :http-request='submitThumbUpload'
                :before-upload="beforeThumbUpload"
                list-type="picture">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">支持JPG，PNG格式，单张大小请小于500Kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">上传</el-button>
            <!--<el-button>重置</el-button>-->
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { BANNER_ADD, API_UPLOAD} from '@/api/api-type'
export default {
    name: 'AddBanner',
    data () {
        return {
            form: {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                title: '',
                sort: 0,
                url: '',
                content: '',
                fileList: [],
                pic: ''
            },
            rules: {
                title: [{required: true, message: '资讯名称不能为空', trigger: 'blur' }],
                sort: [{required: true, message: '排序值不能为空', trigger: 'blur'}],
                pic: [{required: true, message: '封面图不能为空'}],
                content: [{required: true, message: '资讯详情不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        submitUpload () {
            // 单图上传手动提交
            this.form.pic = '';
            this.$refs.thumbUpload.submit();
        },
        beforeThumbUpload (file) {
            const isLt2M = file.size / 1024 < 500;
            if (!isLt2M) {
                this.$message.error(file.name +  '图片大小不能超过 500kb!');
                return false
            } else {
                let formData = new FormData(document.getElementById('form'))
                formData.append('file', file)
                formData.set('model', 'info')
                let files = formData
                console.log(files.get('model'))
                this.$axios({
                    url: API_UPLOAD,
                    method: 'POST',
                    data: formData,
                    processData: false,
                    async: false,
                    contentType: false
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error_code == 0) {
                        this.form.pic = res.data.data.url
                        console.log(this.form)
                        // this.form.fileList.push(res.data.url)
                        this.$message.success('图片上传成功！')
                    }
                    console.log(this.form.pic)
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        submitThumbUpload () {
        },
        onSubmit (formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    // _this.form.token = _this.token
                    _this.$axios.post(BANNER_ADD, _this.form).then(res => {
                        console.log(res)
                        if(res.data.error_code == 0) {
                            // console.log(11111111111)
                            _this.$message.success('banner创建成功！');
                            _this.$router.push('/bannerlist')
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
