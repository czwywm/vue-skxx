<template>
	<el-container>
		<el-container>
				<el-header>
					<div class="left-panel">
						<el-button type="primary" icon="el-icon-plus" @click="add" :disabled="role.ADD">添加设备</el-button>
						<!-- <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length == 0 && role.DELETE" @click="batch_del"></el-button> -->
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<!-- <el-input v-model="search.loginName" placeholder="登录名" clearable style="width: 200px"></el-input> -->
              <el-select v-model="search.status" placeholder="状态" clearable style="width: 180px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
							<el-button type="primary" icon="el-icon-search" @click="getDevice" :disabled="role.QUERY"></el-button>
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
            <!-- <el-table-column label="ID" prop="id" width="50" align="center"></el-table-column> -->
						<el-table-column label="设备编号" prop="deviceId" width="200" align="center"></el-table-column>
						<el-table-column label="设备名称" prop="deviceName" width="260" align="center"></el-table-column>
						<el-table-column label="绑定用户" prop="userName" width="120" align="center"></el-table-column>
            <el-table-column label="安装状态" prop="installStatus" width="120" align="center">
							<template #default="scope">
								<el-tag v-if="scope.row.status === '0'" type='success' disable-transitions>已安装</el-tag>
								<el-tag v-else type='danger' disable-transitions>未安装</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="设备类型" prop="deviceType" width="130" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.deviceType === '0'" disable-transitions>授时</el-tag>
								<el-tag v-show="scope.row.deviceType === '1'" disable-transitions>定位</el-tag>
								<el-tag v-show="scope.row.deviceType === '2'" disable-transitions>轨迹</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="当前时间" prop="Date" width="180" align="center"></el-table-column>
						<!-- <el-table-column label="状态" prop="status" width="120" align="center">
							<template #default="scope">
								<el-tag v-if="scope.row.status === '0'" type='success' disable-transitions>正常</el-tag>
								<el-tag v-else type='danger' disable-transitions>禁止</el-tag>
							</template>
						</el-table-column> -->
            <!-- <el-table-column label="设备地址" prop="address" width="200" align="center"></el-table-column> -->
            <!-- <el-table-column label="经度" prop="latitude" width="150" align="center"></el-table-column>
            <el-table-column label="纬度" prop="longitude" width="150" align="center"></el-table-column> -->
            <!-- <el-table-column label="在线状态" prop="online" width="120" align="center">
							<template #default="scope">
								<el-tag v-if="scope.row.status === '0'" type='success' disable-transitions>在线</el-tag>
								<el-tag v-else type='danger' disable-transitions>离线</el-tag>
							</template>
						</el-table-column> -->
						<!-- <el-table-column label="状态" width="130">
							<template #default="scope">
								<el-switch
									v-model="value"
									@click="changeStatus(scope.row, scope.$index)"
									active-color="#13ce66"
									inactive-color="#ff4949">
								</el-switch>
							</template>
						</el-table-column> -->
						<el-table-column label="操作" fixed="right" align="center" width="200">
							<template #default="scope">
								<el-button type="text" size="small" @click="table_bind(scope.row, scope.$index)">绑定用户</el-button>
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
	<bindsave-dialog v-if="dialog.bindUserSave" ref="bindUserSave" @success="handleSuccess1" @closed="dialog.bindUserSave=false"></bindsave-dialog>

</template>

<script>
	import saveDialog from './save'
	import bindsaveDialog from './bindUserSave'

	export default {
		name: 'device',
		components: {
			saveDialog,
			bindsaveDialog
		},
		data() {
			return {
				dialog: {
					save: false,
					bindUserSave: false
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
				apiObj: this.$API.system.device.getDecive,
				selection: [],
				search: {
					// loginName: '',
					status: ''
				},
				totalNum: 0,
				pageSize: 20,
				pageNum: 1,
				value: false
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		mounted() {
			this.getDevice();
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
			//绑定用户
			table_bind(row){
				this.dialog.bindUserSave = true
				this.$nextTick(() => {
					this.$refs.bindUserSave.open('bind').setData(row)
				})
			},
			//删除
			async table_del(row){
				var reqData = {
					token: this.$TOOL.data.get("TOKEN"),
					id: row.id,
					deviceId: row.deviceId,
					deviceName: row.deviceName,
					status: row.status
				}
				var res = await this.$API.system.device.delDevice.post(reqData);
				if(res.resultCode == "0000"){
					this.getDevice()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getDevice();
      },
      handleCurrentChange(val) {
				this.pageNum = val;
				this.getDevice();
      },
			getIndex($index) {
				return (this.pageNum - 1)*this.pageSize + $index + 1
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getDevice(){
				this.showGrouploading = true;
        // var userInfo = this.$TOOL.data.get("USER_INFO");
        let data = {
          token: this.$TOOL.data.get("TOKEN"),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.search.status || "",
					deviceType: "0"
        };
				var res = await this.$API.system.device.getDevice.post(data);
				if(res.resultCode == "0000"){
					this.group = res.data?.list;
					this.totalNum = res.data.totalNum;
					this.showGrouploading = false;
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
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
			//本地更新数据(新增、修改设备)
			handleSuccess(data, mode){
				if(mode=='add'){
					this.getDevice()
					// data.id = new Date().getTime()
					// this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.getDevice()
					// this.$refs.table.tableData.filter(item => item.uid===data.uid ).forEach(item => {
					// 	Object.assign(item, data)
					// })
				}
			},
			//本地更新数据(设备绑定用户)
			handleSuccess1(data, mode){
				if(mode=='bind'){
					this.getDevice()
				}
			},
			changeStatus(row) {
				console.log(row)
				console.log(this.value)
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
