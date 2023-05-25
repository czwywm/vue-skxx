<template>
    <el-container style="background-color:white">
    <el-main>
      <div v-highlight class="markdown-body" v-html="msg"></div>
      <el-alert title="填写密钥以及设备编号，选择时间段，点击查询可在地图中显示设备运行轨迹。" type="info" show-icon style="margin-bottom: 15px;"/>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" style="margin-top:20px;" :inline="true">
        <el-form-item label="密钥(key)" prop="key">
          <el-input v-model="form.key" placeholder="请输入密钥" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            @change="getstartTime"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            @change="getendTime"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="选择时间" prop="timeRange">
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
        <el-form-item>
          <el-button type="primary" v-if="canSave" @click="submit">查询</el-button>
          <el-button type="primary" v-else :loading="true">查询中</el-button>
        </el-form-item>
      </el-form>
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
          <!-- <table>
            <tr><td>经度：</td><td>{{this.info.longitude}}</td></tr>
            <tr><td>纬度：</td><td>{{this.info.latitude}}</td></tr>
            <tr><td>速度：</td><td>{{this.info.speed}}km/h</td></tr>
            <tr><td>角度：</td><td>{{this.info.degree}}°</td></tr>
            <tr><td>时间：</td><td>{{this.info.reportTime}}</td></tr>
          </table> -->
        </div>
      </div>
      
    </el-main>
  </el-container>
</template>

<script>
import 'github-markdown-css'; //哪里用markdown 就在哪里引用 可以放在min.js
import moment from "moment";

//安全密钥引入
window._AMapSecurityConfig = {
  securityJsCode: "7a21e7841e7e9d3284b5cf72c49b0882",
};
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: "trackQueryMapAbility",
  components:{
    // VueMarkdown
  },
  data() {
    return {
     msg:'',
     progressValue: 0,
     speedValue: 50,
     disabled: true,
     form: {
      key: "",
      deviceId: "",
      // timeRange: "",
      startTime: "",
      endTime: ""
     },
     startTime: '',
     endTime: '',
     rules: {
      key: [{ required: true, message: '请输入密钥'}],
			deviceId: [{ required: true, message: '请输入设备编号'}],
      // timeRange: [{ required: true, message: '请选择时间段'}],
      startTime: [{ required: true, message: '请选择开始时间'}],
      endTime: [{ required: true, message: '请选择结束时间'}],
		 },
     isUser: false,
     canSave: true,
     map: null,
     marker: null,
     lineArr: [],
     speedArr: [],
     degreeArr: [],
     timeArr: [],
     navg: null,
     pathSimplifierIns: null,
     info: {
      longitude: '0',
      latitude: '0',
      speed: '0',
      degree: '0',
      reportTime: '00:00'
     },

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
  watch:{
      
  },
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
    speedInput(val) {
      if(this.navg) {
        this.speedValue = val;
        this.navg.setSpeed(parseInt(val));
      }
    },
    progressInput(val) {
      if(this.navg) {
        let newVal = typeof(val) === 'number' ? val : this.progressValue;
        this.progressValue = newVal;
        let num = parseInt((newVal / 100) * this.lineArr.length);
        let decimal = String((newVal / 100) * this.lineArr.length).split('.')[1]||0;
        this.navg.moveToPoint(num, Number('0.'+decimal));
      }
    },
    progressChange(val) {
      if(val === 100) {
        this.disabled = true;
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
            this.geoCoder = new window.AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            })
        }).catch(e=>{
            console.log(e);
        })
    },
    async submit() {
      if(this.navg) {
        this.progressValue = 0;
        this.lineArr = [];
        this.navg.destroy();
      }
				var validate = await this.$refs.form.validate().catch(() => { });
        if (!validate) {
          return false;
        }
        var isCorrect = this.comparedate(this.form.startTime, this.form.endTime);
        if(!isCorrect) {
          this.$message.error("结束时间必须大于开始时间！");
          this.form.endTime = "";
          return false;
        }
        if(!this.canSave) {
          return;
        }
        this.canSave = false;
        var data = {
          key: this.form.key,
          deviceId: this.form.deviceId,
          startTime: this.startTime || "",
          endTime: this.endTime || ""
        };
        var res = this.isUser? this.$API.system.userdevice.getUserTrack.post(data):this.$API.system.device.getTrack.post(data);
        res.then(result => {
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
            this.$message.success("成功");
            }else {
              this.$message.error("当前时间段无轨迹");
            }
          }else{
            this.$message.error(result.note);
          }
          this.canSave = true;
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
            name: "轨迹",
            path: _this.lineArr, // data为后端接口数据
          },
        ]);
 
        //对第一条线路（即索引 0）创建一个巡航器
        _this.navg = pathSimplifierIns.createPathNavigator(0, {
          // loop: true, //循环播放
          speed:  parseInt(_this.speedValue), //巡航速度，单位千米/小时
          pathNavigatorStyle: {
						width: 40,
            height: 40,
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
  .el-slider__bar {
    background-color: #0070c0;
  }
  .el-slider__button {
    border: 2px solid #0070c0;
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
  .el-main {
    position: relative;
  }
  .box {
    /* display: none; */
    position: absolute;
    top: 124px;
    left: 20px;
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
</style>
