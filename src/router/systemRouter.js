import config from "@/config"

//系统路由
const routes = [
	{
		name: "layout",
		path: "/",
		component: () => import(/* webpackChunkName: "layout" */ '@/layout'),
		redirect: config.DASHBOARD_URL || '/dashboard',
		children: []
	},
	{
		path: "/login",
		component: () => import(/* webpackChunkName: "login" */ '@/views/userCenter/login/index'),
		meta: {
			title: "登录"
		}
	},
	{
		path: "/positionmap",
		component: () => import(/* webpackChunkName: "positionmap" */ '@/views/positionmap/index'),
		meta: {
			title: "定位服务"
		}
	},
	{
		path: "/trackmap",
		component: () => import(/* webpackChunkName: "trackmap" */ '@/views/trackmap/index'),
		meta: {
			title: "轨迹查询"
		}
	}
]

export default routes;
