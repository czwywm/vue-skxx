<template>
    <el-container style="background-color:white">
    <el-main>
      <div v-highlight class="markdown-body" v-html="msg"></div>
      <div style="font-size:16px;margin:25px;cursor:pointer;">
        <a class="btn" @click="table_edit()">点击测试</a>
      </div>

      <!-- <div class="markdown-body"></div> -->
      <!-- <VueMarkdown :source="htmlMD"></VueMarkdown> -->
      <!-- <VueMarkdown :key="key">{{msg}}</VueMarkdown> -->
    </el-main>
  </el-container>
  <save-dialog
    v-if="dialog.save"
    ref="saveDialog"
    width="70%"
    @success="handleSuccess"
    @closed="dialog.save = false"
  ></save-dialog>
</template>

<script>
// import http from "@/utils/request"
// import VueMarkdown from 'vue-markdown'
import 'github-markdown-css'; //哪里用markdown 就在哪里引用 可以放在min.js
import saveDialog from "./save";
// import fileMD from '../../assets/README.md'
// const marked=require('marked')
// const htmlMD=marked(fileMD)
// // import axios from 'axios';
export default {
  name: "timeServeApiAbility",
  components:{
    saveDialog
    // VueMarkdown
  },
  data() {
    return {
      dialog: {
        save: false,
      },
     msg:'',
     //为了让组件强制渲染
     key:0,
     htmlMD:''
    };
  },
  created(){
    this.testMd()
// this.msg=htmlMD
  },
  mounted() {
//  this.getHtmlMD(this.$route.query.databaseType);
 },
  methods: {
  //    getHtmlMD(type) {
  // this.htmlMD = require(`../../assets/README.md`); //导入md 我这里根据不同的类型拿不同md文件
//  }
    table_edit() {
      
      this.dialog.save = true;
      this.$nextTick(() => {
        this.$refs.saveDialog.open("edit");
      });
    },
   async testMd(){
    //  console.log(11)
     var str='授时服务.md'
     await import('@/assets/'+str).then(myModule=>{
      //  console.log(myModule)
       this.msg=myModule.default;
     })
     this.key+=1
   }
   
   
  },
//   created:function () {
//     const url = `../../src/assets/README.md`;
// const that=this

//     axios.get(url).then((response) => {

//       that.htmlMD = response.data;
//    });
//     // this.testMd()
//   //  this.htmlMD = require('../../assets/文字识别接口.md');
//   }
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
.btn {
  border: 1px solid #0070c0;
  border-radius: 4px;
  padding: 8px;
  color: #0070c0;
}
.btn:hover {
  background: #dbeaf5;
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