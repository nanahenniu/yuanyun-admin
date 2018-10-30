<template>
<div class="container">
    <el-form id="form" ref="form"  :rules="rules" :model="form" label-width="100px">
       <el-form-item label="资讯名称：" prop="title">
           <el-input v-model="form.title" placeholder="请输入资讯名称"></el-input>
       </el-form-item>
        <el-form-item label="排序值：" prop="sort">
            <el-input v-model="form.sort" placeholder="请输入排序值"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐：" prop="type">
            <el-radio-group v-model="form.type">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="封面图片：" prop="thumb">
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
                :on-remove="delThumb">
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>-->
                <div slot="tip" class="el-upload__tip">支持JPG，PNG格式，单张大小请小于500Kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="商品详情:" prop="content">
            <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            <!--<el-button>重置</el-button>-->
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import bus from '../../common/bus';
import { quillEditor } from 'vue-quill-editor';
import { INFO_ADD, API_UPLOAD, INFO_DETAIL, INFO_UPDATE} from '@/api/api-type'
export default {
    name: 'AddInfo',
    data () {
        return {
            isEdit: this.$route.query.isEdit,
            infoId: this.$route.query.infoId,
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            form: {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                title: '',
                sort: '',
                type: '1',
                content: '',
                thumb: ''
            },
            fileList: [],
            rules: {
                title: [{required: true, message: '资讯名称不能为空', trigger: 'blur' }],
                sort: [{required: true, message: '排序值不能为空', trigger: 'blur'}],
                type: [{required: true}],
                thumb: [{required: true, message: '封面图不能为空'}],
                content: [{required: true, message: '资讯详情不能为空', trigger: 'blur' }]
            },
            editorOption: {
                placeholder: '请输入资讯详情'
            },
        }
    },
    components: {
        quillEditor
    },
    created () {
        if (this.isEdit) {
            this.initData()
            // this.$route.meta.title='修改资讯'
            // bus.$emit('newroute', this.$route.meta.title)
        }
        // console.log(this.$route.meta.title)
    },
    methods: {
        initData() {
            let _this = this;
            this.$axios.post(INFO_DETAIL, {token: localStorage.getItem('YY_ADMIN_TOKEN'), info_id: this.infoId}).then(res => {
                if (res.data.error_code == 0) {
                    let result = res.data.data
                    _this.form.title = result.title
                    _this.form.sort = result.sort
                    _this.form.type = result.type.toString()
                    _this.form.content = result.content
                    _this.form.thumb = result.thumb
                    _this.fileList = [{
                        name: result.thumb,
                        url: result.thumb
                    }]
                }
            })
        },
        // submitUpload () {
        //     // 单图上传手动提交
        //     this.form.thumb = '';
        //     this.$refs.thumbUpload.submit();
        // },
        beforeThumbUpload (file) {
            this.fileList = []
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
                        this.form.thumb = res.data.data.url
                        console.log(this.form)
                        let obj = {
                            name: res.data.data.url,
                            url: res.data.data.url
                        }
                        this.fileList.push(obj)
                        // console.log(this.fileList)
                        this.$message.success('图片上传成功！')
                    }
                    console.log(this.form.thumb)
                }).catch(function (error) {
                    console.log(error)
                })
            }
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
                    // _this.form.token = _this.token
                    _this.form.info_id = _this.infoId
                    if(_this.isEdit) {
                        _this.$axios.post(INFO_UPDATE, _this.form).then(res => {
                            console.log(res)
                            if(res.data.error_code == 0) {
                                // console.log(11111111111)
                                _this.$message.success('资讯修改成功！');
                                _this.$router.push('/infolist')
                            } else {
                                this.$message.error(res.data.error_msg)
                            }
                        })
                    } else {
                        _this.$axios.post(INFO_ADD, _this.form).then(res => {
                            console.log(res)
                            if(res.data.error_code == 0) {
                                // console.log(11111111111)
                                _this.$message.success('资讯创建成功！');
                                _this.$router.push('/infolist')
                            } else {
                                this.$message.error(res.data.error_msg)
                            }
                        })
                    }
            
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
