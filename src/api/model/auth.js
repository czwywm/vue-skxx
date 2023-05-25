import config from "@/config"
import http from "@/utils/request"

export default {
	managerLogin: {
		url: `${config.API_URL}/api/login/adminlogin`,
		name: "管理员登录",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	userLogin:{
		url: `${config.API_URL}/api/login/login`,
		name: "用户登录",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	useRegister: {
		url: `${config.API_URL}/api/login/register`,
		name: "用户注册",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	}
}
