<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="1000" destroy-on-close @closed="$emit('closed')">
		<el-table :data="group" height="calc(100vh - 440px)"  @selection-change="selectionChange" style="width: 100%;">
						<!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
						<el-table-column width="50" align="center">
							<template #default="scope">
								<el-radio v-model="selection" :label="scope.row">{{&nbsp;}}</el-radio>
							</template>
						</el-table-column>
						<!-- <el-table-column label="ID" prop="uid" width="180" align="center"></el-table-column> -->
						<el-table-column label="用户名" prop="userName" width="120" align="center"></el-table-column>
						<el-table-column label="真实姓名" prop="realName" width="120" align="center"></el-table-column>
						<el-table-column label="手机号" prop="mobile" width="120" align="center"></el-table-column>
						<el-table-column label="邮箱" prop="mail" width="180" align="center"></el-table-column>
            <el-table-column label="单位" prop="company" width="180" align="center"></el-table-column>
            <el-table-column label="开发者类型" prop="type" width="100" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.status === '0'" type='success' disable-transitions>个人开发者</el-tag>
								<el-tag v-show="scope.row.status === '1'" type='primary' disable-transitions>企业开发者</el-tag>
							</template>
						</el-table-column>
            <el-table-column label="地区" prop="address" width="120" align="center"></el-table-column>
            <el-table-column label="是否认证" prop="truth" width="100" align="center">
							<template #default="scope">
								<el-tag v-if="scope.row.status === '0'" type='success' disable-transitions>已认证</el-tag>
								<el-tag v-else type='danger' disable-transitions>未认证</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="状态" prop="status" width="80" align="center">
							<template #default="scope">
								<el-tag v-show="scope.row.status === '0'" type='success' disable-transitions>正常</el-tag>
								<el-tag v-show="scope.row.status === '1'" type='danger' disable-transitions>禁止</el-tag>
							</template>
						</el-table-column>
            <!-- <el-table-column label="登录IP地址" prop="loginIp" width="120" align="center"></el-table-column>
            <el-table-column label="登录时间" prop="loginTime" width="140" align="center"></el-table-column>
            <el-table-column label="登录次数" prop="loginCount" width="80" align="center"></el-table-column> -->
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
			<template #footer>
				<el-button @click="visible=false" >取 消</el-button>
				<el-button type="primary" :loading="isSaveing" @click="submit()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "select",
				titleMap: {
					bind: '选择用户',
				},
				visible: false,
				isSaveing: false,
				options: [{
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '禁止'
        }],
				selection: [],
				//所需数据选项
				groups: [],
				totalNum: 0,
				pageSize: 20,
				pageNum: 1
			}
		},
		mounted() {
			this.getUser();
		},
		created() {},
		methods: {
			//显示
			open(mode='select'){
				this.mode = mode;
				this.visible = true;
				return this
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
          status: ""
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
			//表单提交方法
			submit(){
				this.$emit('success', this.selection, this.mode);
				this.visible = false;
				this.$message.success("选择成功");
			},
		}
	}
</script>

<style scoped>
::v-deep .el-table th.el-table__cell {
  color:#fff;
  background-color: #0070c0;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #0070c0;
}
.el-select--small {
  width: 100%;
}
::v-deep .el-cascader {
	width: 100%;
}
</style>
