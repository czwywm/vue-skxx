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
      label-width="120px"
      label-position="left"
    >
      <template v-if="mode == 'edit'">
				<el-form-item label="应用Id" prop="Id">
					<el-input v-model="form.Id" :disabled="true"></el-input>
				</el-form-item>
			</template>

      <el-form-item label="应用类型" prop="applytype">
        <el-select v-model="form.applytype" clearable placeholder="请选择应用类型" style="width:100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="应用名称" prop="applyname">
        <el-input
          v-model="form.applyname"
          placeholder="请输入应用名称"
          clearable
          :disabled="isEdit"
        ></el-input>
      </el-form-item>

      <template v-if="mode == 'edit'">
				<el-form-item label="是否重置密钥" prop="flag">
					<el-select v-model="form.flag" clearable placeholder="是否重置密钥" style="width:100%">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
				</el-form-item>
			</template>
      <el-form-item label="备注信息" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          v-model="form.remark"
          placeholder="请输入备注信息"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        v-if="mode != 'show'"
        type="primary"
        class="search-button"
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
      isEdit: false,
      options: [{
          value: '0',
          label: '授时'
        }, {
          value: '1',
          label: '定位'
        },{
          value: '2',
          label: '轨迹'
        }],
        options1: [{
          value: '0',
          label: '是'
        }, {
          value: '1',
          label: '否'
        }],
      //表单数据
      form: {
        Id: "",
        applytype: "",
        applyname: "",
        remark: "",
        flag: ""
      },
      //验证规则
      rules: {
        applytype: [{ required: true, message: "请选择应用类型" }],
        applyname: [{ required: true, message: "请输入应用名称" }],
        flag: [{ required: true, message: "请选择是否重置密钥" }],
      },
    };
  },
  mounted() {},
  methods: {
    //显示
    open(mode = "add") {
		console.log(mode)
      this.mode = mode;
      if(this.mode == "edit") {
        this.isEdit = true;
      }
      this.visible = true;
      return this;
    },
    //表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
          
					if (valid) {
						this.isSaveing = true;
						var data = {
							token: this.$TOOL.data.get("TOKEN"),
							...this.form
						}
            console.log(data)
						var res = this.mode == "add"? await this.$API.system.userapply.addUserApply.post(data):await this.$API.system.userapply.setUserApply.post(data);
						this.isSaveing = false;
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
    //表单提交方法
    // submit() {
    //   this.$refs.dialogForm.validate(async (valid) => {
    //     if (valid) {
    //       this.isSaveing = true;
    //       let data = {
    //         token: this.$TOOL.data.get("TOKEN"),
		// 	      ...this.form,
    //       };
    //       console.log(data)
    //       var res = this.mode=="edit"? await this.$API.system.userapply.editUserApply.post(data):await this.$API.system.userapply.addUserApply.post(data);
    //       this.isSaveing = false;
    //       if (res.resultCode == "0000") {
		// 	      // this.$parent.$refs.table.refresh()
    //         this.$emit("success", this.form, this.mode);
    //         this.visible = false;
    //         this.$message.success("操作成功");
    //       } else {
    //         this.$alert(res.note, "提示", { type: "error" });
    //       }
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    //表单注入数据
    setData(data) {
      this.form.Id = data.Id;
      this.form.applytype = data.applytype;
      this.form.applyname = data.applyname;
      this.form.remark = data.remark;

      //可以和上面一样单个注入，也可以像下面一样直接合并进去
      //Object.assign(this.form, data)
    },
  },
};
</script>

<style scoped>
.search-button {
  background-color: #0070c0;
  border-color: #0070c0;
}
</style>
