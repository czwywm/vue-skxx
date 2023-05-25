<template>
  <el-dialog
    :title="titleMap[mode]"
    v-model="visible"
    :width="500"
    destroy-on-close
    @closed="$emit('closed')"
  >
    <el-form
      :model="form"
      :rules="rules"
      :disabled="mode == 'show'"
      ref="dialogForm"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="用户ID" prop="uid">
				<el-input v-model="form.uid" :disabled="true"></el-input>
			</el-form-item>
      <el-form-item prop="passWord" label="登录密码">
        <el-input v-model="form.passWord" type="password" placeholder="请设置登录密码" clearable show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        v-if="mode != 'show'"
        type="primary"
        :loading="isSaveing"
        @click="submit()"
        >保 存</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
export default {
  emits: ["success", "closed"],
  data() {
    return {
      mode: "add",
      titleMap: {
        add: "新增应用",
        edit: "编辑应用",
        show: "查看",
      },
      visible: false,
      isSaveing: false,
      //表单数据
      form: {
        uid: "",
        passWord: "",
      },
      //验证规则
      rules: {
        passWord: [{ required: true, message: "请设置登录密码" }],
      },
    };
  },
  mounted() {},
  methods: {
    //显示
    open(mode = "add") {
		console.log(mode)
      this.mode = mode;
      this.visible = true;
      return this;
    },
    //加载树数据

    //表单提交方法
    submit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          this.isSaveing = true;
          let data = {
            token: this.$TOOL.data.get("TOKEN"),
			      ...this.form,
			      passWord: this.$TOOL.crypto.MD5(this.form.passWord),
            
          };
          var res = await this.$API.system.user.setUser.post(data);
          this.isSaveing = false;
          if (res.resultCode == "0000") {
			      // this.$parent.$refs.table.refresh()
            // this.$emit("success", this.form, this.mode);
            this.visible = false;
            this.$message.success("操作成功");
          } else {
            this.$alert(res.note, "提示", { type: "error" });
          }
        } else {
          return false;
        }
      });
    },
    //表单注入数据
    setData(data) {
      this.form.uid = data.uid;

      //可以和上面一样单个注入，也可以像下面一样直接合并进去
      //Object.assign(this.form, data)
    },
  },
};
</script>

<style>
</style>
