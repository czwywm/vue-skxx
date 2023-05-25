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
      <el-form-item label="应用名称" prop="applyName">
        <el-input
          v-model="form.applyName"
          placeholder="请输入应用名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="应用场景" prop="applyScenarios">
        <el-input
          v-model="form.applyScenarios"
          placeholder="请输入应用场景"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="应用行业" prop="applyIndustry">
        <el-input
          v-model="form.applyIndustry"
          placeholder="请输入应用行业"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="应用描述" prop="applyDescription">
        <el-input
          type="textarea"
          :rows="2"
          v-model="form.applyDescription"
          placeholder="请输入应用描述"
          clearable
        ></el-input>
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
        id: "",
        applyName: "",
        applyScenarios: "",
        applyIndustry: "",
        applyDescription: "",
      },
      //验证规则
      rules: {
        applyName: [{ required: true, message: "请输入应用名称" }],
        applyScenarios: [{ required: true, message: "请输入应用场景" }],
        applyIndustry: [{ required: true, message: "请输入应用行业" }],
        applyDescription: [{ required: true, message: "请输入应用描述" }],
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
			id:this.form.id?JSON.stringify(this.form.id):"",
            
          };

          var res = this.mode=="edit"?await this.$API.system.myapply.editMyApply.post(data):await this.$API.system.myapply.addMyApply.post(data);
          this.isSaveing = false;
          if (res.resultcode == "0000") {
			this.$parent.$refs.table.refresh()
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
      this.form.id = data.id;
      this.form.applyName = data.applyName;
      this.form.applyScenarios = data.applyScenarios;
      this.form.applyIndustry = data.applyIndustry;
      this.form.applyDescription = data.applyDescription;

      //可以和上面一样单个注入，也可以像下面一样直接合并进去
      //Object.assign(this.form, data)
    },
  },
};
</script>

<style>
</style>
