import config from "@/config"
import http from "@/utils/request"

export default {
	getinfo: {
		url: `${config.API_URL}/api/user/getOneUser`,
		name: "获取基本信息",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	editinfo: {
		url: `${config.API_URL}/api/user/setOneUser`,
		name: "修改基本信息",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
}