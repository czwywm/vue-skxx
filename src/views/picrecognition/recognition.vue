<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card
          shadow="never"
          header="图片上传"
          :style="{ height: fullHeight + 'px' }"
        >
          <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item label="上传图片" style="margin-top: 30px;">
              <el-upload
                v-model="form.imgPath"
                class="avatar-uploader"
                drag
                :multiple="false"
                :show-file-list="false"
                action="http://172.16.21.201:6004/api/common/uploadimage"
                accept=".jpg"
                :on-success="success"
                style="width:200px;height:200px"
              >
                <img v-if="form.imgPath" :src="imageUrl" class="avatar"  style="height:100%;width:100%"/>
                <br/>
                <!-- <div class="custom-empty"> -->
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <!-- </div> -->
              </el-upload>
            </el-form-item>
            <el-form-item label="检测类型" style="margin-top: 30px">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="姿态检测"  name="type" ></el-checkbox>
                <el-checkbox label="物体检测"  name="type" ></el-checkbox>
                <el-checkbox label="人脸检测"  name="type" ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item style="margin-top: 30px">
              <el-button type="primary" @click="submitForm">识别</el-button>
              <!-- <el-button @click="resetForm">重置</el-button> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card
          shadow="never"
          header="检测结果"
          :style="{ height: fullHeight + 'px' }"
        >
          <el-tabs type="card">
            <el-tab-pane label="姿态检测">
              <!-- <div :style="{ height:fullHeight1 + 'px', }" class="overflows"> -->
              <div class="overflows" :style="{ height: fullHeight1 + 'px'}">
                <img id="r_img" style="height:400px" :src="r_img"/>
                <el-descriptions
                  v-for="(citem, cindex) in openposeData.poseList"
                  :key="cindex"
                  title="姿态信息"
                  :column="3"
                  border
                  style="margin-bottom:30px;"
                >
                  <!-- <el-descriptions-item label="编号">{{
                    citem.personindex
                  }}</el-descriptions-item> -->
                  <el-descriptions-item label='坐标'> <div style="width:100px;">{{
                    citem.location
                  }}</div></el-descriptions-item>
                  <!-- <el-descriptions-item label="坐标" labelStyle="background:black" content-class-name="my-content">{{
                    citem.location
                  }}</el-descriptions-item> -->
                  <el-descriptions-item label="置信度"><div style="width:100px;">{{
                    citem.confidence
                  }}</div></el-descriptions-item>
                  <el-descriptions-item label="姿势"><div style="width:100px;">{{
                    citem.poseName
                  }}</div></el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>
            <el-tab-pane label="物体检测">
              <div class="overflows" :style="{ height: fullHeight1 + 'px' }">
                <img id="yolo_img" style="height:400px" :src="yolo_img"/>
                <el-descriptions
                  v-for="(citem, cindex) in yoloData.objectList"
                  :key="cindex"
                  title="物体信息"
                  direction="vertical"
                  :column="3"
                  border
                  style="margin-bottom:30px;"
                >
                  <el-descriptions-item style="width:200px" label="类型"><div style="width:100px;">{{
                    citem.category
                  }}</div></el-descriptions-item>
                  <el-descriptions-item label="坐标"><div style="width:100px;">{{
                    citem.bbox
                  }}</div></el-descriptions-item>
                  <el-descriptions-item label="置信度"><div style="width:100px;">{{
                    citem.score
                  }}</div></el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>
            <el-tab-pane label="人脸检测">
              <div class="overflows" :style="{ height: fullHeight1 + 'px' }">
                <!-- <img id="r_img" style="width:100%" :src="r_img"/> -->
                <el-descriptions
                  v-for="(citem, cindex) in list.faceData"
                  :key="cindex"
                  title="人脸信息"
                  :column="3"
                  border
                  style="margin-bottom:30px;"
                >
                  <!-- <el-descriptions-item label="编号">{{
                    citem.personindex
                  }}</el-descriptions-item> -->
                  <el-descriptions-item label='姓名'> <div style="width:100px;">{{
                    citem.name
                  }}</div></el-descriptions-item>
                  <!-- <el-descriptions-item label="坐标" labelStyle="background:black" content-class-name="my-content">{{
                    citem.location
                  }}</el-descriptions-item> -->
                  <el-descriptions-item label="置信度"><div style="width:100px;">{{
                    citem.confidence
                  }}</div></el-descriptions-item>
                </el-descriptions>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// import http from "@/utils/request"
export default {
  name: "recognition",
  data() {
    return {
      checked: true,
      uploadApi: this.$API.common.upload,
      Api: "http://172.16.21.201:6004/api/pose/posedetection",
      imageUrl: "",
      //   uploadApi:'http://172.16.10.227:6004/api/common/uploadimage',
      form: {
        imgPath: "",
        type: ['姿态检测','物体检测','人脸检测'],
      },
      // checked: true,
      content1: "",
      list: [],
      openposeData:[],
      yoloData:[],
      fullHeight: document.documentElement.clientHeight - 105,
      fullHeight1: document.documentElement.clientHeight - 250,
      r_img: "",
      yolo_img: "",
    };
  },
  methods: {
    success(response, file) {
      if (response.code == 1) {
        this.$alert(`上传成功`, {
          title: "提示",
          type: "success",
        });
        this.imageUrl = URL.createObjectURL(file.raw);

        this.form.imgPath = response.msg;
      } else {
        this.$alert(`上传失败`, {
          title: "提示",
          type: "error",
        });
      }
      return false;
    },
    async submitForm() {
      // // this.$refs.ruleForm.validate((valid) => {
      // // if (valid) {
      this.list=[]
      this.openposeData=[]
      this.yoloData=[]
      this.r_img=""
      this.yolo_img=""
      const loading = this.$loading();
     
      if(this.form.type.indexOf("姿态检测") > -1){
        var openposeflag = 1
      }else{
        openposeflag = 0
      }
      if(this.form.type.indexOf("物体检测") > -1){
        var yoloflag = 1
      }else{
        yoloflag = 0
      }
      if(this.form.type.indexOf("人脸检测") > -1){
        var faceflag = 1
      }else{
        faceflag = 0
      }
     
      var data = {
        imgPath: this.form.imgPath,
        openposeflag,
        yoloflag,
        faceflag
      };

      var result = await this.$API.common.recognition.post(
        JSON.stringify(data)
      );
      if (result.resultCode == "0000") {
        loading.close();
        this.$alert(`检测成功`, {
          title: "提示",
          type: "success",
        });
        this.list = result.data?result.data:[];
        this.openposeData=result.data.openposeData?result.data.openposeData:[]
        this.yoloData=result.data.yoloData?result.data.yoloData:[]
        if(result.data.openposeData){
          this.r_img =
          "data:image/png;base64," + result.data.openposeData.handleImgBase64
        }
        if(result.data.yoloData){
          this.yolo_img =
          "data:image/png;base64," + result.data.yoloData.resultImg
        }
      } else {
        loading.close();
        this.$alert(`检测失败`, {
          title: "提示",
          type: "error",
        });
      }
      // alert("请看控制台输出");
      // } else {
      //   return false;
      // }
      // });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style scoped>
.el-card + .el-card {
  margin-top: 15px;
}

.imglist {
  margin-bottom: 0;
}
.imglist .el-col + .el-col {
  margin-left: 10px;
}
.custom-empty {
  width: 100%;
  height: 100%;
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.custom-empty i {
  font-size: 40px;
  color: #8c939d;
}
.custom-empty p {
  font-size: 12px;
  font-weight: normal;
  color: #8c939d;
  margin-top: 10px;
}
.overflows {
  overflow-y: auto;
  text-align: center;
}
 
</style>
<style >
.my-label {
    background: #E1F3D8;
  }

  .my-content {
    background: #FDE2E2;
  }
</style>