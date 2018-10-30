<template>
<div class="wraper">
    <div class="container">
        <div class="handle-box">
            <el-row :gutter="20">
                    <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                    <el-col :span="20" align="right"><el-button type="primary" icon="search" @click="createGood">创建商品</el-button></el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable">
            <el-table-column prop="title" label="商品名称" align="center">
                <template slot-scope="scope">
                    <router-link to="">{{scope.row.title}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="get_category.title" label="分类" align="center">
            </el-table-column>
            <el-table-column prop="status" label="商品状态" align="center" :formatter='filterStatus'>
            </el-table-column>
            <el-table-column prop="type" label="推荐状态" align="center" :formatter="filterType">
            </el-table-column>
            <el-table-column prop="price" label="价格" align="center">
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="center">
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="320">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="scope.row.status === 0" @click="handleChange(scope.$index, scope.row)">上架</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.status === 1" @click="handleChange(scope.$index, scope.row)">下架 </el-button>
                    <el-button type="text" :icon=" 'el-icon-star-' + (scope.row.type === 0 ? 'on' : 'off')" class="red"  @click="handleRecommond(scope.$index, scope.row)">{{scope.row.type === 0 ? '推荐' : '不推荐'}}</el-button>
                    <el-button type="text" icon="el-icon-edit-outline" class="red" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
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
import { GOODS_LIST, GOODS_DELETE, GOODS_STATUS, GOODS_TYPE } from '@/api/api-type'
export default {
	name: 'Goods',
		data() {
            return {
                token: localStorage.getItem('YY_ADMIN_TOKEN'),
                url: GOODS_LIST,
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    goodName: '', // 商品名称
                    catogrey: '', // 分类
                    goodStatus: '', // 商品状态
                    recommendStatus: '', // 推荐状态
                    price: '', // 价格
                    sort: '', // 排序
                    createTime: '', // 创建时间
                    address: ''
                },
                idx: -1,
                totalPage: 0, // 总页数
                goodId: 0
            }
		},
		created() {
            this.getData();
		},
		methods: {
		// 创建商品
		createGood() {
		    this.$router.push('/creategoods')
        },
		// 分页导航
		handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
		},
        // 获取 easy-mock 的模拟数据
        getData() {
            this.$axios.post(GOODS_LIST, {
                page: this.cur_page,
                pagesize: 10,
                token: this.token
            }).then((res) => {
                if (res.data.error_code == 0) {
                    console.log(res.data.data.data)
                    this.totalPage = res.data.data.count
                    this.tableData = res.data.data.data;
                }
                if (res.data.error_code == 9002) {
                    this.totalPage = 0
                }
            })
        },
        filterStatus (row, column, cellValue, index) {
            if (cellValue !== null) {
                if (cellValue == 1) {
                    return '上架'
                } else {
                    return '下架'
                }
            }
        },
        filterType(row, column, cellValue, index) {
            if (cellValue !== null) {
                if (cellValue == 1) {
                    return '推荐'
                } else {
                    return '不推荐'
                }
            }
        },
        // 上下架
        handleChange(index, row) {
		    let _this = this
		    this.$axios.post(GOODS_STATUS, {token: this.token, goods_id: row.id}).then(res => {
		        if (res.data.error_code == 0) {
		            _this.getData()
                }
		        console.log(1111111111)
            })
        },
        // 推荐不推荐
        handleRecommond(index, row) {
            let _this = this
            this.$axios.post(GOODS_TYPE, {token: this.token, goods_id: row.id}).then(res => {
                if (res.data.error_code == 0) {
                    _this.getData()
                }
                console.log(22222)
            })
        },
        //  删除商品
        handleDelete(index, row) {
            this.idx = index;
            this.goodId = row.id
            this.delVisible = true;
        },
        // 确定删除
        deleteRow(){
            this.tableData.splice(this.idx, 1);
            let _this = this;
            this.$axios.post(GOODS_DELETE, {token: this.token, goods_id: this.goodId}).then(res => {
                if (res.data.error_code == 0) {
                    this.$message.success('删除成功');
                    this.delVisible = false;
                    _this.getData();
                } else {
                    this.$message.waiting(res.data.error_msg)
                }
            })
        },
        handleUpdate(index, row) {
		    this.$router.push({
                path: '/creategoods',
                query: {
                    isEdit: true,
                    goods_id: row.id
                }
		    })
        }
    }
}
</script>

<style scoped lang="less">
.wraper{
    .handle-box {
        margin-bottom: 20px;
        .total-num{
            font-size: 14px;
            color: #333;
            line-height: 32px;
        }
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
}
</style>
