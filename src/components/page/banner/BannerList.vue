<template>
<div>
    <div class="container">
        <div class="handle-box">
            <el-row :gutter="20">
                <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                <el-col :span="20" align="right"><el-button type="primary" icon="search" @click="createInfo">新建banner</el-button></el-col>
            </el-row>
        </div>
        <el-table :data="listData" border class="table">
            <el-table-column
                prop="title"
                label="banner名称"
                width="180"
                align="center">
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序值"
                align="center">
            </el-table-column>
            <el-table-column
                prop="get_admin.name"
                label="发布人"
                align="center">
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建时间"
                align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" class="red" @click="edit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-view" class="red" @click="preview(scope.$index, scope.row)">查看</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination v-if="totalPage > 10" background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>
    </div>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="picVisible" width="40%" center :before-close="handleClose">
        <div class="del-dialog-cnt">
            <img :src="previewUrl" width="100%">
        </div>
    </el-dialog>
</div>
</template>

<script>
import { BANNER_LIST, BANNER_DELETE} from '@/api/api-type'
export default {
  name: 'BannerList',
  data () {
    return {
        token: localStorage.getItem('YY_ADMIN_TOKEN'),
        listData: [],
        params: {
            token:localStorage.getItem('YY_ADMIN_TOKEN'),
            page: 1,
            pagesize: 10
        },
        totalPage: 0,
        delVisible: false,
        picVisible: false,
        idx: -1,
        bannerId: 0,
        previewUrl: ''
    }
  },
  created() {
      this.initData()
  },
  methods: {
      initData() {
          this.$axios.post(BANNER_LIST, this.params).then(res => {
              if (res.data.error_code == 0) {
                  this.listData = res.data.data.data
                  this.totalPage = res.data.data.count
              }
              if (res.data.error_code == 9002) {
                  this.totalPage = 0
              }
              console.log(res.data.data)
          })
      },
      handleDelete(index, row) {
          this.idx = index;
          this.bannerId = row.id
          this.delVisible = true;
      },
      // 确定删除
      deleteRow(){
          let _this = this;
          this.listData.splice(this.idx, 1);
          this.$axios.post(BANNER_DELETE, {token: this.token, banner_id: this.bannerId}).then(res => {
              if (res.data.error_code == 0) {
                  this.$message.success('删除成功');
                  this.delVisible = false;
                  _this.initData()
              } else {
                  this.$message.waiting(res.data.error_msg)
              }
          })
      },
      // 新建资讯
      createInfo() {
          this.$router.push('/addbanner')
      },
      preview(index, row) {
          this.picVisible = true
          console.log(row)
          this.previewUrl = row.pic
      },
      handleClose(done) {
          this.previewUrl = ''
          done()
      },
      edit(index, row) {
        this.$router.push({
            path: 'editbanner',
            query: {
                bannerId: row.id
            }
        })
      }
  }
}
</script>

<style scoped lang="less">
.handle-box{
    margin-bottom: 20px;
    .total-num{
        font-size: 14px;
        color: #333;
        line-height: 32px;
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
}
</style>
