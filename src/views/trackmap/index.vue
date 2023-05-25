<template>
  <div id="container"></div>
  <div class="box">
        <strong>控制操作：</strong>
        <div class="button-div">
          <el-button type="primary" class="btn" id="start" @click="start">开始回放</el-button>
          <el-button type="primary" class="btn" id="pause" @click="pause">暂停回放</el-button>
          <el-button type="primary" class="btn" id="resume" @click="resume">继续回放</el-button>
          <el-button type="primary" class="btn" id="stop" @click="stop">停止回放</el-button>
        </div>
        <div class="block">
          <span class="demonstration">进度：{{this.progressValue}}%:</span>
          <el-slider v-model="progressValue" @input="progressInput" @change="progressChange" :max="100" :show-tooltip="false" :disabled="disabled"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">速度：{{this.speedValue}}km/h:</span>
          <el-slider v-model="speedValue" @input="speedInput" :max="500" :show-tooltip="false"></el-slider>
        </div>
        <div class="info">
          <strong>行进信息：</strong>
          <ul>
            <li>经度：<span>{{this.info.longitude}}</span></li>
            <li>纬度：<span>{{this.info.latitude}}</span></li>
            <li>速度：<span>{{this.info.speed}}km/h</span></li>
            <li>角度：<span>{{this.info.degree}}°</span></li>
            <li>时间：<span>{{this.info.reportTime}}</span></li>
          </ul>
        </div>
      </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import moment from "moment";
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
      startTime: '',
      endTime: '',
      map: null,
      marker: null,
      lineArr: [],
      speedArr: [],
      degreeArr: [],
      timeArr: [],
      navg: null,
      info: {
       longitude: '0',
       latitude: '0',
       speed: '0',
       degree: '0',
       reportTime: '00:00'
      },
      progressValue: 0,
      speedValue: 50,
      disabled: true,
    }
  },
  mounted(){
    this.urlinfo = window.location.href;
    this.key = this.GetArgsFromHref(this.urlinfo,"key");
    this.deviceId = this.GetArgsFromHref(this.urlinfo,"deviceId");
    this.startTime = this.GetArgsFromHref(this.urlinfo,"startTime");
    this.endTime = this.GetArgsFromHref(this.urlinfo,"endTime");
    this.initMap();
  }, 
  methods: {
    comparedate(d1,d2) {
      var oDate1 = new Date(d1);
      var oDate2 = new Date(d2);
      if(oDate1.getTime() > oDate2.getTime()) {
        return false
      }else {
        return true
      }
    },
    initMap(){
        AMapLoader.load({
          key:"914bc9e5440aca8fcc92bbb5f2c3a4f2",
          version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins:["AMap.Geocoder","AMap.AutoComplete","AMap.Marker","AMap.moveAnimation",],
          AMapUI: {
            version: '1.1',
            plugins: ['misc/PathSimplifier','overlay/SimpleMarker']//SimpleMarker设置自定义图标，PathSimplifier轨迹展示组件
          }
        }).then((AMap)=>{
            this.map = new AMap.Map("container",{  //设置地图容器id
                zoom: 15,           //初始化地图级别
                resizeEnable: true,
            });
            this.submit();
        }).catch(e=>{
            console.log(e);
        })
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
      
      var isCorrect = this.comparedate(this.startTime, this.endTime);
        if(!isCorrect) {
          this.$message.error("结束时间必须大于开始时间！");
          return false;
        }
			var data = {
        key: this.key,
        deviceId: this.deviceId,
        startTime: moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss')
      };
        var res = this.$API.system.userdevice.getUserTrack.post(data);
        res.then(result => {
          // 移除已创建的 navg
          if(this.navg) {
            this.progressValue = 0;
            this.lineArr = [];
            this.navg.destroy();
          }
          if(result.resultCode == "0000"){
            if(result.data) {
              result.data.forEach(ele => {
                let array = [ele.longitude, ele.latitude];
                this.lineArr.push(array);
                this.speedArr.push(ele.speed);
                this.degreeArr.push(ele.degree);
                this.timeArr.push(ele.reportTime);
              });
               this.drawPolyline();
              // document.getElementById('button-div').style.display = 'block';
            }else {
              this.$message.error("当前时间段无轨迹");
            }
          }else{
            this.$message.error(result.note);
          }
        })
		},
    drawPolyline() {
      var _this = this;
       AMapUI.load(["ui/misc/PathSimplifier"], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }
        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          //autoSetFitView:false,
          map: _this.map, //所属的地图实例
          autoSetFitView: true,
 
          getPath: function (pathData) {
            return pathData.path;
          },
          // getHoverTitle: function (pathData, pathIndex, pointIndex) {
          //   if (pointIndex >= 0) {
          //     //point
          //     return (
          //       pathData.name +
          //       "，点：" +
          //       pointIndex +
          //       "/" +
          //       pathData.path.length
          //     );
          //   }
 
          //   return pathData.name + "，点数量" + pathData.path.length;
          // },
          renderOptions: {
            renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: '#28F',
              lineWidth: 6,
              dirArrowStyle: true
            },
          },
        });
 
        window.pathSimplifierIns = pathSimplifierIns;
        pathSimplifierIns.setData([
          {
            name: "路线0",
            path: _this.lineArr, // data为后端接口数据
          },
        ]);
 
        //对第一条线路（即索引 0）创建一个巡航器
        _this.navg = pathSimplifierIns.createPathNavigator(0, {
          // loop: true, //循环播放
          speed:  parseInt(_this.speedValue), //巡航速度，单位千米/小时
          pathNavigatorStyle: {
						width: 50,
            height: 50,
						content:  PathSimplifier.Render.Canvas.getImageContent('../img/car.png', onload, onerror),
						//经过路径的样式
						pathLinePassedStyle: {
							lineWidth: 6,
							strokeStyle: "#AF5",//轨迹线的颜色
						},
					},
        });
        _this.navg.on('move', function(data,position) {
          let point = this.getPosition();
          _this.info.longitude = point.lng;
          _this.info.latitude = point.lat;
          let nowIndex = position.dataItem.pointIndex;
          _this.info.speed = _this.speedArr[nowIndex];
          _this.info.degree = _this.degreeArr[nowIndex];
          _this.info.reportTime = _this.timeArr[nowIndex];
          let idx = this.getCursor().idx;
          let tail = this.getCursor().tail;
          let totalIndx = idx + tail;
          let len = this.getPathEndIdx();
          _this.progressValue = Number((totalIndx/len*100).toFixed(2));
          if(_this.navg.isCursorAtPathEnd()) {
            _this.progressValue = 100;
          }
        })
      });
    },
    start() {
      this.navg.start();
      this.progressValue = 0;
      this.disabled = false;
    },
    pause() {
      this.navg.pause();
    },
    resume() {
      this.navg.resume();
    },
    stop() {
      this.navg.stop();
      this.progressValue = 0;
      this.navg.moveToPoint(0, 0);
    },
  }
}
</script>
<style scoped>
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 100vh;
  }
  .box {
    /* display: none; */
    position: absolute;
    top: calc(50% - 6px);
    left: 10px;
    width: 25%;
    padding: 16px 3px 3px 3px;
    background-color: rgba(247, 251, 255,0.8);
    box-shadow: 2px 2px 4px #c8b6b6;
    border-radius: 4px;
  }
  .box>strong {
    margin: auto 12px;
    font-size: 15px;
    color: #0070c0;
  }
  ::v-deep .amap-icon img {
    width: 50px;
  }
  .button-div {
    margin-top: 10px;
    padding: 0px 5px;
  }
  .button-div .btn {
    margin: 5px;
    padding: 8px;
    width: 80px;
    height: 30px;
    border: none;
    border-radius: 4px;
    border: 1px solid #0070c0;
    color: #0070c0;
    text-align: center;
    line-height: 14px;
    background-color: #ffffff;
    cursor: pointer;
  }
  .button-div .btn:hover {
    background: #dbeaf5;
  } 
  .block {
    display: flex;
    width: 100%;
    margin-top: 4px;
    padding: 0px 12px;
    line-height: 38px;
  }
  .block span {
    width: 36%;
    font-size: 14px;
  }
  .block .el-slider {
    width: 64%;
  }
  .info {
    margin-top: 8px;
    padding: 0px 12px;
  }
  .info>strong {
    font-size: 15px;
    color: #0070c0;
  }
  .info>ul {
    list-style: none;
    margin-top: 12px;
    font-size: 15px;
  }
  .info>ul>li {
    margin-bottom: 8px;
  }
  .info>ul>li>span {
    margin-left: 5px;
  }
  ::v-deep .el-slider__bar {
    background-color: #0070c0;
  }
  ::v-deep .el-slider__button {
    border: 2px solid #0070c0;
  }
</style>