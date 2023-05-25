<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <!-- <el-main> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never" header="提交数据">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="设备时间">
              <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="设备编号" style="margin-top: 30px" prop="deviceId">
                  <el-input placeholder="请输入设备编号" v-model="form.deviceId" clearable>
                  </el-input>
                </el-form-item>
                <el-form-item style="margin-top: 30px">
                  <el-button type="primary" v-if="canSave" @click="submitForm">查询</el-button>
                  <el-button type="primary" v-else :loading="true">查询中</el-button>
                  <!-- <el-button @click="resetForm">重置</el-button> -->
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="设备参数">
              <el-form ref="ruleForm1" :model="form1" :rules="rules" label-width="100px">
                <el-form-item label="设备编号" style="margin-top: 30px" prop="deviceId">
                  <el-input placeholder="请输入设备编号" v-model="form1.deviceId" clearable>
                  </el-input>
                </el-form-item>
                <el-form-item style="margin-top: 30px">
                  <el-button type="primary" v-if="canSave" @click="submitForm1">查询</el-button>
                  <el-button type="primary" v-else :loading="true">查询中</el-button>
                  <!-- <el-button @click="resetForm">重置</el-button> -->
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <!-- <el-tabs type="card">
            <el-tab-pane label="姿态检测"> -->

          <!-- </el-tab-pane> -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" header="检测结果">
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
        deviceId: ""
      },
      form1: {
        deviceId: "",
      },
      returncontent: {},
      canSave: true
    };
  },
  mounted() { },
  methods: {
    //显示
    open(mode = "add") {
      this.mode = mode;
      this.visible = true;
      return this;
    },

    //表单提交方法//获取设备时间
    async submitForm() {
      if(!this.canSave){
        return;
      }
      this.canSave = false;
      var data = {
        token: this.$TOOL.data.get("TOKEN"),
        deviceId: this.form.deviceId
      };
      var result =await this.$API.system.timeServe.getTime.post(data);
      this.returncontent = result;
      this.canSave = true;
    },

    //表单提交方法//获取设备参数
    async submitForm1() {
      if(!this.canSave){
        return;
      }
      this.canSave = false;
      var data = {
        token: this.$TOOL.data.get("TOKEN"),
        deviceId: this.form1.deviceId
      };
      var result =await this.$API.system.timeServe.getData.post(data);
      this.returncontent = result;
      this.canSave = true;
    },

  },
};
</script>

<style>
</style>
