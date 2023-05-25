<template>
  <div>
    <div class="out-style">
      <div class="out-header-style">
        <span>卫星接收机</span>
      </div>
      <div class="out-body-style">
        <el-descriptions column="1" contentClassName="descriptions-style">
          <el-descriptions-item label="天线连接：">已连接</el-descriptions-item>
          <el-descriptions-item label="可用卫星：">24</el-descriptions-item>
          <el-descriptions-item label="GPS（可用/可见）：">12/23</el-descriptions-item>
          <el-descriptions-item label="北斗（可用/可见）：">12/23</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="out-style" style="margin-top: -20px;height: 200px">
      <div class="out-header-style">
        <span>当前位置</span>
      </div>
      <div class="out-body-style">
        <el-descriptions column="1" contentClassName="descriptions-style">
          <el-descriptions-item label="纬度：">N 3949.25125</el-descriptions-item>
          <el-descriptions-item label="经度：">E 11633.75121</el-descriptions-item>
          <el-descriptions-item label="高程：">28.8m</el-descriptions-item>
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
  height: 230px;
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