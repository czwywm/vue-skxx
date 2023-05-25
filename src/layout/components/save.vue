<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="登录名" prop="loginText">
				<el-input v-model="form.loginText" placeholder="请输入用户名/手机号" clearable></el-input>
			</el-form-item>
			<el-form-item label="登录密码" prop="passWord">
				<el-input show-password v-model="form.passWord" placeholder="请输入登录密码" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item label="确认新密码" prop="conformPwd">
				<el-input v-model="form.conformPwd" type="password" placeholder="请再次输入登录密码" clearable show-password></el-input>
			</el-form-item> -->
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">登录</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "",
				titleMap: '切换账号',
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					loginText: "",
					passWord: "",
					// conformPwd: ""
				},
				//验证规则
				rules: {
					loginText: [
						{required: true, message: '请输入用户名/手机号'}
					],
					passWord: [
						{required: true, message: '请输入登录密码'},
					],
					// conformPwd: [
					// 	{required: true, message: '请再次输入登录密码'},
					// 	{validator: (rule, value, callback) => {
					// 		if (value !== this.form.passWord) {
					// 			callback(new Error('两次输入密码不一致'));
					// 		}else{
					// 			callback();
					// 		}
					// 	}}
					// ],
				},
			}
		},
		mounted() {
			
		},
		methods: {
			//显示
			open(mode){
				this.mode = mode;//mode为true，为用户；mode为false，为管理员
				this.visible = true;
				return this
			},
			//表单提交方法
			async submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						if(this.mode) {
							//用户登录
							let data = {
								loginText: this.form.loginText,
          			passWord: this.$TOOL.crypto.MD5(this.form.passWord),
							};
							var res1 = await this.$API.auth.userLogin.post(data);
							if (res1.resultCode == "0000") {
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
                        path: "/apiDocument",
                        meta: { title: "定位服务", icon: "el-icon-position", type: "menu" },
                        children: [
                          {
                            name: "positionApiAbility",
                            path: "/positionServe/positionApiAbility",
                            meta: { title: "接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/positionServe/positionApiAbility",
                          },
                          {
                            name: "positionMapAbility",
                            path: "/positionServe/positionMapAbility",
                            meta: { title: "地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/positionServe/positionMapAbility",
                          },
                        ],
                    },
                    {
                        name: "trackQuery",
                        path: "/apiDocument",
                        meta: { title: "轨迹查询", icon: "el-icon-truck", type: "menu" },
                        children: [
                          {
                            name: "trackQueryApiAbility",
                            path: "/trackQuery/trackQueryApiAbility",
                            meta: { title: "接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryApiAbility",
                          },
                          {
                            name: "trackQueryMapAbility",
                            path: "/trackQuery/trackQueryMapAbility",
                            meta: { title: "地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryMapAbility",
                          },
                        ]
                    },
                    {
                        name: "timeServe",
                        path: "/apiDocument",
                        meta: { title: "授时服务", icon: "el-icon-time", type: "menu" },
                        children: [
                          {
                            name: "timeServeApiAbility",
                            path: "/timeServe/timeServeApiAbility",
                            meta: { title: "接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/timeServe/timeServeApiAbility",
                          },
                          {
                            name: "timeServeMapAbility",
                            path: "/timeServe/timeServeMapAbility",
                            meta: { title: "地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/timeServe/timeServeMapAbility",
                          },
                        ]
                    }, 
                  ],
                },
              {
                name: "manage",
                path: "/manage",
                meta: {
                  title: "应用管理",
                  icon: "el-icon-menu",
                  type: "menu",
                },
                children: [
                  {
                    name: "userdevice",
                    path: "/manage/userdevice",
                    meta: { title: "设备管理", icon: "el-icon-setting", affix: false },
                    component: "manage/userdevice/index",
                  },
                  {
                    name: "userapply",
                    path: "/manage/userapply",
                    meta: { title: "我的应用", icon: "el-icon-coordinate", affix: false },
                    component: "manage/userapply/index",
                  },
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
                    path: "/userCenter/personalInfo",
                    meta: { title: "基本信息", icon: "el-icon-menu", affix: false },
                    component: "userCenter/personalInfo/index",
                  },
                  // {
                  //   name: "mySdk",
                  //   path: "/userCenter/mysdk",
                  //   meta: { title: "我的SDK", icon: "el-icon-menu", affix: false },
                  //   component: "userCenter/mysdk/index",
                  // }
                ],
              },
            ];
								this.$TOOL.data.set("MENU", mockmenu);
								this.$router.replace({
									path: "/",
								});
								this.visible = false;
								this.$router.go(0);
								// this.$message.success("Login Success 登录成功");
							} else {
								this.$message.error(res1.note);
							}
						}else {
							//管理员登录
							let data = {
								loginName: this.form.loginText,
								passWord: this.$TOOL.crypto.MD5(this.form.passWord),
							};
							var res = await this.$API.auth.managerLogin.post(data);
							this.isSaveing = false;
							if(res.resultCode == "0000"){
								this.$TOOL.data.set("TOKEN", res.data.token);
								this.$TOOL.data.set("USER_INFO", res.data);
								if(this.form.loginText === "admin") {
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
                        path: "/apiDocument",
                        meta: { title: "定位服务", icon: "el-icon-position", type: "menu" },
                        children: [
                          {
                            name: "positionApiAbility",
                            path: "/positionServe/positionApiAbility",
                            meta: { title: "接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/positionServe/positionApiAbility",
                          },
                          {
                            name: "positionMapAbility",
                            path: "/positionServe/positionMapAbility",
                            meta: { title: "地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/positionServe/positionMapAbility",
                          },
                        ],
                    },
                    {
                        name: "trackQuery",
                        path: "/apiDocument",
                        meta: { title: "轨迹查询", icon: "el-icon-truck", type: "menu" },
                        children: [
                          {
                            name: "trackQueryApiAbility",
                            path: "/trackQuery/trackQueryApiAbility",
                            meta: { title: "接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryApiAbility",
                          },
                          {
                            name: "trackQueryMapAbility",
                            path: "/trackQuery/trackQueryMapAbility",
                            meta: { title: "地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/trackQuery/trackQueryMapAbility",
                          },
                        ]
                    },
                    {
                        name: "timeServe",
                        path: "/apiDocument",
                        meta: { title: "授时服务", icon: "el-icon-time", type: "menu" },
                        children: [
                          {
                            name: "timeServeApiAbility",
                            path: "/timeServe/timeServeApiAbility",
                            meta: { title: "接口功能", icon: "el-icon-link", affix: false, },
                            component: "apiDocument/timeServe/timeServeApiAbility",
                          },
                          {
                            name: "timeServeMapAbility",
                            path: "/timeServe/timeServeMapAbility",
                            meta: { title: "地图功能", icon: "el-icon-map-location", affix: false, },
                            component: "apiDocument/timeServe/timeServeMapAbility",
                          },
                        ]
                    }, 
                  ],
                },
                {
                  name: "manage",
                  path: "/manage",
                  meta: {
                    title: "应用管理",
                    icon: "el-icon-menu",
                    type: "menu",
                  },
                  children: [
                    {
                      name: "device",
                      path: "/manage/device",
                      meta: { title: "设备管理", icon: "el-icon-setting", affix: false },
                      component: "manage/device/index",
                    },
                    {
                      name: "apply",
                      path: "/manage/apply",
                      meta: { title: "我的应用", icon: "el-icon-coordinate", affix: false },
                      component: "manage/apply/index",
                    },
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
                      path: "/system/manager",
                      meta: { title: "管理员", icon: "el-icon-s-custom", affix: false },
                      component: "system/manager/index",
                    },
                    {
                      name: "user",
                      path: "/system/user",
                      meta: { title: "用户管理", icon: "el-icon-menu", affix: false },
                      component: "system/user/index",
                    },
                    {
                      name: "log",
                      path: "/system/log",
                      meta: { title: "操作日志", icon: "el-icon-document", affix: false },
                      component: "system/log/index",
                    },
                    {
                      name: "rules",
                      path: "/system/rules",
                      meta: { title: "系统规则", icon: "el-icon-set-up", affix: false },
                      component: "system/rules/index",
                    },
                    {
                      name: "password",
                      path: "/system/password",
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
								this.visible = false;
								this.$router.go(0);
								// this.$message.success("Login Success 登录成功");
							} else {
								this.$message.error(res.note);
							}
						}
					}else{
						return false;
					}
				})
			},
		}
	}
</script>

<style>
</style>
