<template>
	<el-card shadow="never" header="修改密码">
		<el-alert title="密码更新成功后，您将被重定向到登录页面，您可以使用新密码重新登录。" type="info" show-icon style="margin-bottom: 15px;"/>
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin-top:20px;">
			<el-form-item label="当前密码" prop="passWord">
				<el-input v-model="form.passWord" type="password" show-password placeholder="请输入当前密码" clearable></el-input>
				<div class="el-form-item-msg">必须提供当前登录用户密码才能进行更改</div>
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" clearable></el-input>
				<!-- <sc-password-strength v-model="form.newPassword"></sc-password-strength> -->
				<!-- <div class="el-form-item-msg">请输入包含英文、数字的8位以上密码</div> -->
			</el-form-item>
			<el-form-item label="确认新密码" prop="conformPwd">
				<el-input v-model="form.conformPwd" type="password" show-password placeholder="请再次输入新密码" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save">设置</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	// import scPasswordStrength from '@/components/scPasswordStrength'

	export default {
		// components: {
		// 	scPasswordStrength
		// },
		data() {
			return {
				form: {
					passWord: "",
					newPassword: "",
					conformPwd: ""
				},
				rules: {
					passWord: [
						{ required: true, message: '请输入当前密码'}
					],
					newPassword: [
						{ required: true, message: '请输入新密码'}
					],
					conformPwd: [
						{ required: true, message: '请再次输入新密码'},
						{validator: (rule, value, callback) => {
							if (value !== this.form.newPassword) {
								callback(new Error('两次输入密码不一致'));
							}else{
								callback();
							}
						}}
					]
				}
			}
		},
		methods: {
			async save(){
				var validate = await this.$refs.form.validate().catch(() => { });
        if (!validate) {
          return false;
        }
        var data = {
          token: this.$TOOL.data.get("TOKEN"),
          passWord: this.$TOOL.crypto.MD5(this.form.passWord),
          conformPwd: this.$TOOL.crypto.MD5(this.form.conformPwd)
        };
        var res = this.$API.system.manager.updateAdmin.post(data);
        res.then(result => {
          if(result.resultCode == "0000"){
            this.$router.replace({path: '/login'})
            this.$message.success("修改成功");
          }else{
            this.$message.error(result.note);
          }
        })
        
			}
		}
	}
</script>

<style>
</style>
