<template>
	<el-container>
		<!-- <el-aside width="200px" v-loading="showGrouploading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="groupFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="group" class="menu" node-key="id" :data="group" :current-node-key="''" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="groupFilterNode" @node-click="groupClick"></el-tree>
				</el-main>
			</el-container>
		</el-aside> -->
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
              <el-input v-model="search.module" placeholder="操作模块" clearable style="width: 200px"></el-input>
							<el-input v-model="search.content" placeholder="操作内容" clearable style="width: 200px"></el-input>
							<el-date-picker v-model="search.startTime" type="datetime" placeholder="开始时间" @change="getstartTime" style="width: 200px"></el-date-picker>
							<el-date-picker v-model="search.endTime" type="datetime" placeholder="结束时间" @change="getsendTime" style="width: 200px"></el-date-picker>
							<!-- <el-date-picker v-model="search.time" key="time" align="center" value-format="YYYY-MM-DD" format="YYYY-MM-DD" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleDataChange"></el-date-picker> -->
							<el-button type="primary" icon="el-icon-search" @click="getOperate" :disabled="role.QUERY"></el-button>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<el-table :data="group" height="calc(100vh - 240px)"  @selection-change="selectionChange" style="width: 100%;">
						<!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
						<!-- <el-table-column label="系统编号" prop="id" width="80" align="center"></el-table-column> -->
						<el-table-column label="序号" type="index" width="80" align="center" :index="getIndex">
							<template #scope>
								<span>{{scope.$index + (pageNum-1)*pageSize + 1}}</span>
							</template>
						</el-table-column>
						<el-table-column label="管理员编号" prop="uid" width="240" align="center"></el-table-column>
						<el-table-column label="登录名" prop="loginName" width="240" align="center"></el-table-column>
            <el-table-column label="登录IP地址" prop="remoteIp" width="240" align="center"></el-table-column>
            <el-table-column label="操作模块" prop="module" width="240" align="center"></el-table-column>
            <el-table-column label="操作类型" prop="type" width="240" align="center"></el-table-column>
						<el-table-column label="操作内容" prop="content" width="240" align="center"></el-table-column>
						<el-table-column label="操作时间" prop="operateTime" width="240" align="center"></el-table-column>
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
	import moment from "moment";

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
				showGrouploading: false,
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.log.getOperate,
				selection: [],
				search: {
					module: "",
					content: "",
					startTime: "",
     			endTime: "",
				},
				startTime: '',
     		endTime: '',
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
			this.getOperate();
			var roleList = this.$TOOL.data.get("ROLE");
			for(let k in this.role) {
				if(roleList.indexOf(k)>-1) {
					this.role[k] = false
				}
			}
		},
		methods: { 
			handleDataChange(value) {
				console.log(value)
				this.search.time = value;
			},
			selectionChange(selection){
				this.selection = selection;
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getOperate();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
				this.pageNum = val;
				this.getOperate();
        console.log(`当前页: ${val}`);
      },
			getIndex($index) {
				return (this.pageNum - 1)*this.pageSize + $index + 1
			},
			getstartTime() {
				this.startTime = this.search.startTime? moment(this.search.startTime).format('YYYY-MM-DD HH:mm:ss'):"";
			},
			getendTime() {
				this.endTime = this.search.endTime? moment(this.search.endTime).format('YYYY-MM-DD HH:mm:ss'):"";
			},
			comparedate(d1,d2) {
				var oDate1 = new Date(d1);
				var oDate2 = new Date(d2);
				if(oDate1.getTime() > oDate2.getTime()) {
					return false
				}else {
					return true
				}
			},
			async getOperate(){
				this.showGrouploading = true;
				var isCorrect = this.comparedate(this.search.startTime, this.search.endTime);
        if(!isCorrect) {
          this.$message.error("结束时间必须大于开始时间！");
          this.search.endTime = "";
          return false;
        }
        let data = {
          token: this.$TOOL.data.get("TOKEN"),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          module: this.search.module || "",
					content: this.search.content || "",
					startTime: this.startTime || "",
					endTime: this.endTime || ""
        };
				var res = await this.$API.system.log.getOperate.post(data);
				if(res.resultCode == "0000"){
					this.group = res.data?.list;
					this.totalNum = res.data.totalNum;
					this.showGrouploading = false;
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
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
