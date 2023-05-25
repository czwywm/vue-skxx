<template>
	<el-container>
		<el-container>
				<el-header>
					<div class="left-panel">
						<el-button type="primary" icon="el-icon-plus" @click="add" :disabled="role.ADD">添加管理员</el-button>
						<!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length == 0 && role.DELETE" @click="batch_del"></el-button> -->
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<el-input v-model="search.loginName" placeholder="登录名" clearable style="width: 200px"></el-input>
              <el-select v-model="search.status" placeholder="状态" clearable style="width: 200px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
						<el-table-column label="编号" prop="uid" width="240" align="center"></el-table-column>
						<el-table-column label="登录名" prop="loginName" width="180" align="center"></el-table-column>
						<el-table-column label="管理名" prop="adminName" width="180" align="center"></el-table-column>
						<!-- <el-table-column label="目录权限" prop="menuList" width="150"></el-table-column>
						<el-table-column label="操作权限" prop="roleList" width="150"></el-table-column> -->
						<el-table-column label="状态" prop="status" width="120" align="center">
							<template #default="scope">
								<el-tag v-if="scope.row.status === '0'" type='success' disable-transitions>正常</el-tag>
								<el-tag v-else type='danger' disable-transitions>禁止</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="登录IP地址" prop="loginIp" width="220" align="center"></el-table-column>
            <el-table-column label="登录时间" prop="loginTime" width="220" align="center"></el-table-column>
            <el-table-column label="登录次数" prop="loginCount" width="100" align="center"></el-table-column>
						<el-table-column label="操作" fixed="right" align="center" width="260">
							<template #default="scope">
								<el-button type="text" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
								<el-button type="text" size="small" @click="table_edit(scope.row, scope.$index)" :disabled="role.EDIT">编辑</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button type="text" size="small" :disabled="role.DELETE">删除</el-button>
									</template>
								</el-popconfirm>
							</template>
						</el-table-column>
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
		name: 'manager',
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
          label: '正常'
        }, {
          value: '1',
          label: '禁止'
        }],
				showGrouploading: false,
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.manager.getAdmin,
				selection: [],
				search: {
					loginName: '',
					status: ''
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
			this.getAdmin();
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
					uid: row.uid,
					token: this.$TOOL.data.get("TOKEN")
				}
				var res = await this.$API.system.manager.delAdmin.post(reqData);
				if(res.resultCode == "0000"){
					this.getAdmin()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			//批量删除
			batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					 var counter = this.selection.length;
					const loading = this.$loading();
					this.selection.forEach((item,index) => {
						var delData = {
							uid: item.uid,
							token: this.$TOOL.data.get("TOKEN")
						}
						var res = this.$API.system.manager.delAdmin.post(delData);
						res.then((result) => {
							if (result.resultCode === "0000" && index === counter - 1) {
								console.log("index", index)
								this.getAdmin()
							}
						})
					})
					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {
				})
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getAdmin();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
				this.pageNum = val;
				this.getAdmin();
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
			async getAdmin(){
				this.showGrouploading = true;
        // var userInfo = this.$TOOL.data.get("USER_INFO");
        let data = {
          token: this.$TOOL.data.get("TOKEN"),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          loginName: this.search.loginName || "",
          status: this.search.status || ""
        };
				var res = await this.$API.system.manager.getAdmin.post(data);
				if(res.resultCode == "0000"){
					this.group = res.data?.list;
					this.totalNum = res.data.totalNum;
					this.showGrouploading = false;
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
					this.getAdmin()
					// data.id = new Date().getTime()
					// this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.getAdmin()
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
