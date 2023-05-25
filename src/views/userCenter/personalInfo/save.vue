<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="真实姓名" prop="realName">
				<el-input v-model="form.realName" placeholder="请输入真实姓名" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model="form.mobile" placeholder="请输入手机号" clearable></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="mail">
				<el-input v-model="form.mail" placeholder="请输入邮箱地址" clearable></el-input>
			</el-form-item>
			<el-form-item label="开发者类型" prop="type">
				<el-select v-model="form.type" placeholder="请选择开发者类型" style="width:100%">
					<el-option label="个人开发者" value="0"></el-option>
					<el-option label="企业开发者" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="单位" prop="company">
				<el-input v-model="form.company" placeholder="请输入单位" clearable></el-input>
			</el-form-item>
			<el-form-item label="地区" prop="address">
				<el-input v-model="form.address" placeholder="请输入地区" clearable></el-input>
			</el-form-item>
			<el-form-item label="登录密码" prop="passWord">
				<el-input type="password" v-model="form.passWord" placeholder="请输入登录密码" clearable show-password></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="conformPwd">
				<el-input v-model="form.conformPwd" type="password" placeholder="请再次输入登录密码" clearable show-password></el-input>
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
				mode: "",
				titleMap: {
					edit: '编辑信息',
				},
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					realName: "",
					mobile: "",
					mail: "",
					type: "",
					company: "",
					address: "",
					passWord: "",
					conformPwd: ""
				},
				//验证规则
				rules: {
					realName: [
						{required: true, message: '请输入真实姓名'}
					],
					mobile: [
						{required: true, message: '请输入手机号'}
					],
					type: [
						{required: true, message: '请输入开发者类型'}
					],
					company: [
						{required: true, message: '请输入单位'}
					],
					address: [
						{required: true, message: '请输入地区'}
					],
					// passWord: [
					// 	{required: true, message: '请输入登录密码'},
					// ],
					// conformPwd: [
					// 	{required: true, message: '请再次输入登录密码'},
					// 	{validator: (rule, value, callback) => {
					// 		if (value !== this.form.passWord) {
					// 			callback(new Error('两次输入密码不一致'));
					// 		}else{
					// 			callback();
					// 		}
					// 	}}
					// ],
				},
			}
		},
		mounted() {
			
		},
		methods: {
			//显示
			open(mode='edit'){
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
							token:this.$TOOL.data.get("TOKEN"),
							...this.form,
							passWord: this.form.passWord? this.$TOOL.crypto.MD5(this.form.passWord): "",
							conformPwd: this.form.confirmPwd? this.$TOOL.crypto.MD5(this.form.conformPwd): "",
						};
						var res = await this.$API.info.editinfo.post(data);
						this.isSaveing = false;
						if(res.resultCode == "0000"){
							this.$emit('success', this.form, this.mode) //本地更新数据
							var userInfo = this.$TOOL.data.get("USER_INFO");
							if(userInfo.truth == "1" || userInfo.truth == null) {
								userInfo.truth = "0"
							}
							this.$TOOL.data.set("USER_INFO", userInfo);
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$message.error("修改失败")
							// this.$alert(res.message, "修改失败", {type: 'error'})
						}
					}else{
						return false;
					}
				})
			},
			//表单注入默认基础信息的数据
			setData(data){
				this.form.realName = data.realName
				this.form.mobile = data.mobile
				this.form.mail = data.mail
				this.form.type = data.type
				this.form.company = data.company
				this.form.address = data.address

				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
