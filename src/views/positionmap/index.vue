<template>
  <div id="container"></div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader';
//安全密钥引入
window._AMapSecurityConfig = {
  securityJsCode: "7a21e7841e7e9d3284b5cf72c49b0882",
};

export default {
  data() {
    return {
      urlinfo: '',
      key: '',
      deviceId: '',
      map: null,
      geoCoder: null,
	      styleObjectArr: [],
	      massMarks: null,
	      marker: {},
	      mapData: [],
      markerList: [],
    }
  },
  mounted(){
    this.initMap();
    this.urlinfo = window.location.href;
    this.key = this.GetArgsFromHref(this.urlinfo,"key");
    this.deviceId = this.GetArgsFromHref(this.urlinfo,"deviceId");
  }, 
  methods: {
    initMap(){
        AMapLoader.load({
          key:"914bc9e5440aca8fcc92bbb5f2c3a4f2",
          version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins:['AMap.Marker',"AMap.Geocoder", "AMap.AutoComplete",],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        }).then((AMap)=>{
            this.map = new AMap.Map("container",{  //设置地图容器id
                zoom: 15,           //初始化地图级别
                resizeEnable: true,
            });
            this.geoCoder = new window.AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            })
            this.submit();
        }).catch(e=>{
            console.log(e);
        })
    },
    getMassMarks() {
      let _this = this
      //创建多种类点样式数组
      _this.styleObjectArr = [
        {
          url: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',  // 线上图标地址引入方式
          size: new window.AMap.Size(20, 30), // 图标大小
          anchor: new window.AMap.Pixel(5, 5), // 图标显示位置偏移量，基准点为图标左上角
          zIndex: 1,//设置层级，值大的显示在上层
        },
      ]
      _this.massMarks = new window.AMap.MassMarks(_this.mapData, {
        zIndex: 100, // 相对于地图海量点图层叠加的顺序
        zooms: [3, 19], // 在指定地图缩放级别范围内展示海量点图层
        cursor: "pointer",
        style: _this.styleObjectArr, //多种样式对象的数组
      })
      _this.marker = new window.AMap.Marker({ content: " ", map: _this.map })//创建marker
      // 鼠标移上显示信息窗体
      window.AMap.event.addListener(_this.massMarks, "mouseover", function(e) {
        _this.marker.setPosition(e.data.lnglat)
        _this.marker.setLabel({ content: e.data.name })//设置信息窗体内容
      })
      //鼠标移开隐藏信息窗体
      window.AMap.event.addListener(_this.massMarks, "mouseout", function(e) {
        _this.marker.setPosition(e.data.lnglat)
        _this.marker.setLabel({ content: "" })//信息窗体内容清空
      })
      // 将 massMarks 添加到地图实例
      _this.massMarks.setMap(_this.map)
    },

    GetArgsFromHref(sHref, sArgName) {
			var args = sHref.split("?");
			var retval = "";
			if(args[0] == sHref) {return retval;}  
			var str = args[1];
			args = str.split("&");
			for(var i = 0; i < args.length; i ++) {
			  str = args[i];
			  var arg = str.split("=");
			  if(arg.length <= 1) continue;
			  if(arg[0] == sArgName) {retval = arg[1];}
			}
			return retval;
		},
    async submit() {
			var data = {
        key: this.key,
        deviceId: this.deviceId? this.deviceId.replace(/，/g, ","):''
      };
        var res = this.$API.system.userdevice.getUserPosition.post(data);
        res.then(result => {
          // 移除已创建的 marker
          // if (this.marker) this.map.clearMap();
          if(result.resultCode == "0000"){
            //添加海量点
            // result.data.forEach((e,i) => {
            //   let num = ++i;
            //   let a = [e.longitude,e.latitude];
            //   let obj = {
            //     lnglat: a,
            //     name: e.deviceId,
            //     id: num
            //   }
            //   this.mapData.push(obj)
            // });
            // console.log(this.mapData)
            // this.getMassMarks();
            //循环添加
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
          }else{
            this.map.clearMap();
            this.$message.error(result.note);
          }
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
  }
}
</script>
<style scoped>
  #container{
    padding:0px;
    margin: 0px;
    width: 100vw;
    height: 100vh;
  }
  ::v-deep .amap-icon{
    overflow:inherit !important;
  }
  ::v-deep .amap-marker-label {
    border: 1px solid #dedee2;
    padding: 5px;
  }
</style>