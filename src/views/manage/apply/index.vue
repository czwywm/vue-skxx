<template>
	<el-container>
		<el-container>
				<el-header>
					<div class="left-panel">
						<!-- <el-button type="primary" icon="el-icon-plus" @click="add" :disabled="role.ADD">创建应用</el-button> -->
						<!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length == 0 && role.DELETE" @click="batch_del"></el-button> -->
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<el-input v-model="search.userName" placeholder="用户名" clearable style="width: 200px"></el-input>
              <el-select v-model="search.applytype" placeholder="应用类型" clearable style="width: 200px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
							<el-input v-model="search.applyName" placeholder="应用名称" clearable style="width: 200px"></el-input>
							<el-button type="primary" icon="el-icon-search" @click="getAdmin" :disabled="role.QUERY"></el-button>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<el-table :data="group" height="calc(100vh - 240px)"  @selection-change="selectionChange" style="width: 100%;">
						<!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
						<el-table-column label="序号" type="index" width="80" align="center" :index="getIndex">
							<template #scope>
								<span>{{scope.$index + (pageNum-1)*pageSize + 1}}</span>
							</template>
						</el-table-column>
            <el-table-column label="应用ID" prop="Id" width="70" align="center"></el-table-column>
						<el-table-column label="用户ID" prop="uid" width="240" align="center"></el-table-column>
						<el-table-column label="用户名" prop="userName" width="220" align="center"></el-table-column>
						<el-table-column label="应用类型" prop="applytype" width="150" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.applytype === '0'" disable-transitions>授时</el-tag>
								<el-tag v-show="scope.row.applytype === '1'" disable-transitions>定位</el-tag>
								<el-tag v-show="scope.row.applytype === '2'" disable-transitions>轨迹</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="应用名称" prop="applyname" width="240" align="center"></el-table-column>
						<el-table-column label="密钥" prop="askey" width="300" align="center"></el-table-column>
            <el-table-column label="备注" prop="remark" width="240" align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="240" align="center"></el-table-column>
						<!-- <el-table-column label="操作" fixed="right" align="center" width="200">
							<template #default="scope">
								<el-button type="text" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
								<el-button type="text" size="small" @click="table_edit(scope.row, scope.$index)" :disabled="role.EDIT">编辑</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button type="text" size="small" :disabled="role.DELETE">删除</el-button>
									</template>
								</el-popconfirm>
							</template>
						</el-table-column> -->
					</el-table>
					 <el-pagination
						background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage4"
						:page-sizes="[20, 50, 100]"
						:page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="totalNum">
					</el-pagination>
				</el-main>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'apply',
		components: {
			saveDialog
		},
		data() {
			return {
				dialog: {
					save: false
				},
				role: {
					QUERY: true,
					ADD: true,
					EDIT: true,
					DELETE: true,
					SET: true,
					INPORT: true,
					EXPORT: true
				},
        options: [{
          value: '0',
          label: '授时'
        }, {
          value: '1',
          label: '定位'
        },{
          value: '2',
          label: '轨迹'
        }],
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.device.getDecive,
				selection: [],
				search: {
					userName: '',
					applytype: '',
					applyName: ''
				},
				totalNum: 0,
				pageSize: 20,
				pageNum: 1
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		mounted() {
			this.getApply();
			var roleList = this.$TOOL.data.get("ROLE");
			for(let k in this.role) {
				if(roleList.indexOf(k)>-1) {
					this.role[k] = false
				}
			}
		},
		methods: {
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//删除
			async table_del(row){
				var reqData = {
					token: this.$TOOL.data.get("TOKEN"),
					Id: row.Id,
					deviceId: row.deviceId,
					deviceName: row.deviceName,
					status: row.status
				}
				var res = await this.$API.system.device.delDevice.post(reqData);
				if(res.resultCode == "0000"){
					this.getApply()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getApply();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
				this.pageNum = val;
				this.getApply();
        console.log(`当前页: ${val}`);
      },
			getIndex($index) {
				return (this.pageNum - 1)*this.pageSize + $index + 1
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getApply(){
        // var userInfo = this.$TOOL.data.get("USER_INFO");
        let data = {
          token: this.$TOOL.data.get("TOKEN"),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
					userName: this.search.userName || "",
          applytype: this.search.applytype || "",
					applyName: this.search.applyName || ""
        };
				var res = await this.$API.system.apply.getApply.post(data);
				if(res.resultCode == "0000"){
					this.group = res.data?.list;
					this.totalNum = res.data.totalNum;
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
				// var allNode ={id: '', label: '所有'}
				// res.data.list.unshift(allNode);
			},
			//树过滤
			groupFilterNode(value, data){
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			//树点击事件
			groupClick(data){
				var params = {
					groupId: data.id
				}
				this.$refs.table.reload(params)
			},
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
			//本地更新数据
			handleSuccess(data, mode){
				if(mode=='add'){
					this.getApply()
					// data.id = new Date().getTime()
					// this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.getApply()
					// this.$refs.table.tableData.filter(item => item.uid===data.uid ).forEach(item => {
					// 	Object.assign(item, data)
					// })
				}
			}
		}
	}
</script>

<style scoped>
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
