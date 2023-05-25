<template>
  <div class="login_modal" style="background-image: url(img/bg.png);background-size: 100% 100%;">
    <div class="login_header">
      <div class="login_header_title">
        <img :alt="$CONFIG.APP_NAME" src="img/pandalogo.png" style="height: 20px;">&nbsp;
        <!-- <text class="font_family_1">Panda</text>&nbsp; -->
        <text style="font-size: 30px;">|</text>&nbsp;
        <text class="font_family_2" style="font-weight: 600;vertical-align: baseline;">熊猫时空信息平台</text>
      </div>
      <!-- <div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#000"
          text-color="#fff"
          active-text-color="#0070c0">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">产品</el-menu-item>
          <el-menu-item index="3">服务与支持</el-menu-item>
          <el-menu-item index="4">关于我们</el-menu-item>
          <el-menu-item index="5">控制台</el-menu-item>
        </el-menu>
      </div> -->
      <div class="login_header_div">
        <el-button type="text" class="login_text_style" @click="isregister = false">登录</el-button>&nbsp;
        <text style="font-size: 16px;font-weight: 600;color: #0070c0;">|</text>&nbsp;
        <el-button type="text" class="login_text_style" @click="isregister = true">注册</el-button>
      </div>
    </div>
    <!-- 登录 -->
    <div class="login_body">
      <div class="login_div" v-if="!isregister">
        <div class="logo">
          <img :alt="$CONFIG.APP_NAME" src="img/logo.png" />
        </div>
        <div class="login-header">
          <h2>登录</h2>
        </div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" size="large" hide-required-asterisk="false">
          <el-form-item prop="user" >
            <el-input v-model="ruleForm.loginText" prefix-icon="el-icon-user" clearable placeholder="用户名" class="form-input">
              <template #append>
                <el-select v-model="userType" style="width: 110px;">
                  <el-option :label="$t('login.admin')" value="admin"></el-option>
                  <el-option :label="$t('login.user')" value="user"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" prefix-icon="el-icon-lock" clearable show-password placeholder="请输入登录密码" class="form-input">
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item prop="lCode">
                <el-input v-model="ruleForm.lCode" prefix-icon="el-icon-warning-outline" clearable placeholder="请输入验证码" class="form-input" maxlength="4">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <div @click="refreshLoginCode" style="cursor: pointer;float:right">
                <verifyCode :identifyCode="loginCode"></verifyCode>
              </div>
            </el-col>
          </el-row>
          <el-form-item v-if="this.isUser">
            <el-checkbox v-model="userChecked">记住用户名</el-checkbox>
          </el-form-item>
          <el-form-item v-else>
            <el-checkbox v-model="managerChecked">记住用户名</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-button" round @click="login" @keyup.enter="login">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 用户注册 -->
      <div class="login_div" v-if="isregister">
        <div class="login-header">
          <h2>欢迎用户注册</h2>
          <text>已有账号？<el-button type="text" style="color: #0070c0;" @click="isregister = false">登录</el-button></text>
        </div>
        <el-form ref="registerForm" :model="registerruleForm" :rules="registerrules" label-width="60px" size="large" hide-required-asterisk="false">
          <el-form-item prop="user" label="用户名">
            <el-input v-model="registerruleForm.userName" clearable placeholder="请设置用户名" class="form-input">
            </el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="registerruleForm.mobile" clearable placeholder="可用于登录和找回密码" class="form-input">
            </el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="registerruleForm.password" clearable show-password placeholder="请设置登录密码" class="form-input">
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item prop="rCode" label="验证码">
                <el-input v-model="registerruleForm.rCode" clearable placeholder="请输入验证码" class="form-input">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <div @click="refreshRegisterCode" style="cursor: pointer;float:right">
                <verifyCode :identifyCode="registerCode"></verifyCode>
              </div>
            </el-col>
          </el-row>
          <el-form-item label-width="0">
            <el-button type="primary" class="login-button" round @click="registerinfo">注册</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-checkbox v-model="readChecked" style="position: absolute;bottom: -30px;left: 50%;transform: translateX(-65%);">阅读并接受相关用户管理条例</el-checkbox>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <div class="login_footer">
      <div class="login_footer_title">
        版权所有：南京熊猫电子股份有限公司&nbsp;&nbsp;数字产业研究院©2022
      </div>
    </div>
  </div>
</template>
<script>
  import verifyCode  from "../../../components/verifyCode";
  export default {
    components: {verifyCode},
    data() {
      return {
        activeIndex: '1',
        isregister: false,
        islogin: false,
        userChecked: false, //记住用户名
        managerChecked: false, //
        readChecked: false,
        userType: 'user',
        accessUserInfo: {
          remember: '',
          loginText: ''
        },
        accessManagerInfo: {
          remember: '',
          loginName: ''
        },
        ruleForm: {
          loginText: "",
          password: "",
          lCode: "",
        },
        registerruleForm: {
          userName: "",
          mobile: "",
          password: "",
          rCode: "",
        },
        rules: {
          loginText: [
            {
              required: true,
              message: this.$t("login.userError"),
              trigger: "blur",
            },
          ],
          password: [
            {
              required: true,
              message: this.$t("login.PWError"),
              trigger: "blur",
            },
          ],
          lCode: [
            {
              required: true, 
              message: '验证码不能为空', 
              trigger: 'blur'
            }
          ]
        },
        registerrules: {
          userName: [
            {
              required: true,
              message: "请输入登录名",
              trigger: "blur",
            },
          ],
          mobile: [
            {
              required: true,
              message: "请输入手机号",
              trigger: "blur",
            },
          ],
          password: [
            {
              required: true,
              message: "请输入登录密码",
              trigger: "blur",
            },
          ],
          rCode: [
            {
              required: true, 
              message: '验证码不能为空', 
              trigger: 'blur'
            }
          ]
        },
        registerCode: "",
        loginCode: "",
        identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
        isUser: true
      }
      
    },
    watch:{
			userType(val){
				if(val == 'admin'){
					this.isUser = false;
          let accessManagerInfo = this.$TOOL.data.get("accessManagerInfo");
          this.ruleForm.loginText = '';
          if (accessManagerInfo) {
            this.managerChecked = accessManagerInfo.remember;
            this.ruleForm.loginText = accessManagerInfo.loginName;
          }
				}else if(val == 'user'){
					this.isUser = true;
           let accessUserInfo = this.$TOOL.data.get("accessUserInfo");
           this.ruleForm.loginText = '';
          if (accessUserInfo) {
            this.userChecked = accessUserInfo.remember;
            this.ruleForm.loginText = accessUserInfo.loginText;
          }
				}
			}
		},
    created (){
      this.refreshRegisterCode();
      this.refreshLoginCode();
      this.$TOOL.data.remove("TOKEN");
      this.$TOOL.data.remove("USER_INFO");
      this.$TOOL.data.remove("MENU");
      this.$TOOL.data.remove("PERMISSIONS");
      this.$TOOL.data.remove("grid");
      this.$store.commit("clearViewTags");
      this.$store.commit("clearKeepLive");
      this.$store.commit("clearIframeList");
    },
    mounted() {
      //绑定监听事件
      window.addEventListener("keydown", this.keydown);
      // 初始化验证码
      this.registerCode = '';
      this.loginCode = '';
      this.makeCode(this.identifyCodes,4,"register");
      this.makeCode(this.identifyCodes,4,"login");
      //调用用户名和管理名
      let accessUserInfo = this.$TOOL.data.get("accessUserInfo");
      if (accessUserInfo) {
        this.userChecked = accessUserInfo.remember;
        this.ruleForm.loginText = accessUserInfo.loginText;
      }
    },
    unmounted() {
      window.removeEventListener("keydown",this.keydown,false)
    },
    methods: {
      keydown(e) {
        if(e.keyCode === 13) {
          this.login()
        }
      },
      //登录
      async login() {
        var validate = await this.$refs.ruleForm.validate().catch(() => { });
        if (!validate) {
          return false;
        }
        if(this.ruleForm.lCode != this.loginCode) {
          this.$message.error("验证码错误！");
          this.refreshLoginCode();
          return false;
        }
        this.islogin = true;
        //用户登录
        if(this.isUser) {
          let data = {
            loginText: this.ruleForm.loginText,
            passWord: this.$TOOL.crypto.MD5(this.ruleForm.password),
          };
          //获取token
          var res1 = await this.$API.auth.userLogin.post(data);
          if (res1.resultCode == "0000") {
            const accessUserInfo = {
              remember: this.userChecked,
              loginText: this.ruleForm.loginText
            };
            if (this.userChecked){
              this.$TOOL.data.set("accessUserInfo", accessUserInfo);
            }
            this.$TOOL.data.set("TOKEN", res1.data.token);
            this.$TOOL.data.set("USER_INFO", res1.data);
            let mockmenu = [
              {
                name: "home",
                path: "/home",
                meta: {
                  title: "首页",
                  icon: "el-icon-s-home",
                  type: "menu",
                },
                children: [
                  {
                    name: "dashboard",
                    path: "/dashboard",
                    meta: {
                      title: "控制台",
                      icon: "el-icon-s-platform",
                      affix: true,
                    },
                    component: "home",
                  },
                ],
              },
              {
                  name: "apiDocument",
                  path: "/apiDocument",
                  meta: {
                    title: "API文档",
                    icon: "el-icon-receiving",
                    type: "menu",
                  },
                  children: [
                    {
                        name: "positionServe",
                        path: "/positionServe",
                        meta: { title: "定位服务", icon: "el-icon-position", type: "menu" },
                        children: [
                          {
                            name: "positionApiAbility",
                            path: "/positionApiAbility",
                            meta: { title: "定位服务接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/positionServe/positionApiAbility",
                          },
                          {
                            name: "positionMapAbility",
                            path: "/positionMapAbility",
                            meta: { title: "定位服务地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/positionServe/positionMapAbility",
                          },
                        ],
                    },
                    {
                        name: "trackQuery",
                        path: "/trackQuery",
                        meta: { title: "轨迹查询", icon: "el-icon-truck", type: "menu" },
                        children: [
                          {
                            name: "trackQueryApiAbility",
                            path: "/trackQueryApiAbility",
                            meta: { title: "轨迹查询接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryApiAbility",
                          },
                          {
                            name: "trackQueryMapAbility",
                            path: "/trackQueryMapAbility",
                            meta: { title: "轨迹查询地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryMapAbility",
                          },
                        ]
                    },
                    {
                        name: "timeServe",
                        path: "/timeServe",
                        meta: { title: "授时服务", icon: "el-icon-time", type: "menu" },
                        children: [
                          {
                            name: "timeServeApiAbility",
                            path: "/timeServeApiAbility",
                            meta: { title: "授时服务接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/timeServe/timeServeApiAbility",
                          }
                        ]
                    }, 
                    {
                      name: "errorcodeList",
                      path: "/errorcodeList",
                      meta: {
                        title: "错误码列表",
                        icon: "el-icon-document",
                        affix: false,
                      },
                      component: "apiDocument/errorCode/errorcodeList",
                    },
                  ],
                },
                {
		              "name": "manage",
                  "path": "/manage",
                  "meta": {
                    "title": "应用管理",
                    "icon": "el-icon-menu",
                    "type": "menu"
                  },
                  "children": [{
                      "name": "userdevice",
                      "path": "/userdevice",
                      "meta": {
                        "title": "设备管理",
                        "icon": "el-icon-setting",
                        "type": "menu"
                      },
                      "children": [{
                          "name": "timeDevice",
                          "path": "/timeDevice",
                          "meta": {
                            "title": "授时设备管理",
                            "icon": "el-icon-timer",
                            "affix": false
                          },
                          "component": "manage/userdevice/timeDevice/index"
                        },
                        {
                          "name": "positionDevice",
                          "path": "/positionDevice",
                          "meta": {
                            "title": "定位设备管理",
                            "icon": "el-icon-location-information",
                            "affix": false
                          },
                          "component": "manage/userdevice/positionDevice/index"
                        }
                      ]
                    },
                    {
                      "name": "userapply",
                      "path": "/userapply",
                      "meta": {
                        "title": "我的应用",
                        "icon": "el-icon-coordinate",
                        "affix": false
                      },
                      "component": "manage/userapply/index"
                    }
                  ]
                },
              {
                name: "userCenter",
                path: "/userCenter",
                meta: {
                  title: "个人中心",
                  icon: "el-icon-user-solid",
                  type: "menu",
                },
                children: [
                  {
                    name: "personalInfo",
                    path: "/personalInfo",
                    meta: { title: "基本信息", icon: "el-icon-menu", affix: false },
                    component: "userCenter/personalInfo/index",
                  }
                ],
              },
            ];
            this.$TOOL.data.set("MENU", mockmenu);
            this.$router.replace({
              path: "/",
            });
            this.$message.success("Login Success 登录成功");
            this.islogin = false;
          } else {
            this.islogin = false;
            this.$message.error(res1.note);
            this.refreshLoginCode();
          }
        }else {
          //管理员登录
          let data = {
            loginName: this.ruleForm.loginText,
            passWord: this.$TOOL.crypto.MD5(this.ruleForm.password),
          };
          //获取token
          var res = await this.$API.auth.managerLogin.post(data);
          if (res.resultCode == "0000") {
            const accessManagerInfo = {
              remember: this.managerChecked,
              loginName: this.ruleForm.loginText
            };
            if (this.managerChecked){
              this.$TOOL.data.set("accessManagerInfo", accessManagerInfo);
            }
            this.$TOOL.data.set("TOKEN", res.data.token);
            this.$TOOL.data.set("USER_INFO", res.data);
            if(this.ruleForm.loginText === "admin") {
              let mockmenu = [
                {
                  name: "home",
                  path: "/home",
                  meta: {
                    title: "首页",
                    icon: "el-icon-s-home",
                    type: "menu",
                  },
                  children: [
                    {
                      name: "dashboard",
                      path: "/dashboard",
                      meta: {
                        title: "控制台",
                        icon: "el-icon-s-platform",
                        affix: true,
                      },
                      component: "home",
                    },
                  ],
                },
                {
                  name: "apiDocument",
                  path: "/apiDocument",
                  meta: {
                    title: "API文档",
                    icon: "el-icon-receiving",
                    type: "menu",
                  },
                  children: [
                    {
                        name: "positionServe",
                        path: "/positionServe",
                        meta: { title: "定位服务", icon: "el-icon-position", type: "menu" },
                        children: [
                          {
                            name: "positionApiAbility",
                            path: "/positionApiAbility",
                            meta: { title: "定位服务接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/positionServe/positionApiAbility",
                          },
                          {
                            name: "positionMapAbility",
                            path: "/positionMapAbility",
                            meta: { title: "定位服务地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/positionServe/positionMapAbility",
                          },
                        ],
                    },
                    {
                        name: "trackQuery",
                        path: "/trackQuery",
                        meta: { title: "轨迹查询", icon: "el-icon-truck", type: "menu" },
                        children: [
                          {
                            name: "trackQueryApiAbility",
                            path: "/trackQueryApiAbility",
                            meta: { title: "轨迹查询接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryApiAbility",
                          },
                          {
                            name: "trackQueryMapAbility",
                            path: "/trackQueryMapAbility",
                            meta: { title: "轨迹查询地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryMapAbility",
                          },
                        ]
                    },
                    {
                        name: "timeServe",
                        path: "/timeServe",
                        meta: { title: "授时服务", icon: "el-icon-time", type: "menu" },
                        children: [
                          {
                            name: "timeServeApiAbility",
                            path: "/timeServeApiAbility",
                            meta: { title: "授时服务接口功能", icon: "el-icon-link", affix: false},
                            component: "apiDocument/timeServe/timeServeApiAbility",
                          }
                        ]
                    }, 
                    {
                      name: "errorcodeList",
                      path: "/errorcodeList",
                      meta: {
                        title: "错误码列表",
                        icon: "el-icon-document",
                        affix: false,
                      },
                      component: "apiDocument/errorCode/errorcodeList",
                    },
                  ],
                },
                {
                  "name": "manage",
                  "path": "/manage",
                  "meta": {
                    "title": "应用管理",
                    "icon": "el-icon-menu",
                    "type": "menu"
                  },
                  "children": [{
                      "name": "device",
                      "path": "/device",
                      "meta": {
                        "title": "设备管理",
                        "icon": "el-icon-setting",
                        "type": "menu"
                      },
                      "children": [{
                          "name": "timeDevice",
                          "path": "/timeDevice",
                          "meta": {
                            "title": "授时设备管理",
                            "icon": "el-icon-timer",
                            "affix": false
                          },
                          "component": "manage/device/timeDevice/index"
                        },
                        {
                          "name": "positionDevice",
                          "path": "/positionDevice",
                          "meta": {
                            "title": "定位设备管理",
                            "icon": "el-icon-location-information",
                            "affix": false
                          },
                          "component": "manage/device/positionDevice/index"
                        }
                      ]
                    },
                    {
                      "name": "apply",
                      "path": "/apply",
                      "meta": {
                        "title": "我的应用",
                        "icon": "el-icon-coordinate",
                        "affix": false
                      },
                      "component": "manage/apply/index"
                    }
                  ]
                },
                {
                  name: "system",
                  path: "/system",
                  meta: {
                    title: "系统管理",
                    icon: "el-icon-setting",
                    type: "menu",
                  },
                  children: [
                  {
                      name: "manager",
                      path: "/manager",
                      meta: { title: "管理员", icon: "el-icon-s-custom", affix: false },
                      component: "system/manager/index",
                    },
                    {
                      name: "user",
                      path: "/user",
                      meta: { title: "用户管理", icon: "el-icon-menu", affix: false },
                      component: "system/user/index",
                    },
                    {
                      name: "log",
                      path: "/log",
                      meta: { title: "操作日志", icon: "el-icon-document", affix: false },
                      component: "system/log/index",
                    },
                    {
                      name: "rules",
                      path: "/rules",
                      meta: { title: "系统规则", icon: "el-icon-set-up", affix: false },
                      component: "system/rules/index",
                    },
                    {
                      name: "password",
                      path: "/password",
                      meta: { title: "密码管理", icon: "el-icon-lock", affix: false },
                      component: "system/password",
                    },
                  ],
                },
              ];
              let roleList = ["QUERY","ADD","EDIT","DELETE","SET","INPORT","EXPORT"];
              this.$TOOL.data.set("MENU", mockmenu);
              this.$TOOL.data.set("ROLE", roleList);
            }else if(res.data.menuList){
              this.$TOOL.data.set("MENU", JSON.parse(res.data.menuList));
            }
            if(res.data.roleList) {
              this.$TOOL.data.set("ROLE", res.data.roleList);
            }
            this.$router.replace({
              path: "/",
            });
            this.$message.success("Login Success 登录成功");
            this.islogin = false;
          } else {
            this.islogin = false;
            this.$message.error(res.note);
            this.refreshLoginCode();
          }
        }
      },
      //用户注册
      async registerinfo() {
        var validate = await this.$refs.registerForm.validate().catch(() => { });
        if (!validate) {
          return false;
        }
        if(this.registerruleForm.rCode != this.registerCode) {
          this.$message.error("验证码错误！");
          this.refreshRegisterCode();
          return false;
        }
        var data = {
          passWord: this.$TOOL.crypto.MD5(this.registerruleForm.password),
          userName: this.registerruleForm.userName,
          mobile: this.registerruleForm.mobile,
        };
        //获取token
        var res = await this.$API.auth.useRegister.post(data);
        if (res.resultCode == "0000") {
          this.isregister = false;
          this.$message.success("注册成功");
        } else {
          this.$message.error(res.note);
          this.refreshRegisterCode();
        }
      },
      // 刷新验证码
      refreshRegisterCode() {
        this.registerCode = "";
        this.makeCode(this.identifyCodes,4,"register");
      },
      refreshLoginCode() {
        this.loginCode = "";
        this.makeCode(this.identifyCodes,4,"login");
      },
      makeCode(o,l,val) {
        if(val === "register") {
          for (let i = 0; i < l; i++) {
          this.registerCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
          }
        }else if(val === "login") {
          for (let i = 0; i < l; i++) {
          this.loginCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
          }
        }
      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }
    },
  }
</script>
<style scoped>
  .login_modal {
    width: 100%;
    height: 100%;
    /* background: url('../../../../public/img/bg.png') center center no-repeat; */
    /* background-size: 100% 100%; */
    /* display: flex;
    flex-direction: column; */
  }
  .login_header {
    /* flex: 13%; */
    height: 80px;
    background-color: black;
  }
  .login_header .login_header_title {
    float: left;
    line-height: 80px;
    margin-left: 30px;
    color: #fff;
  }
  .font_family_1 {
    font-family: "Niagato";
    font-size: 52px;
  }
  .font_family_2 {
    font-family: "CitypopMainDEMO";
    font-size: 25px;
  }
  .login_header .login_header_div {
    float: right;
    margin-top: 26px;
    width: 120px;
    height: 35px;
  }
  .login_text_style{
    color: #0070c0;
    font-size: 16px;
    font-weight: 600;
  }
  .login_body {
    position: relative;
    height: calc(100vh - 120px);
  }
  .login_body .login_div {
    position: absolute;
    top: 50%;
    right: 260px;
    transform: translateY(-50%);
    /* left: 50%;
    transform: translate(-50%, -50%); */
    margin:auto;
    padding: 20px 15px;
    width: 350px;
    background-color: #fff;
    border: 1px solid #d5d5d5;
        /* width: 440px;
    padding: 25px 44px;
    border-radius: 20px; */
  }
  .login-header {
    margin: 10px auto 20px 20px;
    /* margin: 24px auto 20px 20px; */
  }
  .login-header text {
    color: #817f80;
    font-size: 10px;
  }
  .logo {
    position: relative;
    margin: auto;
    text-align: center;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 1px solid #000;
    /* margin: 16px auto; */
  }
  .logo img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 45px;
    vertical-align: bottom;
  }
  .form-input {
    font-size: 12px;
  }
  .login-button {
    width: 90%;
    margin: auto 5%;
  }
  .login_footer {
    /* flex: 5%; */
    height: 40px;
    background-color: black;
    position: relative;
  }
  .login_footer .login_footer_title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 12px;
  }
  /* ::v-deep .el-form-item__content {} */
  ::v-deep .el-checkbox__label {
    color: rbga(168, 142, 168,0.8);
  }
  ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: rbga(168, 142, 168,0.5);
  }
  ::v-deep .el-checkbox {
    --el-checked-background-color: #0070c0;
  }
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0070c0;
    border-color: #0070c0;
  }
  .el-menu {
    float: left;
    width: 810px;
    margin-left: 430px;
  }
  .el-menu--horizontal>.el-menu-item {
    height: 68px;
    margin-top: 12px;
  }
  .el-menu-item {
    font-size: 18px;
    font-weight: 600;
    padding: 0 45px;
  }
</style>