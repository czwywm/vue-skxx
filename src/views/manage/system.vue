<template>
  <div>
    <div class="out-style">
      <div class="out-header-style">
        <span>授时服务</span>
      </div>
      <div class="out-body-style">
        <el-form :inline="true" :model="formInline" label-width="100px" label-position="left">
              <el-form-item label="授时服务">
                <el-input v-model="formInline.type" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="授时有效时间">
                <el-input v-model="formInline.number" placeholder=""></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="search-button" @click="onSubmit">设置</el-button>
              </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          type: '',
          number: '',
        },
      }
    }
  }
</script>
<style scoped>
.out-style {
  margin: 6px 1%;
  width: 98%;
  height: 150px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  background: #fff;
}
.out-header-style {
  height: 40px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #0070c0;
  text-align: center;
}
.out-header-style span {
  color: #fff;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
}
.out-body-style {
  padding:15px 20px;
}
.search-button {
  background-color: #0070c0;
  border-color: #0070c0;
  border-radius: 10px;
}
</style>