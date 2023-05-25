<template>
  <div>
    <div class="search-div">
      <el-row>
        <el-col :span="4">
          <el-input placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-search"></el-button>
        </el-col>
      </el-row>
    </div>
    <div class="button-div">
      <el-button type="primary" class="search-button" icon="el-icon-plus" @click="add">创建应用</el-button>
      <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del">回收站</el-button>
    </div>
    <div class="table-div">
      <scTable ref="table" :data="tableData" row-key="id" @selection-change="selectionChange" stripe height="calc(100vh - 240px)">
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="应用编号" prop="id" width="120"></el-table-column>
				<el-table-column label="应用名称" prop="name" width="120"></el-table-column>
				<el-table-column label="访问应用（AK）" prop="chart" width="120"></el-table-column>
				<el-table-column label="应用类别" prop="type" width="120">
					<!-- <template #default="scope">
						<sc-status-indicator v-if="scope.row.boolean" type="success"></sc-status-indicator>
						<sc-status-indicator v-if="!scope.row.boolean" pulse type="danger"></sc-status-indicator>
					</template> -->
				</el-table-column>
				<el-table-column label="备注信息" prop="mark" width="250"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="150">
					<template #default="scope">
						<!-- <el-button plain size="small" @click="table_show(scope.row)">查看</el-button> -->
						<el-button type="text" size="small" @click="table_edit(scope.row)">设置</el-button>
						<!-- <el-button type="primary" plain size="small" @click="table_edit_page(scope.row)">页面编辑</el-button> -->
						<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
							<template #reference>
								<el-button type="text" size="small">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</scTable>
        <!-- <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          height="calc(100vh - 298px)"
          @selection-change="handleSelectionChange">
          <el-table-column
            prop="id"
            label="应用编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="应用名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="chart"
            label="访问应用（AK）"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type"
            label="应用类别"
            width="120">
          </el-table-column>
          <el-table-column
            prop="mark"
            label="备注信息"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="应用配置" fixed="right" align="right" width="140">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="table_edit(scope.row, scope.$index)"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定删除吗？"
                @confirm="table_del(scope.row, scope.$index)"
              >
                <template #reference>
                  <el-button type="text" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-style">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="12">
          </el-pagination>
        </div> -->
      </div>
  </div>
  <save-dialog
    v-if="dialog.save"
    ref="saveDialog"
    @success="handleSuccess"
    @closed="dialog.save = false"
  ></save-dialog>
</template>
<script>
  import saveDialog from "./save";

  export default {
    name: "position",
    components: {
      saveDialog,
    },
    data() {
      return {
        dialog: {
          save: false,
        },
        // apiObj: this.$API.system.myapply.getMyApply,
        tableData: [{
          id: '1',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '2',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '3',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '4',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '5',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '6',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '7',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '8',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '9',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '10',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '11',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },{
          id: '12',
          name: '某某应用',
          status: '0',
          chart: 'xxx',
          type: '类型一',
          mark: '上海市普陀区金沙江路 1518 弄',
        },],
        selection: []
      }
    },
     methods: {
      //添加
      add() {
        this.dialog.save = true;
        this.$nextTick(() => {
          this.$refs.saveDialog.open();
        });
      },
      //编辑
      table_edit(row) {
        this.dialog.save = true;
        this.$nextTick(() => {
          this.$refs.saveDialog.open("edit").setData(row);
        });
      },
      //删除
      // async table_del(row, index) {
      //   var reqData = { 
      //     token: this.$TOOL.data.get("TOKEN"),
      //     id: JSON.stringify(row.id) 
      //   };
      //   var res = await this.$API.system.myapply.delMyApply.post(reqData);
      //   if (res.resultcode == "0000") {
      //     //这里选择刷新整个表格 OR 插入/编辑现有表格数据
      //     this.$refs.table.tableData.splice(index, 1);
      //     this.$message.success("删除成功");
      //   } else {
      //     this.$alert(res.message, "提示", { type: "error" });
      //   }
      // },
      //表格选择后回调事件
			selectionChange(selection){
				this.selection = selection
			},
      //本地更新数据
			handleSaveSuccess(data, mode){
				//为了减少网络请求，直接变更表格内存数据
				if(mode=='add'){
					this.$refs.table.unshiftRow(data)
				}else if(mode=='edit'){
					this.$refs.table.updateKey(data)
				}
				//当然也可以暴力的直接刷新表格
				// this.$refs.table.refresh()
			},
      //批量删除
			async batch_del(){
				var confirmRes = await this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).catch(() => {})

				if(!confirmRes){
					return false
				}

				var ids = this.selection.map(v => v.id)
				this.$refs.table.removeKeys(ids)
				this.$message.success("操作成功")

			},
      // handleSelectionChange(val) {
      //   this.multipleSelection = val;
      // },
      // handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      // },
      // handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      // },
    }
  }
</script>
<style scoped>
.search-div {
  margin: 8px 1% 2px 1%;
  width: 98%;
  height: 35px;
}
.search-button {
  border-radius: 10px;
}
.button-div {
  display: flex;
  margin: auto 1%;
  width: 98%;
  height: 40px;
  line-height: 40px;
  padding: 5px 0px;
}
.pagination-style {
  position: absolute;
  height: 50px;
  width: 100%;
  bottom: 0px;
  left: 50%;
}
.table-div {
  margin: 6px 1% auto 1%;
  width: 98%;
}
::v-deep .el-table th.el-table__cell {
  color:#fff;
  background-color: #0070c0;
}
::v-deep .el-table tr {
  background-color: #f2f2f2;
}
::v-deep .el-table th.el-table__cell>.cell {
  font-size: 13px;
  text-align: center;
}
::v-deep .el-table .cell {
  text-align: center;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #0070c0;
}
</style>