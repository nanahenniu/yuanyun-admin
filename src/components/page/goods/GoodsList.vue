<template>
<div class="wraper">
    <div class="container">
        <div class="handle-box">
        <!--<el-row :gutter="20">-->
                <!--<el-col :span="2"><el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button></el-col>-->
                <!--<el-col :span="3">-->
                        <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
                                <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                                <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                        <!--</el-select>-->
                <!--</el-col>-->
                <!--<el-col :span="3">-->
                        <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="6">-->
                        <!--<el-button type="primary" icon="search" @click="search">搜索</el-button>-->
                <!--</el-col>-->
        <!--</el-row>-->
                <el-row :gutter="20">
                        <el-col :span="4" class="total-num">共有数据： {{totalPage}}条</el-col>
                        <el-col :span="20" align="right"><el-button type="primary" icon="search" @click="createGood">创建商品</el-button></el-col>
                </el-row>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="title" label="商品名称" align="center">
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
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                    <el-button type="text" v-if="scope.row.status === 0" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">上架</el-button>
                    <el-button type="text" v-if="scope.row.status === 1" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">下架</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination v-if="totalPage > 10" background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
            </el-pagination>
        </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
        <el-form ref="form" :model="form" label-width="50px">
            <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
    </el-dialog>

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
import { GOODS_LIST, GOODS_DELETE } from '@/api/api-type'
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
		computed: {
        // data() {
        //     return this.tableData.filter((d) => {
        //         let is_del = false;
        //         for (let i = 0; i < this.del_list.length; i++) {
        //             if (d.name === this.del_list[i].name) {
        //                 is_del = true;
        //                 break;
        //             }
        //         }
        //         if (!is_del) {
        //             if (d.address.indexOf(this.select_cate) > -1 &&
        //                 (d.name.indexOf(this.select_word) > -1 ||
        //                     d.address.indexOf(this.select_word) > -1)
        //             ) {
        //                 return d;
        //             }
        //         }
        //     })
        // }
		},
        filters: {
            getStatus(val) {
                if (val == 1) {
                    return '上架'
                } else {
                    return '下架'
                }
            }
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
        // search() {
        //     this.is_search = true;
        // },
        formatter(row, column) {
            return row.address;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                name: item.name,
                date: item.date,
                address: item.address
            }
            this.editVisible = true;
        },
        //  删除商品
        handleDelete(index, row) {
            this.idx = index;
            this.goodId = row.id
            this.delVisible = true;
        },
        delAll() {
            const length = this.multipleSelection.length;
            let str = '';
            this.del_list = this.del_list.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error('删除了' + str);
            this.multipleSelection = [];
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 保存编辑
        saveEdit() {
            this.$set(this.tableData, this.idx, this.form);
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx+1} 行成功`);
        },
        // 确定删除
        deleteRow(){
            this.tableData.splice(this.idx, 1);
            this.$axios.post(GOODS_DELETE, {token: this.token, goods_id: this.goodId}).then(res => {
                if (res.data.error_code == 0) {
                    this.$message.success('删除成功');
                    this.delVisible = false;
                } else {
                    this.$message.waiting(res.data.error_msg)
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
