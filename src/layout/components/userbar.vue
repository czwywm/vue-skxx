<template>
	<div class="user-bar">
		<div class="screen panel-item hidden-sm-and-down" @click="screen">
			<i class="el-icon-full-screen"></i>
		</div>
		<!-- <div class="msg panel-item" @click="showMsg">
			<el-badge :hidden="msgList.length==0" :value="msgList.length" class="badge" type="danger">
				<i class="el-icon-chat-dot-round"></i>
			</el-badge>
			<el-drawer title="新消息" v-model="msg" :size="400" append-to-body destroy-on-close>
				<el-container>
					<el-main class="nopadding">
						<el-scrollbar>
							<ul class="msg-list">
								<li v-for="item in msgList" v-bind:key="item.id">
									<a :href="item.link" target="_blank">
										<div class="msg-list__icon">
											<el-badge is-dot type="danger">
												<el-avatar :size="40" :src="item.avatar"></el-avatar>
											</el-badge>
										</div>
										<div class="msg-list__main">
											<h2>{{item.title}}</h2>
											<p>{{item.describe}}</p>
										</div>
										<div class="msg-list__time">
											<p>{{item.time}}</p>
										</div>
									</a>
								</li>
								<el-empty v-if="msgList.length==0" description="暂无新消息" :image-size="100"></el-empty>
							</ul>
						</el-scrollbar>
					</el-main>
					<el-footer>
						<el-button type="primary" size="small">消息中心</el-button>
						<el-button size="small" @click="markRead">全部设为已读</el-button>
					</el-footer>
				</el-container>
			</el-drawer>
		</div> -->
		<el-dropdown trigger="click" @command="handleUser" style="height: 100%;">
			<div class="user panel-item">
				<el-avatar :size="35">{{ userNameF }}</el-avatar>
				<!-- <label>{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></label> -->
				<label><i class="el-icon-arrow-down el-icon--right" style="color:#000;"></i></label>
			</div>
			<template #dropdown>
				<el-dropdown-menu style="width: 215px;">
					<el-row>
						<el-avatar :size="35" style="margin: 5px 8px;">{{ userNameF }}</el-avatar>
						<span style="line-height: 45px;">{{userName}}</span>
						<span style="line-height: 45px;margin-left: 10px;color: #0070c0;font-weight:600;" v-if="this.isUser">用户账号</span>
						<span style="line-height: 45px;margin-left: 10px;color: #0070c0;font-weight:600;" v-else>管理员账号</span>
						<div v-show="this.isUser">
							<img v-if="this.isTruth" src="img/verify.png" alt="" style="width: 20px;margin: 12px 4px;">
							<img v-else src="img/notverify.png" alt="" style="width: 20px;margin: 12px 4px;">
						</div>
					</el-row>
					<el-dropdown-item command="uc" v-show="this.isUser">用户中心</el-dropdown-item>
					<el-dropdown-item command="confirm" v-show="this.isUser">安全认证</el-dropdown-item>
					<!-- <el-dropdown-item command="clearCache">清除缓存</el-dropdown-item> -->
					<el-row style="text-align:center;">
						<el-col :span="12">
							<el-dropdown-item divided command="switchUser">切换账号</el-dropdown-item>
						</el-col>
						<el-col :span="12">
							<el-dropdown-item divided command="outLogin">退出登录</el-dropdown-item>
						</el-col>
					</el-row>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog> 
	<el-dialog title="提示" :visible="dialogVisible" width="30%" :before-close="handleClose">
  	<span>请修改个人信息，完成用户认证！</span>
		<template #footer>
			<el-button @click="dialogVisible = false">取 消</el-button>
    	<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import saveDialog from './save.vue'

	export default {
		name: "userbar",
    components: {
      saveDialog
    },
		data(){
			return {
				dialog: {
					save: false
				},
				userName: "",
				userNameF: "",
				isUser: false,
				isTruth: false,
				msg: false,
				dialogVisible: false,
				msgList: [
					{
						id: 1,
						type: 'user',
						avatar: "img/avatar.jpg",
						title: "Skuya",
						describe: "如果喜欢就点个星星支持一下哦",
						link: "https://gitee.com/lolicode/scui",
						time: "5分钟前"
					},
					{
						id: 2,
						type: 'user',
						avatar: "img/avatar2.gif",
						title: "Lolowan",
						describe: "点进去Gitee获取最新开源版本",
						link: "https://gitee.com/lolicode/scui",
						time: "14分钟前"
					},
					{
						id: 3,
						type: 'system',
						avatar: "img/logo.png",
						title: "感谢登录SCUI Admin",
						describe: "Vue 3.0 + Vue-Router 4.0 + ElementPlus + Axios 后台管理系统。",
						link: "https://gitee.com/lolicode/scui",
						time: "2020年7月24日"
					}
				]
			}
		},
		created() {
			var hasProperty = function(obj, key) {
				return key in obj
			}
			var userInfo = this.$TOOL.data.get("USER_INFO");
			// Object.defineProperty(userInfo, 'truth', {
			// 	value: 2,
			// 	enumerable: false
			// })
			var user = hasProperty(userInfo, 'truth')
			console.log(user)
			if(user) {
				this.isUser = true;//用户
				if(userInfo.truth == "0") {
					this.isTruth = true;//已认证
				}else if(userInfo.truth == "1" || userInfo.truth == null){
					this.isTruth = false;//未认证
				}
			}else {
				this.isUser = false;//管理员
			}
			this.userName = userInfo.userName;
			this.userNameF = this.userName?.substring(0,1);
		},
		methods: {
			//个人信息
			handleUser(command) {
				if(command == "uc"){
					this.$router.push({path: '/usercenter/personalInfo'});
				}
				if(command == "confirm"){
					if(this.isTruth) {
						this.$alert("您已完成认证", "提示", {type: 'success'})
					}else {
						this.$confirm('编辑信息后可完成用户认证！是否跳转基本信息页？','提示', {
							type: 'warning',
							confirmButtonText: '确定',
							confirmButtonClass: 'el-button--danger'
						}).then(() => {
							this.$router.push({path: '/usercenter/personalInfo'});
						}).catch(() => {
							//取消退出
						})
					}
				}
				if(command == "switchUser"){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open(this.isUser)
				})
				}
				if(command == "clearCache"){
					this.$confirm('清除缓存会将系统初始化，包括登录状态、主题、语言设置等，是否继续？','提示', {
						type: 'info',
					}).then(() => {
						const loading = this.$loading()
						this.$TOOL.data.clear()
						this.$router.replace({path: '/login'})
						setTimeout(()=>{
							loading.close()
							location.reload()
						},1000)
					}).catch(() => {
						//取消
					})
				}
				if(command == "outLogin"){
					this.$confirm('确认是否退出当前用户？','提示', {
						type: 'warning',
						confirmButtonText: '退出',
						confirmButtonClass: 'el-button--danger'
					}).then(() => {
						this.$router.replace({path: '/login'});
					}).catch(() => {
						//取消退出
					})
				}
			},
			handleSuccess(){
				this.dialog.save = false
			},
			//全屏
			screen(){
				var element = document.documentElement;
				this.$TOOL.screen(element)
			},
			//显示短消息
			showMsg(){
				this.msg = true
			},
			//标记已读
			markRead(){
				this.msgList = []
			}
		}
	}
</script>

<style scoped>
	.user-bar {display: flex;align-items: center;height: 100%;}
	.user-bar .panel-item {padding: 0 10px;cursor: pointer;height: 100%;display: flex;align-items: center;}
	.user-bar .panel-item i {font-size: 16px;}
	.user-bar .panel-item:hover {background: rgba(0, 0, 0, 0.1);}
	.user-bar .user {display: flex;align-items: center;}
	.user-bar .user label {display: inline-block;margin-left:5px;font-size: 12px;cursor:pointer;}

	.msg-list li {border-top:1px solid #eee;}
	.msg-list li a {display: flex;padding:20px;}
	.msg-list li a:hover {background: #ecf5ff;}
	.msg-list__icon {width: 40px;margin-right: 15px;}
	.msg-list__main {flex: 1;}
	.msg-list__main h2 {font-size: 15px;font-weight: normal;color: #333;}
	.msg-list__main p {font-size: 12px;color: #999;line-height: 1.8;margin-top: 5px;}
	.msg-list__time {width: 100px;text-align: right;color: #999;}
	
	.el-avatar {background: #000;}
	[data-theme='dark'] .msg-list__main h2 {color: #d0d0d0;}
	[data-theme='dark'] .msg-list li {border-top:1px solid #363636;}
	[data-theme='dark'] .msg-list li a:hover {background: #383838;}

	.el-dropdown-menu--small .el-dropdown-menu__item {
    border-right: 1px solid #ebeef5;
	}
</style>
