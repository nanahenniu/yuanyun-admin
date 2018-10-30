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
                :file-list="fileList"
                :auto-upload="true"
                :http-request='submitThumbUpload'
                :before-upload="beforeThumbUpload"
                list-type="picture"
                :on-remove="removeFile">
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>-->
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
import { BANNER_UPDATE, API_UPLOAD, BANNER_DETAIL} from '@/api/api-type'
export default {
    name: 'EditBanner',
    data () {
        return {
            bannerId:　this.$route.query.bannerId,
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            form: {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                title: '',
                sort: '',
                url: '',
                pic: '',
                // fileList: []
            },
            fileList: [],
            rules: {
                title: [{required: true, message: '资讯名称不能为空', trigger: 'blur' }],
                sort: [{required: true, message: '排序值不能为空', trigger: 'blur'}],
                pic: [{required: true, message: '封面图不能为空'}],
                content: [{required: true, message: '资讯详情不能为空', trigger: 'blur' }]
            }
        }
    },
    created() {
        let _this = this
        this.$axios.post(BANNER_DETAIL, {token: this.token, banner_id: this.bannerId}).then(res => {
            console.log(res)
            if (res.data.error_code == 0) {
                let result = res.data.data
                _this.form = {
                    token: localStorage.getItem('YY_ADMIN_TOKEN'),
                    title: result.title,
                    sort: result.sort,
                    url: result.url,
                    pic: result.pic,
                    // fileList: [{
                    //     name: result.pic,
                    //     name: result.pic
                    // }]
                }
                _this.fileList = [{
                    name: result.pic,
                    url: result.pic
                }]
            }
            
        })
    },
    methods: {
        beforeThumbUpload (file) {
            console.log(file)
            this.fileList = []
            const isLt2M = file.size / 1024 < 500;
            if (!isLt2M) {
                this.$message.error(file.name +  '图片大小不能超过 500kb!');
                return false
            } else {
                let formData = new FormData(document.getElementById('form'))
                formData.append('file', file)
                formData.set('model', 'info')
                this.$axios({
                    url: API_UPLOAD,
                    method: 'POST',
                    data: formData,
                    processData: false,
                    async: false,
                    contentType: false
                }).then((res) => {
                    // console.log(res.data.data)
                    if (res.data.error_code == 0) {
                        this.form.pic = res.data.data.url
                        let obj = {
                            name: res.data.data.url,
                            url: res.data.data.url
                        }
                        this.fileList.push(obj)
                        this.$message.success('图片上传成功！')
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        removeFile(file, fileList) {
            this.form.pic = ''
        },
        submitThumbUpload () {
        },
        delThumb(file, fileList) {
            this.form.thumb = []
        },
        onSubmit (formName) {
            let _this = this
            _this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.form.banner_id = _this.$route.query.bannerId
                    _this.$axios.post(BANNER_UPDATE, _this.form).then(res => {
                        console.log(res)
                        if(res.data.error_code == 0) {
                            // console.log(11111111111)
                            _this.$message.success('banner修改成功！');
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
