<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="600" destroy-on-close @closed="$emit('closed')" custom-class="roll-dialog">
    <!-- <el-main> -->
    <div >
      <el-row>
      <el-col :span="12">
        <el-card shadow="never" header="提交数据" style="margin-right: 10px;">
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
                <el-form-item label="开始时间" prop="startTime" style="margin-top: 30px">
                  <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    placeholder="选择开始时间"
                    @change="getstartTime"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime" style="margin-top: 30px">
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    placeholder="选择结束时间"
                    @change="getendTime"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="选择时间">
                  <el-date-picker
                    v-model="form.timeRange"
                    @change="getTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%">
                  </el-date-picker>
                </el-form-item> -->
                <el-form-item style="margin-top: 40px">
                  <el-button type="primary" v-if="canSave" @click="submitForm">查询</el-button>
                  <el-button type="primary" v-else :loading="true">查询</el-button>
                  <!-- <el-button @click="resetForm">重置</el-button> -->
                </el-form-item>
              </el-form>
            <!-- </el-tab-pane> -->
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" header="返回数据" class="roll-dialog">
          <div class="overflows">
            <json-viewer :value="returncontent"></json-viewer>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </div>
    
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
import moment from "moment";

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
      startTime: '',
      endTime: '',
      switchvalue:true,
      visible: false,
      isSaveing: false,
      checked: true,
      form: {
        key:"",
        deviceId: "",
        // timeRange: "",
        startTime: "",
        endTime: ""
      },
      rules: {
        key: [{ required: true, message: '请输入密钥'}],
        deviceId: [{ required: true, message: '请输入设备编号'}],
        // timeRange: [{ required: true, message: '请选择时间段'}],
        startTime: [{ required: true, message: '请选择开始时间'}],
        endTime: [{ required: true, message: '请选择结束时间'}],
      },
      returncontent: {},
      isUser: "",
      canSave: true,
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
    // getTime() {
    //   this.startTime = this.form.timeRange? moment(this.form.timeRange[0]).format('YYYY-MM-DD HH:mm:ss'):"";
    //   this.endTime = this.form.timeRange? moment(this.form.timeRange[1]).format('YYYY-MM-DD HH:mm:ss'):"";
    // },
    getstartTime() {
      this.startTime = this.form.startTime? moment(this.form.startTime).format('YYYY-MM-DD HH:mm:ss'):"";
    },
    getendTime() {
      this.endTime = this.form.endTime? moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss'):"";
    },
    comparedate(d1,d2) {
      var oDate1 = new Date(d1);
      var oDate2 = new Date(d2);
      if(oDate1.getTime() > oDate2.getTime()) {
        return false
      }else {
        return true
      }
    },
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
      var isCorrect = this.comparedate(this.form.startTime, this.form.endTime);
        if(!isCorrect) {
          this.$message.error("结束时间必须大于开始时间！");
          this.form.endTime = "";
          return false;
        }
      this.canSave = false;
      var data = {
        key: this.form.key,
        deviceId: this.form.deviceId,
        startTime: this.startTime || "",
        endTime: this.endTime || ""
      };

      var result = this.isUser? await this.$API.system.userdevice.getUserTrack.post(data):await this.$API.system.device.getTrack.post(data);
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

<style scoped>
/* ::v-deep .el-dialog .roll-dialog {
  background-color: #000;
  height: auto;
  max-height: 80vh;
  overflow-y: auto;
}
::v-deep .el-dialog__body{
    max-height: 70vh !important;
} */
.roll-dialog {
  height: auto;
  max-height: 50vh;
  overflow-y: auto;
}
</style>
