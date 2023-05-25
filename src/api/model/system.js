import config from "@/config"
import http from "@/utils/request"

export default {
	menu: {
		myMenus: {
			url: `${config.API_URL}/system/menu/my/1.3.0`,
			name: "获取我的菜单",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/menu/list`,
			name: "获取菜单",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	dic: {
		tree: {
			url: `${config.API_URL}/system/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dic/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL}/system/role/list`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	app: {
		list: {
			url: `${config.API_URL}/system/app/list`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	manager: {
		getAdmin: {
			url: `${config.API_URL}/api/admin/getAdmin`,
			name: "获取管理员",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		addAdmin: {
			url: `${config.API_URL}/api/admin/addAdmin`,
			name: "添加管理员",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		setAdmin: {
			url: `${config.API_URL}/api/admin/setAdmin`,
			name: "修改管理员",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delAdmin: {
			url: `${config.API_URL}/api/admin/delAdmin`,
			name: "删除管理员",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		updateAdmin: {
			url: `${config.API_URL}/api/admin/updateAdmin`,
			name: "修改管理员密码",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	user: {
		getUser: {
			url: `${config.API_URL}/api/user/getUser`,
			name: "获取用户列表",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		setUser: {
			url: `${config.API_URL}/api/user/setUser`,
			name: "修改用户密码",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delUser: {
			url: `${config.API_URL}/api/user/delUser`,
			name: "删除用户",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	rules: {
		getRule: {
			url: `${config.API_URL}/api/sys/getRule`,
			name: "获取系统规则",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		setRule: {
			url: `${config.API_URL}/api/sys/setRule`,
			name: "设置系统规则",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	log: {
		getOperate: {
			url: `${config.API_URL}/api/admin/getOperate`,
			name: "获取操作日志",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	device: {
		getDevice: {
			url: `${config.API_URL}/api/device/getdevice`,
			name: "管理员获取设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		addDevice: {
			url: `${config.API_URL}/api/device/adddevice`,
			name: "管理员添加设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		setDevice: {
			url: `${config.API_URL}/api/device/setdevice`,
			name: "管理员修改设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delDevice: {
			url: `${config.API_URL}/api/device/deldevice`,
			name: "管理员删除设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		bindDevice: {
			url: `${config.API_URL}/api/user/adddevice`,
			name: "管理员设备绑定用户",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		unbindDevice: {
			url: `${config.API_URL}/api/user/deldevice`,
			name: "管理员设备解绑用户",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		getPosition: {
			url: `${config.API_URL}/api/device/getlocation`,
			name: "管理员获取设备位置",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		getTrack: {
			url: `${config.API_URL}/api/device/getlocationdata`,
			name: "管理员获取设备轨迹",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	apply: {
		getApply: {
			url: `${config.API_URL}/api/user/getuserapply`,
			name: "获取应用",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	userdevice: {
		getUserDevice: {
			url: `${config.API_URL}/api/device/getuserdevice`,
			name: "用户获取设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		addUserDevice: {
			url: `${config.API_URL}/api/device/adduserdevice`,
			name: "用户添加设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		setUserDevice: {
			url: `${config.API_URL}/api/device/setuserdevice`,
			name: "用户修改设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delUserDevice: {
			url: `${config.API_URL}/api/device/deluserdevice`,
			name: "用户删除设备",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		getUserPosition: {
			url: `${config.API_URL}/api/device/getdata`,
			name: "用户获取设备位置",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		getUserTrack: {
			url: `${config.API_URL}/api/device/getuserlocationdata`,
			name: "用户获取设备轨迹",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	userapply: {
		getUserApply: {
			url: `${config.API_URL}/api/user/getapply`,
			name: "用户获取应用",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		addUserApply: {
			url: `${config.API_URL}/api/user/addapply`,
			name: "用户添加应用",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		setUserApply: {
			url: `${config.API_URL}/api/user/setapply`,
			name: "用户修改应用",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delUserApply: {
			url: `${config.API_URL}/api/user/delapply`,
			name: "用户删除应用",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	timeServe: {
		getData: {
			url: `${config.API_URL}/api/device/getdevicedata`,
			name: "获取授时设备参数(管理员和用户都可调用)",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		getTime: {
			url: `${config.API_URL}/api/device/gettime`,
			name: "获取授时设备时间(管理员和用户都可调用)",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	}
}
