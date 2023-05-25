<template>
	<el-container>
		<el-container>
				<el-header>
					<div class="left-panel">
						<!-- <el-button type="primary" icon="el-icon-plus" @click="add">添加管理员</el-button>
						<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button> -->
						<!-- <el-button type="primary" plain :disabled="selection.length==0">分配角色</el-button>
						<el-button type="primary" plain :disabled="selection.length==0">密码重置</el-button> -->
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
              <el-select v-model="search.status" placeholder="状态" clearable style="width: 180px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
							<el-button type="primary" icon="el-icon-search" @click="getUser" :disabled="role.QUERY"></el-button>
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
						<el-table-column label="ID" prop="uid" width="180" align="center"></el-table-column>
						<el-table-column label="用户名" prop="userName" width="120" align="center"></el-table-column>
						<el-table-column label="真实姓名" prop="realName" width="120" align="center"></el-table-column>
						<el-table-column label="手机号" prop="mobile" width="120" align="center"></el-table-column>
						<el-table-column label="邮箱" prop="mail" width="180" align="center"></el-table-column>
            <el-table-column label="单位" prop="company" width="180" align="center"></el-table-column>
            <el-table-column label="开发者类型" prop="type" width="100" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.type === '0'" type='success' disable-transitions>个人开发者</el-tag>
								<el-tag v-show="scope.row.type === '1'" type='primary' disable-transitions>企业开发者</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="地区" prop="address" width="120" align="center"></el-table-column>
            <el-table-column label="是否认证" prop="truth" width="100" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.truth === '0'" type='success' disable-transitions>已认证</el-tag>
								<el-tag v-show="scope.row.truth === '1'" type='danger' disable-transitions>未认证</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="状态" prop="status" width="80" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.status === '0'" type='success' disable-transitions>正常</el-tag>
								<el-tag v-show="scope.row.status === '1'" type='danger' disable-transitions>禁止</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="登录IP地址" prop="loginIp" width="120" align="center"></el-table-column>
            <el-table-column label="登录时间" prop="loginTime" width="140" align="center"></el-table-column>
            <el-table-column label="登录次数" prop="loginCount" width="80" align="center"></el-table-column>
						<el-table-column label="操作" fixed="right" align="center" width="140">
							<template #default="scope">
								<el-button type="text" size="small" @click="table_edit(scope.row, scope.$index)" :disabled="role.EDIT">修改</el-button>
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
					<!-- <scTable ref="table" :data="group" @selection-change="selectionChange" stripe remoteSort remoteFilter>
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column label="ID" prop="uid" width="180"></el-table-column>
						<el-table-column label="用户名" prop="userName" width="120"></el-table-column>
						<el-table-column label="真实姓名" prop="realName" width="120"></el-table-column>
						<el-table-column label="手机号" prop="mobile" width="120"></el-table-column>
						<el-table-column label="邮箱" prop="mail" width="180"></el-table-column>
            <el-table-column label="单位" prop="company" width="180"></el-table-column>
            <el-table-column label="开发者类型" prop="type" width="100">
							<template #default="scope">
								<el-tag v-show="scope.row.status === '0'" type='success' disable-transitions>个人开发者</el-tag>
								<el-tag v-show="scope.row.status === '1'" type='danger' disable-transitions>企业开发者</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="地区" prop="address" width="120"></el-table-column>
            <el-table-column label="是否认证" prop="truth" width="100"></el-table-column>
						<el-table-column label="状态" prop="status" width="120">
							<template #default="scope">
								<el-tag v-show="scope.row.status === '0'" type='success' disable-transitions>正常</el-tag>
								<el-tag v-show="scope.row.status === '1'" type='danger' disable-transitions>禁止</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="登录IP地址" prop="loginIp" width="120"></el-table-column>
            <el-table-column label="登录时间" prop="loginTime" width="140"></el-table-column>
            <el-table-column label="登录次数" prop="loginCount" width="80"></el-table-column>
						<el-table-column label="操作" fixed="right" align="center" width="140">
							<template #default="scope">
								<el-button type="text" size="small" @click="table_edit(scope.row, scope.$index)">修改密码</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button type="text" size="small">删除</el-button>
									</template>
								</el-popconfirm>
							</template>
						</el-table-column>

					</scTable> -->
				</el-main>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'user',
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
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.user.getUser,
				selection: [],
				search: {
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
			this.getUser();
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
					uid: row.uid
				}
				var res = await this.$API.system.user.delUser.post(reqData);
				if(res.resultCode == "0000"){
					this.getUser()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					this.selection.forEach(item => {
						this.$refs.table.tableData.forEach((itemI, indexI) => {
							if (item.id === itemI.id) {
								this.$refs.table.tableData.splice(indexI, 1)
							}
						})
					})
					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getUser(){
        var data = {
          token: this.$TOOL.data.get("TOKEN"),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.search.status || ""
        };
				var res = await this.$API.system.user.getUser.post(data);
				if(res.resultCode == "0000"){
					this.group = res.data?.list;
					this.totalNum = res.data.totalNum;
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getUser();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
				this.pageNum = val;
				this.getUser();
        console.log(`当前页: ${val}`);
      },
			getIndex($index) {
				return (this.pageNum - 1)*this.pageSize + $index + 1
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
					this.getUser();
					// data.id = new Date().getTime()
					// this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.getUser();
					// this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
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
