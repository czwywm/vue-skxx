<template>
	<el-card shadow="hover" header="">
		<div class="welcome">
			<div class="logo">
				<img src="img/logo.png">
				<h2>欢迎体验</h2>
			</div>
			<div class="tips">
				<div class="tips-item">
					<div class="tips-item-icon"><i class="el-icon-menu"></i></div>
					<div class="tips-item-message">基于地图的设备位置点位图，根据历史位置坐标提供历史轨迹图、路径规划图</div>
				</div>
				<div class="tips-item">
					<div class="tips-item-icon"><i class="el-icon-s-promotion"></i></div>
					<div class="tips-item-message">结合孪生可视化模型，运用差分定位、北斗、GIS技术实现对城市基础设施的米级、亚米级精准定位</div>
				</div>
				<div class="tips-item">
					<div class="tips-item-icon"><i class="el-icon-milk-tea"></i></div>
					<div class="tips-item-message">基于北斗和GPS卫星技术，提供标准化接口为外接设备提供精准授时服务</div>
				</div>
			</div>
			<div class="actions">
				<!-- <el-button type="primary" icon="el-icon-check" size="medium" @click="godoc">文档</el-button> -->
			</div>
		</div>
	</el-card>
</template>

<script>
	export default {
		title: "欢迎",
		icon: "el-icon-present",
		description: "项目特色以及文档链接",
		data() {
			return {

			}
		},
		methods: {
			godoc(){
				window.open("https://lolicode.gitee.io/scui-doc/")
			}
		}
	}
</script>

<style scoped>
	.welcome {}
	.welcome .logo {text-align: center;}
	.welcome .logo img {vertical-align: bottom;width: 100px;height: 100px;margin-bottom: 20px;}
	.welcome .logo h2 {font-size: 30px;font-weight: normal;display: flex;align-items: center;justify-content: center;}

	.tips {margin-top: 20px;padding:0 40px;}
	.tips-item {display: flex;align-items: center;justify-content: center;padding:7.5px 0;}
	.tips-item-icon {width: 40px;height:40px;display: flex;align-items: center;justify-content: center;border-radius: 50%;font-size: 18px;margin-right: 20px;color: var(--el-color-primary);background: rgba(180,180,180,0.1);}
	.tips-item-message {flex: 1;font-size: 14px;}

	.actions {text-align: center;margin: 40px 0 20px 0;}
</style>
