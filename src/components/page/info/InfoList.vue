<template>
<div>
    <div class="container">
        <div class="handle-box">
            <el-row :gutter="20">
                <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                <el-col :span="20" align="right"><el-button type="primary" icon="search" @click="createInfo">新建资讯</el-button></el-col>
            </el-row>
        </div>
        <el-table :data="infoListData" border class="table">
            <el-table-column
                prop="title"
                label="资讯名称"
                width="180"
                align="center">
                <template slot-scope="scope">
                    <router-link :to="{path: '/infodetail',  query: {infoId: scope.row.id}}">{{scope.row.title}}</router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="是否推荐"
                width="180"
                align="center"
                :formatter="fiflterType">
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
                prop="view"
                label="真实浏览"
                align="center">
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建时间"
                align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit-outline" class="red" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
</div>
</template>

<script>
import { INFO_LIST, INFO_DELETE} from '@/api/api-type'
export default {
  name: 'InfoList',
  data () {
    return {
        token: localStorage.getItem('YY_ADMIN_TOKEN'),
        infoListData: [],
        params: {
            token:localStorage.getItem('YY_ADMIN_TOKEN'),
            page: 1,
            pagesize: 10
        },
        totalPage: 0,
        delVisible: false,
        idx: -1,
        infoId: 0
    }
  },
  created() {
      this.initData()
  },
  methods: {
      initData() {
          this.$axios.post(INFO_LIST, this.params).then(res => {
              if (res.data.error_code == 0) {
                  this.infoListData = res.data.data.data
                  this.totalPage = res.data.data.count
              }
              if (res.data.error_code == 9002) {
                  this.totalPage = 0
              }
              console.log(res.data.data)
          })
      },
      fiflterType(row, column, cellValue, index) {
          if (cellValue !== null) {
              if (cellValue == 1) {
                  return '推荐'
              } else {
                  return '不推荐'
              }
          }
      },
      handleDelete(index, row) {
          this.idx = index;
          this.infoId = row.id
          this.delVisible = true;
      },
      // 确定删除
      deleteRow(){
          this.infoListData.splice(this.idx, 1);
          let _this = this;
          this.$axios.post(INFO_DELETE, {token: this.token, info_id: this.infoId}).then(res => {
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
          this.$router.push('/addinfo')
      },
      handleEdit(index, row) {
          this.$router.push({
              path: '/addinfo',
              query: {
                  isEdit: true,
                  infoId: row.id
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
