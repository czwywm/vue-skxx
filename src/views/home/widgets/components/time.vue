<template>
	<el-card shadow="hover" header="" class="item-background">
		<div class="time">
			<p>{{ day }}</p>
			<p>{{ time }}</p>
		</div>
	</el-card>
</template>

<script>
	export default {
		title: "时钟",
		icon: "el-icon-time",
		description: "演示部件效果",
		data() {
			return {
				time: '',
				day: ''
			}
		},
		mounted() {
			this.showTime()
			setInterval(()=>{
				this.showTime()
			},1000)
		},
		methods: {
			showTime(){
				this.time = this.$TOOL.dateFormat(new Date(), 'hh:mm:ss')
				this.day = this.$TOOL.dateFormat(new Date(), 'yyyy年MM月dd日')
			}
		}
	}
</script>

<style scoped>
	.item-background {background: linear-gradient(to bottom right, #d7e3bf, #90ccdb,#58b2c9,#85c6d9);color: #fff;}
	.time p:first-child {font-size: 14px;margin-top: 13px;opacity: 0.7;}
	.time p {font-size: 40px;}
</style>
