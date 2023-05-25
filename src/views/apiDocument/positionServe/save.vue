<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <!-- <el-main> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never" header="提交数据">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane label="输入设备编号"> -->
              <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="密钥(key)" style="margin-top: 30px" prop="key">
                  <el-input placeholder="请输入密钥" v-model="form.key" clearable>
                  </el-input>
                </el-form-item>
                <el-form-item label="设备编号" style="margin-top: 30px" prop="deviceId">
                  <el-input placeholder="请输入设备编号" v-model="form.deviceId" clearable>
                  </el-input>
                </el-form-item>
                <el-form-item style="margin-top: 40px">
                  <el-button type="primary" v-if="canSave" @click="submitForm">查询</el-button>
                  <el-button type="primary" v-else :loading="true">查询中</el-button>
                  <!-- <el-button @click="resetForm">重置</el-button> -->
                </el-form-item>
              </el-form>
            <!-- </el-tab-pane> -->
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" header="返回数据">
          <div class="overflows">
            <json-viewer :value="returncontent"></json-viewer>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- </el-main> -->

    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <!-- <el-button
        v-if="mode != 'show'"
        type="primary"
        :loading="isSaveing"
        @click="submit()"
        >保 存</el-button
      > -->
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
        edit: "功能调试",
        show: "查看",
      },
      switchvalue:true,
      visible: false,
      isSaveing: false,
      checked: true,
      form: {
        deviceId: "",
        key: ""
      },
      rules: {
        key: [{ required: true, message: '请输入密钥'}]
      },
      returncontent: {},
      isUser: "",
      canSave: true
    };
  },
  created(){
    var hasProperty = function(obj, key) {
			return key in obj
		}
    var userInfo = this.$TOOL.data.get("USER_INFO");
		var user = hasProperty(userInfo, 'truth')
		console.log(user)
    if(user) {
      this.isUser = true;
    }
  },
  mounted() { },
  methods: {
    //显示
    open(mode = "add") {
      this.mode = mode;
      this.visible = true;
      return this;
    },

    //表单提交方法
    async submitForm() {
      if(!this.canSave){
        return;
      }
      this.canSave = false;
      var data = {
        key: this.form.key,
        deviceId: this.form.deviceId
      };
      var result = this.isUser? await this.$API.system.userdevice.getUserPosition.post(data):await this.$API.system.device.getPosition.post(data);
      // if (result.resultCode == "0000") {
      //   // loading.close();
      //   this.$alert(`查询成功`, {
      //     title: "提示",
      //     type: "success",
      //   });
      //   this.returncontent = result;
      // } else {
      //   // loading.close();
      //   this.$alert(`查询失败`, {
      //     title: "提示",
      //     type: "error",
      //   });
      // }
      this.returncontent = result;
      this.canSave = true;
    },

  },
};
</script>

<style>
</style>
