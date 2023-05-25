<template>
  <div>
    <div class="out-style">
      <div class="out-header-style">
        <span>设备状态信息</span>
      </div>
      <div class="out-body-style">
        <el-descriptions column="1" contentClassName="descriptions-style">
          <el-descriptions-item label="北京时间：">2022-09-16 14:30:25</el-descriptions-item>
          <el-descriptions-item label="更新时间：">2022-09-16 14:30:25</el-descriptions-item>
          <el-descriptions-item label="系统状态：">系统正常</el-descriptions-item>
          <el-descriptions-item label="卫星状态：">GPS：12颗 北斗：4颗</el-descriptions-item>
          <el-descriptions-item label="系统温度：">≈33℃</el-descriptions-item>
          <el-descriptions-item label="授时次数：">100000000</el-descriptions-item>
          <el-descriptions-item label="客服端IP：">192.168.1.116</el-descriptions-item>
          <el-descriptions-item label="版本信息：">软件版本：1.0 硬件版本：1.0</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>
<style scoped>
.out-style {
  margin: 50px 5%;
  width: 90%;
  height: 350px;
  border: 2px solid #0070c0;
  border-top: none;
  border-radius: 5px;
  background-color: #fff;
}
.out-header-style {
  padding: 0px 20px;
  height: 40px;
  border: 2px solid #0070c0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #0070c0;
  /* text-align: center; */
}
.out-header-style span {
  color: #fff;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
}
.out-body-style {
  padding:35px 20px;
}
::v-deep .el-descriptions--small {
  font-size: 15px;
  font-weight: 600;
  color: #000;
}
</style>