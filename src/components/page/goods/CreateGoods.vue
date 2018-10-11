<template>
<div class="wraper">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-calendar"></i>商品</el-breadcrumb-item>
            <el-breadcrumb-item>创建商品</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <div class="form-box">
            <el-form id="form" ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="商品标题:" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="商品描述:">
                    <el-input class="textarea" resize="none" type="textarea" rows="5" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="分类:" prop="category_id">
                    <el-select v-model="form.category_id" placeholder="请选择">
                        <el-option v-for="(list, index) in categoryList" :key="index" :label="list.title" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品封面:" prop="thumb">
                    <el-upload
                        class="upload-demo"
                        ref="thumbUpload"
                        action=""
                        name="thumbUpload"
                        accept="image/jpeg,image/gif,image/png"
                        :limit="1"
                        :file-list="fileList"
                        :auto-upload="false"
                        :before-upload="beforeThumbUpload"
                        :http-request='submitThumbUpload'
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
                        <div slot="tip" class="el-upload__tip">展示在商品列表和主页的产品封面图,可上传多张，支持JPG，PNG格式，文件大小请不要超过300KB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品图组:" prop="pic">
                    <el-upload
                        class="upload-demo"
                        ref="picUpload"
                        action=""
                        accept="image/jpeg,image/gif,image/png"
                        :file-list="fileLists"
                        :auto-upload="false"
                        :multiple="true"
                        :http-request='submitPicUpload'
                        :before-upload="beforePicUpload"
                        list-type="picture">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploads">上传文件</el-button>
                        <div slot="tip" class="el-upload__tip">展示在商品详情中的产品图组,可上传多张，支持JPG，PNG格式，文件大小请不要超过300KB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="当前状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">上架</el-radio>
                        <el-radio label="0">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品排序:">
                    <el-input  class="small-input"  v-model="form.sort"></el-input>
                </el-form-item>
                <el-form-item label="附加销售量:">
                    <el-input  class="small-input"  v-model="form.anum"></el-input>
                </el-form-item>
                <el-form-item label="商品价格:" prop="price">
                    <el-input  class="small-input"  v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="商品详情:" prop="content">
                    <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import { GOODS_ADD, API_UPLOADS, API_UPLOAD, CATEGORY_LIST } from '@/api/api-type';
export default {
  name: 'CreateGoods',
    data: function(){
    
    return {
        token: localStorage.getItem('YY_ADMIN_TOKEN'),
        form: {
            title: '',
            desc: '',
            category_id: '',
            thumb: '', // 缩略图
            pic: [], // 图组
            status: '1',     // 上下架
            sort: '', // 商品排序
            anum: '', //附加销售量
            content: '', // 图文详情
            price: ''
        },
        rules: {
            title: [ { required: true, message: '商品名称不能为空', trigger: 'blur' }],
            category_id: [ { required: true, message: '选择分类不能为空',  trigger: 'blur'} ],
            thumb: [ { required: true, message: '商品图组不能为空'} ],
            pic: [ { required: true, message: '商品图组不能为空'} ],
            status: [ { required: true, message: '商品状态不能为空',  trigger: 'blur'} ],
            content: [ { required: true, message: '商品详情不能为空',  trigger: 'blur' } ],
            price: [ { required: true, message: '商品价格不能为空',  trigger: 'blur' } ]
        },
        editorOption: {
            placeholder: '请输入商品详情'
        },
        imageUrl: '',
        fileList: [], // 封面文件上传
        fileLists: [], // 多组文件上传
        categoryList: '' // 缩略图
        // pic: [] // 图组
    }
    },
    components: {
        quillEditor
    },
    created() {
      this.$axios.post(CATEGORY_LIST, {token: this.token, page: 1, pagesize: 100}).then(res => {
          if(res.data.error_code == 0) {
              this.categoryList = res.data.data.data
          }
          console.log(this.categoryList)
      })
    },
    methods: {
        submitUpload () {
            // 单图上传手动提交
            this.form.thumb = '';
            this.$refs.thumbUpload.submit();
        },
        submitUploads () {
            // 多图上传手动提交
            this.form.pic = [];
            this.$refs.picUpload.submit();
        },
        onSubmit(formName) {
            let _this = this
            // this.$refs.picUpload.submit();
            // this.$refs.thumbUpload.submit();
            setTimeout(function () {
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.form.token = _this.token
                        _this.$axios.post(GOODS_ADD, _this.form).then(res => {
                            console.log(res)
                            if(res.data.error_code == 0) {
                                console.log(11111111111)
                                _this.$message.success('商品创建成功！');
                                _this.$router.push('/goodslist')
                            } else {
                                this.$message.error(res.data.error_msg)
                            }
                        })
                       
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },1000)

            // this.$message.success('提交成功！');
        },
        submitThumbUpload(file) {
            // 不可删除
        },
        beforeThumbUpload(file) {
            const isLt2M = file.size / 1024 < 300;
            if (!isLt2M) {
                this.$message.error(file.name +  '图片大小不能超过 300kb!');
                return false
            } else {
                let formData = new FormData(document.getElementById('form'))
                formData.append('file', file)
                formData.set('model', 'goods')
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
                        this.$message.success('图片上传成功！')
                    }
                    console.log(this.form.thumb)
                }).catch(function (error) {
                    console.log(error)
                })
            }

        },
        submitPicUpload(content) {
            // 不可删除
        },
        beforePicUpload(file) {
            const isLt2M = file.size / 1024 < 300;
            if (!isLt2M) {
                this.$message.error(file.name + '图片大小不能超过 300kb!');
                return false
            } else {
                console.log(file.name)
                console.log(111)
                let formData = new FormData(document.getElementById('form'))
                formData.append('file[]',file)
                formData.set('model', 'goods')
                let files = formData
                console.log(files.getAll('file'))
                this.$axios({
                    url: API_UPLOADS,
                    method: 'POST',
                    data: formData,
                    processData: false,
                    async: false,
                    contentType: false
                }).then((res) => {
                    console.log(res.data)
                    if (res.data.error_code == 0) {
                        this.form.pic.push(res.data.data[0].url);
                        this.$message.success('图片上传成功！')
                        console.log(this.form.pic)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
            // return isLt2M;
        }
    }
  }
</script>

<style>

</style>
<style scoped lang="less">
.form-box{
    width: 80%;
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 140px;
        height: 140px;
        line-height: 140px;
        text-align: center;
    }
    .avatar {
        width: 140px;
        height: 140px;
        display: block;
    }
    .small-input{
        width: 215px;
    }
}
</style>
