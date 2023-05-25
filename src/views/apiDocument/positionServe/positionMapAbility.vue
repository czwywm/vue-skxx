<template>
    <el-container style="background-color:white">
    <el-main>
      <div v-highlight class="markdown-body" v-html="msg"></div>
      <el-alert title="填写密钥以及设备编号，点击查询可在地图中显示设备当前位置。" type="info" show-icon style="margin-bottom: 15px;"/>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" style="margin-top:20px;" :inline="true">
        <el-form-item label="密钥(key)" prop="key">
          <el-input v-model="form.key" placeholder="请输入密钥" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="canSave" @click="submit">查询</el-button>
          <el-button type="primary" v-else :loading="true">查询中</el-button>
        </el-form-item>
      </el-form>
      <div id="container"></div>
    </el-main>
  </el-container>
</template>

<script>
import 'github-markdown-css'; //哪里用markdown 就在哪里引用 可以放在min.js

//安全密钥引入
window._AMapSecurityConfig = {
  securityJsCode: "7a21e7841e7e9d3284b5cf72c49b0882",
};
import AMapLoader from '@amap/amap-jsapi-loader';


export default {
  name: "positionMapAbility",
  components:{
    // VueMarkdown
  },
  data() {
    return {
     msg:'',
     //为了让组件强制渲染
     key:0,
     htmlMD:'',
     form: {
      deviceId: "",
      key: ""
     },
     rules: {
			key: [{ required: true, message: '请输入密钥'}]
		 },
     isUser: false,
     canSave: true,
     map: null,
     geoCoder: null,
     markerList: [],
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
  mounted() {
    this.initMap();
  },
  methods: {
    initMap(){
        AMapLoader.load({
          key:"914bc9e5440aca8fcc92bbb5f2c3a4f2",
          version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins:["AMap.Geocoder","AMap.AutoComplete","AMap.Marker"],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        }).then((AMap)=>{
            this.map = new AMap.Map("container",{  //设置地图容器id
                zoom: 15,           //初始化地图级别
                resizeEnable: true,
            });
            this.geoCoder = new window.AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            })
        }).catch(e=>{
            console.log(e);
        })
    },
    async submit() {
				var validate = await this.$refs.form.validate().catch(() => { });
        if (!validate) {
          return false;
        }
        if(!this.canSave) {
          return;
        }
        this.canSave = false;
        if(this.markerList) {
          this.map.clearMap();
        }
        var data = {
          key: this.form.key,
          deviceId: this.form.deviceId? this.form.deviceId.replace(/，/g, ","):''
        };
        var res = this.isUser? this.$API.system.userdevice.getUserPosition.post(data):this.$API.system.device.getPosition.post(data);
        res.then(result => {
          if(result.resultCode == "0000"){
            //循环添加
            result.data.forEach(item => {
              var point = [item.longitude,item.latitude];
              var marker = new window.AMap.Marker({
                position: point,
                map: this.map,
                anchor: "top",
                icon: new window.AMap.Icon({
                  image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                  imageSize: new window.AMap.Size(40,50)
                })
              })
              this.markerList.push(marker);
              this.geoCoder.getAddress(point, (status, result) => {
                if (status === "complete" && result.info === 'OK') {
                  marker.address = result.regeocode.formattedAddress;
                }
              });
              marker.lnglat = point;
              marker.name = item.deviceName;
              marker.Id = item.deviceId;
              marker.on('click', this.markerClick)
              this.map.setFitView();
            })
            this.$message.success("成功");
          }else{
            this.$message.error(result.note);
          }
          this.canSave = true;
        })
		},
    markerClick(e) {
        var content = '';
        if(e.target.address) {
          content = '<div style="border-bottom: 1px solid #ddd;padding: 4px 0px;text-align: center;">'
                      +'<strong style="color:#0070c0;font-size:14px;">设备信息</strong></div>'
                      +'<div style="padding:5px 0px;font-size:12px;color: #000;">'
                      +'<ul style="margin-bottom: 5px"> 设备名称：'+e.target.name+'</ul>'
                      +'<ul style="margin-bottom: 5px"> 设备编号：'+e.target.Id+'</ul>'
                      +'<ul style="margin-bottom: 5px"> 经度：'+e.target.lnglat[0]+'</ul>'
                      +'<ul style="margin-bottom: 5px"> 纬度：'+e.target.lnglat[1]+'</ul>'
                      +'<ul> 详细地址：'+e.target.address+'</ul></div>';
        }else {
          content = '<div style="border-bottom: 1px solid #ddd;padding: 4px 0px;text-align: center;">'
                      +'<strong style="color:#0070c0;font-size:14px;">设备信息</strong></div>'
                      +'<div style="padding:5px 0px;font-size:12px;color: #000;">'
                      +'<ul style="margin-bottom: 5px"> 设备名称：'+e.target.name+'</ul>'
                      +'<ul style="margin-bottom: 5px"> 设备编号：'+e.target.Id+'</ul>'
                      +'<ul style="margin-bottom: 5px"> 经度：'+e.target.lnglat[0]+'</ul>'
                      +'<ul style="margin-bottom: 5px"> 纬度：'+e.target.lnglat[1]+'</ul></div>';
        }
        var infoWindow = new window.AMap.InfoWindow({
          offset: new window.AMap.Pixel(20, 0)//信息窗偏移
        });
        // 设置信息框内容
        infoWindow.setContent(content);
        //将marker放到指定坐标
        infoWindow.open(this.map, e.target.getPosition());
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

<style scoped> 
  #container{
    padding:0px;
    margin: 0px;
    width: 100%; 
    height: 100%; 
    border: 1px solid #090909;
  }
</style>
