<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-switch v-model="switchvalue" :disabled="isbind" active-color="#13ce66" inactive-color="#ff4949" active-text="绑定用户" inactive-text="解绑用户"></el-switch>
		<el-form :model="form" :rules="rules" ref="dialogForm" label-width="100px" label-position="left" style="margin-top: 30px" v-if="switchvalue">
			<el-form-item label="设备编号" prop="deviceId">
				<el-input v-model="form.deviceId" :disabled="true"></el-input>
			</el-form-item>
      <el-form-item label="用户ID" prop="uid">
				<el-input v-model="form.uid" placeholder="请点击选择，选择对应的用户" clearable>
					<template v-slot:append>
					 	<el-button @click="handleChange">选择</el-button>
					 </template>
				</el-input>
			</el-form-item>
		</el-form>
		<el-form :model="form1" :rules="rules" ref="dialogForm1" label-width="100px" label-position="left" style="margin-top: 30px" v-if="!switchvalue">
			<el-form-item label="设备编号" prop="deviceId">
				<el-input v-model="form1.deviceId" :disabled="true"></el-input>
			</el-form-item>
      <el-form-item label="用户ID" prop="uid">
				<el-input v-model="form1.uid" :disabled="true"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()" v-if="switchvalue">绑定</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit1()" v-if="!switchvalue">解绑</el-button>
		</template>
	</el-dialog>

	<user-info v-if="innerVisible" ref="userInfo" @success="handleSuccess" @closed="innerVisible = false"></user-info>
</template>

<script>
	import userInfo from './userinfo'

	export default {
		emits: ['success', 'closed'],
		components: {
			userInfo
		},
		data() {
			return {
				mode: "bind",
				titleMap: {
					bind: '设备关联用户',
				},
				switchvalue:true,
				isbind: true,
				visible: false,
				innerVisible: false,
				isSaveing: false,
        //目录权限
        menuList: [],
        //操作权限
        roleList: [],
				// options: [{label:"正常",value:"0"},{label:"禁止",value:"1"}],
				//表单数据
				form: {
					deviceId: "",
					uid: ""
				},
				form1: {
					deviceId: "",
					uid: ""
				},
				//验证规则
				rules: {
					deviceId: [
						{required: true, message: '请输入设备编号'}
					],
					uid: [
						{required: true, message: '请选择用户'}
					]
				},
				userName: '',
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "deviceId",
					multiple: true,
					checkStrictly: true
				},
				filterMenu: [],
				pageSize: 20,
				pageNum: 1
			}
		},
		mounted() {},
		created() {
			this.roleList = [{label:"查询",value:"QUERY"},{label:"添加",value:"ADD"},{label:"修改",value:"EDIT"},{label:"删除",value:"DELETE"},{label:"设置",value:"SET"},{label:"导入",value:"INPORT"},{label:"导出",value:"EXPORT"}]
    },
		methods: {
			//显示
			open(mode='bind'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			async getUser(){
        var data = {
          token: this.$TOOL.data.get("TOKEN"),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: "",
					userName: this.userName
        };
				var res = await this.$API.system.user.getUser.post(data);
				if(res.resultCode == "0000"){
					console.log(res.data.list[0])
					this.form1.uid = res.data.list[0].uid;
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			//绑定
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						var data = {
							token: this.$TOOL.data.get("TOKEN"),
							...this.form
						}
						var res = await this.$API.system.device.bindDevice.post(data);
						if(res.resultCode == "0000"){
								// this.$parent.$refs.table.refresh()
								this.$emit('success', this.form, this.mode)
								this.visible = false;
								this.$message.success("操作成功")
							}else{
								this.$alert(res.note, "提示", {type: 'error'})
							}
					}else{
						return false;
					}
				})
			},
			//解绑
			submit1(){
				this.$refs.dialogForm1.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						var data = {
							token: this.$TOOL.data.get("TOKEN"),
							...this.form1
						}
						var res = await this.$API.system.device.unbindDevice.post(data);
						if(res.resultCode == "0000"){
								// this.$parent.$refs.table.refresh()
								this.$emit('success', this.form, this.mode)
								this.visible = false;
								this.$message.success("操作成功")
							}else{
								this.$alert(res.note, "提示", {type: 'error'})
							}
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				console.log(data)
				console.log(data.userName)
        this.form.deviceId = data.deviceId;
				this.form1.deviceId = data.deviceId;
				if(data.userName == null) {
					// this.isbind = true;
				}else {
					this.switchvalue = false;
					this.userName = data.userName;
					this.getUser();
					console.log('成功')
				}
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			},
			handleChange() {
				this.innerVisible = true;
				this.$nextTick(() => {
					this.$refs.userInfo.open('select')
				})
			},
			handleSuccess(data, mode) {
				if(mode == 'select') {
					var info = JSON.parse(JSON.stringify(data));
					this.form.uid = info.uid;
				}
			},
		}
	}
</script>

<style scoped>
.el-select--small {
  width: 100%;
}
::v-deep .el-cascader {
	width: 100%;
}
</style>
