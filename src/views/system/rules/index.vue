<template>
	<el-card shadow="never" header="系统设置">
		<!-- <el-alert title="密码更新成功后，您将被重定向到登录页面，您可以使用新密码重新登录。" type="info" show-icon style="margin-bottom: 15px;"/> -->
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin-top:20px;">
			<el-form-item label="系统状态" prop="status">
				<el-select v-model="form.status" style="width: 100%">
        	<el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="维护说明" prop="explan">
				<el-input type="textarea" :autosize="{minRows: 4}" v-model="form.explan"></el-input>
				<!-- <sc-password-strength v-model="form.newPassword"></sc-password-strength> -->
				<!-- <div class="el-form-item-msg">请输入包含英文、数字的8位以上密码</div> -->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="save" :disabled="role.SET">设置</el-button>
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
				role: {
					QUERY: true,
					ADD: true,
					EDIT: true,
					DELETE: true,
					SET: true,
					INPORT: true,
					EXPORT: true
				},
				form: {
					status: "",
					explan: ""
				},
				options: [{
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '禁止'
        }],
				rules: {
					status: [
						{ required: true, message: '请选择系统状态'}
					],
					explan: [
						{ required: true, message: '请填写维护说明'}
					]
				}
			}
		},
		mounted() {
			this.getRule();
			var roleList = this.$TOOL.data.get("ROLE");
			for(let k in this.role) {
				if(roleList.indexOf(k)>-1) {
					this.role[k] = false
				}
			}
		},
		methods: {
			async getRule(){
        var data = {
          token: this.$TOOL.data.get("TOKEN"),
        };
				var res = await this.$API.system.rules.getRule.post(data);
				if(res.resultCode == "0000"){
					this.form.status = res.data?.status;
					this.form.explan = res.data?.explan;
				}else{
					this.$alert(res.note, "提示", {type: 'error'})
				}
			},
			async save(){
				var validate = await this.$refs.form.validate().catch(() => { });
        if (!validate) {
          return false;
        }
        var data = {
          token: this.$TOOL.data.get("TOKEN"),
          ...this.form
        };
        var res = this.$API.system.rules.setRule.post(data);
        res.then(result => {
          if(result.resultCode == "0000"){
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
