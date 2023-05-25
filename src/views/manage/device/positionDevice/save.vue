<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<template v-if="mode == 'edit'">
				<el-form-item label="ID" prop="id">
					<el-input v-model="form.id" :disabled="true"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="设备编号" prop="deviceId">
				<el-input v-model="form.deviceId" placeholder="请输入设备编号" clearable></el-input>
			</el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
				<el-input v-model="form.deviceName" placeholder="请输入设备名称" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item label="登录密码" prop="passWord" v-show="this.mode != 'show'">
				<el-input type="password" v-model="form.passWord" placeholder="请输入登录密码" clearable show-password></el-input>
			</el-form-item> -->
			<el-form-item label="设备地址" prop="address">
				<el-input v-model="form.address" placeholder="请输入设备地址" clearable></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="form.status" clearable placeholder="请选择状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增设备',
					edit: '编辑设备',
					show: '绑定用户'
				},
				visible: false,
				isSaveing: false,
        //目录权限
        menuList: [],
        //操作权限
        roleList: [],
				options: [{label:"正常",value:"0"},{label:"禁止",value:"1"}],
				//表单数据
				form: {
					id: "",
					deviceId: "",
					deviceName:"",
					status: "",
					address: ""
				},
				//验证规则
				rules: {
					deviceId: [
						{required: true, message: '请输入设备编号'}
					],
					deviceName: [
						{required: true, message: '请输入设备名称'}
					],
          status: [
						{required: true, message: '请选择状态'}
					],
          address: [
						{required: true, message: '请选择设备地址'}
					]
				},
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "deviceId",
					multiple: true,
					checkStrictly: true
				},
				filterMenu: []
			}
		},
		mounted() {},
		created() {
			this.roleList = [{label:"查询",value:"QUERY"},{label:"添加",value:"ADD"},{label:"修改",value:"EDIT"},{label:"删除",value:"DELETE"},{label:"设置",value:"SET"},{label:"导入",value:"INPORT"},{label:"导出",value:"EXPORT"}]
    },
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						var data = {
							token: this.$TOOL.data.get("TOKEN"),
							...this.form,
							deviceType: "1"
						}
						var res = this.mode == "add"? await this.$API.system.device.addDevice.post(data):await this.$API.system.device.setDevice.post(data);
						this.isSaveing = false;
						if(res.resultCode == "0000"){
								// this.$parent.$refs.table.refresh()
								this.$emit('success', this.form, this.mode)
								this.visible = false;
								this.$message.success("操作成功")
							}else{
								this.$alert(res.note, "提示", {type: 'error'})
							}
						// if(this.mode == "add") {
						// 	var res1 = await this.$API.system.device.addDevice.post(data);
						// 	this.isSaveing = false;
						// 	if(res1.resultCode == "0000"){
						// 		// this.$parent.$refs.table.refresh()
						// 		this.$emit('success', this.form, this.mode)
						// 		this.visible = false;
						// 		this.$message.success("操作成功")
						// 	}else{
						// 		this.$alert(res1.note, "提示", {type: 'error'})
						// 	}
						// }else if(this.mode == "edit") {
						// 	var res = await this.$API.system.device.setDevice.post(data);
						// 	this.isSaveing = false;
						// 	if(res.resultCode == "0000"){
						// 		// this.$parent.$refs.table.refresh()
						// 		this.$emit('success', this.form, this.mode)
						// 		this.visible = false;
						// 		this.$message.success("操作成功")
						// 	}else{
						// 		this.$alert(res.note, "提示", {type: 'error'})
						// 	}
						// }
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				console.log(data)
				this.form.id = data.id
        this.form.deviceId = data.deviceId
				this.form.deviceName = data.deviceName
				this.form.status = data.status
				this.form.deviceType = data.deviceType
				this.form.address = data.address
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
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
