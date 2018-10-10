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
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品封面:" prop="thumb">
                    <!--<el-upload-->
                        <!--class="avatar-uploader"-->
                        <!--ref="thumbUpload"-->
                        <!--v-model="form.thumb"-->
                        <!--action=""-->
                        <!--:show-file-list="false"-->
                        <!--:on-success="handleAvatarSuccess"-->
                        <!--:before-upload="beforeAvatarUpload"-->
                        <!--:auto-upload="false">-->
                        <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <!--<div slot="tip" class="el-upload__tip">展示在商品列表和主页的产品封面图,可上传多张，支持JPG，PNG格式，文件大小请不要超过300KB</div>-->
                    <!--</el-upload>-->
                    <el-upload
                        class="upload-demo"
                        ref="thumbUpload"
                        action=""
                        name="thumbUpload"
                        :file-list="fileList1"
                        :auto-upload="false"
                        :before-upload="beforeThumbUpload"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">展示在商品列表和主页的产品封面图,可上传多张，支持JPG，PNG格式，文件大小请不要超过300KB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品图组:">
                    <el-upload
                        class="upload-demo"
                        ref="picUpload"
                        action=""
                        :file-list="fileList2"
                        :auto-upload="false"
                        :multiple="true"
                        :before-upload="beforePicUpload  "
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
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
import { GOODS_ADD, API_UPLOADS, API_UPLOAD } from '@/api/api-type';
export default {
  name: 'CreateGoods',
    data: function(){
        return {
            token: localStorage.getItem('YY_ADMIN_TOKEN'),
            options:[
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            form: {
                title: '',
                desc: '',
                category_id: '',
                thumb: [], // 缩略图
                pic: [], // 图组
                type: ['步步高'],
                status: '1',     // 上下架
                sort: '', // 商品排序
                anum: '', //附加销售量
                content: '', // 图文详情
                price: ''
            },
            rules: {
                title: [ { required: true, message: '活动名称不能为空', trigger: 'blur' }],
                category_id: [ { required: true, message: '选择分类不能为空',  trigger: 'blur'} ],
                thumb: [ { required: true, message: '商品封面不能为空'} ],
                pic: [ { required: true, message: '商品图组不能为空'} ],
                status: [ { required: true, message: '商品状态不能为空',  trigger: 'blur'} ],
                content: [ { required: true, message: '商品详情不能为空',  trigger: 'blur' } ],
                price: [ { required: true, message: '商品价格不能为空',  trigger: 'blur' } ]
            },
            editorOption: {
                placeholder: '请输入商品详情'
            },
            imageUrl: '',
            fileList1: [],
            fileList2: []
        }
    },
    components: {
        quillEditor
    },
    methods: {
        onSubmit(formName) {
            this.$refs.picUpload.submit()
            // this.$refs.thumbUpload.submit()
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //         this.form.token = this.token
            //         this.$axios.post(GOODS_ADD, this.form).then(res => {
            //             console.log(res)
            //         })
            //         alert('submit!');
            //     } else {
            //         console.log('error submit!!');
            //         return false;
            //     }
            // });
            // this.$message.success('提交成功！');
        },
        beforeThumbUpload(file) {
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
                console.log(res)
            }).catch(function (error) {
                console.log(error)
            })
            // const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;
						//
            // if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            // if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isJPG && isLt2M;
        },
        beforePicUpload(file) {
            let formData = new FormData(document.getElementById('form'))
            console.log(file.length)
            // formData.append('file', file)
            // formData.set('model', 'goods')
            // let files = formData
            // console.log(files.get('model'))
            this.$axios({
                url: API_UPLOADS,
                method: 'POST',
                data: formData,
                processData: false,
                async: false,
                contentType: false
            }).then((res) => {
                console.log(res)
            }).catch(function (error) {
                console.log(error)
            })
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
