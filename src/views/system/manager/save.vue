<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<template v-if="mode=='edit'">
				<el-form-item label="管理员编号" prop="uid">
					<el-input v-model="form.uid" :disabled="true"></el-input>
				</el-form-item>
			</template>
      <el-form-item label="登录名" prop="loginName">
				<el-input v-model="form.loginName" placeholder="请输入登录名" clearable></el-input>
			</el-form-item>
			<el-form-item label="登录密码" prop="passWord" v-show="this.mode != 'show'">
				<el-input type="password" v-model="form.passWord" placeholder="请输入登录密码" clearable show-password></el-input>
			</el-form-item>
			<el-form-item label="目录权限" prop="menuValue">
				<el-cascader
					v-model="form.menuValue"
					placeholder="请选择目录权限"
					:options="menuList"
					:props="{ multiple: true }"
					clearable>
				</el-cascader>
			</el-form-item>
      <el-form-item label="操作权限" prop="roleList">
				<el-select v-model="form.roleList" multiple placeholder="请选择操作权限">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="form.status" clearable placeholder="请选择状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="管理名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="请输入管理名" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增管理员',
					edit: '编辑管理员',
					show: '查看'
				},
				visible: false,
				isSaveing: false,
        //目录权限
        menuList: [],
        //操作权限
        roleList: [],
				options: [{label:"正常",value:"0"},{label:"禁止",value:"1"}],
				//表单数据
				form: {
					uid: "",
					loginName:"",
					passWord: "",
					menuValue: [],
					roleList: [],
					status: "",
          adminName: ""
				},
				//验证规则
				rules: {
					loginName: [
						{required: true, message: '请输入登录名'}
					],
					menuValue: [
						{required: true, message: '请选择目录权限'}
					],
          roleList: [
						{required: true, message: '请选择操作权限'}
					],
          status: [
						{required: true, message: '请选择状态'}
					],
          adminName: [
						{required: true, message: '请输入管理名'}
					],
				},
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "uid",
					multiple: true,
					checkStrictly: true
				},
				filterMenu: []
			}
		},
		mounted() {
			this.getMenuList()
		},
		created() {
			this.roleList = [{label:"查询",value:"QUERY"},{label:"添加",value:"ADD"},{label:"修改",value:"EDIT"},{label:"删除",value:"DELETE"},{label:"设置",value:"SET"},{label:"导入",value:"INPORT"},{label:"导出",value:"EXPORT"}]
    },
		methods: {
			//获取当前用户/管理员的完整目录列表
			getMenuList() {
				let menu = this.$TOOL.data.get("MENU");
				let list = [];
				menu && menu.forEach(function(aval, aindex) {
						list[aindex] = {
							label: aval.meta.title,
							value: aval.meta.title
						}
						if(aval.children) {
							list[aindex] = {};
							list[aindex] = {
								label: aval.meta.title,
								value: aval.meta.title,
								children: []
							}
							var b = list[aindex].children;
							aval.children.forEach(function(bval, bindex) {
								b.push({
									label: bval.meta.title,
									value: bval.meta.title
								})
								if(bval.children) {
									b[bindex].children = [];
									bval.children.forEach(function(cval) {
										b[bindex].children.push({
											label: cval.meta.title,
											value: cval.meta.title
										})
									})
								}
							})
						}
					})
					this.menuList = list;
					console.log(this.menuList)
			},
			//添加管理员做目录权限设置时，根据选中层级截取目录列表
			setMenuList(arr) {
				let menu = this.$TOOL.data.get("MENU");
				var filterObj = function(item){
					if(item.children) {
						item.children = item.children.filter(function(child) {
							if(child.children) {
								child.children = child.children.filter(function(cc) {
									if(arr.indexOf(cc.meta.title)>-1) {
										return true
									}
								})
							}else {
								if(arr.indexOf(child.meta.title)>-1) {
									return true
								}
							}
							if(child.children && child.children.length>0) {
								return true
							}
						})
						if(item.children && item.children.length>0) {
							return true;
						}
					}else {
						return true
					}
				}
				var filter = menu.filter(function(item){
					return filterObj(item);
				});
				this.filterMenu = filter;
			},
			//将选中目录的数据格式整理为数组
			selectMenu() {
				var c = JSON.parse(JSON.stringify(this.form.menuValue));
				var len = c.length;
				var choose = [];
				for(var i=0;i<len;i++) {
					for(var j=0;j<4;j++) {
						if(c[i][j] == null) {
							choose.push(c[i][j-1])
						}
					}
				}
				choose = choose.filter(res => { return res != undefined })
				console.log(choose)
				this.setMenuList(choose)
			},
			//点击编辑时，筛选目录列表，默认选中对应的目录权限
			cascader(o, options) {
				let toString = Object.prototype.toString,
					k = Object.keys(o),
					len = options.length,
					res = [];
				let current, v, child, num;
				for (let i = 0; i < len; ) {
					current = options[i++];
					v = current.value;
					child = current.children;
					num = k.indexOf(v);
					if (num > -1) {
						res.push(k.splice(num, 1));
						if (k.length === 0) {
							break;
						}
					}
					if (toString.call(child) === "[object Array]" && child.length > 0) {
						cartwheel([v], child);
					}
				}
				function cartwheel(row, c) {
					let len = c.length;
					let current, v, child, num;
					for (let i = 0; i < len; ) {
						current = c[i++];
						v = current.value;
						child = current.children;
						num = k.indexOf(v);
						if (num > -1) {
							res.push([...row, ...k.splice(num, 1)]);
							if (k.length === 0) {
								return;
							}
						}
						if (toString.call(child) === "[object Array]" && child.length > 0) {
							cartwheel([...row, v], child);
						}
					}
					return;
				}
				return res;
			},
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						this.selectMenu()
						if(this.mode == "add") {
						//增加管理员
							let data = {
								token: this.$TOOL.data.get("TOKEN"),
								...this.form,
								passWord: this.$TOOL.crypto.MD5(this.form.passWord),
								menuValue: this.filterMenu
							};
							var res1 = await this.$API.system.manager.addAdmin.post(data);
							this.isSaveing = false;
							if(res1.resultCode == "0000"){
								// this.$parent.$refs.table.refresh()
								this.$emit('success', this.form, this.mode)
								this.visible = false;
								this.$message.success("操作成功")
							}else{
								this.$alert(res1.note, "提示", {type: 'error'})
							}
						}else if(this.mode == "edit") {
						//修改管理员
							let data = {
								token: this.$TOOL.data.get("TOKEN"),
								...this.form,
								passWord: this.form.passWord? this.$TOOL.crypto.MD5(this.form.passWord):"",
								menuValue: this.filterMenu
							};
							var res = await this.$API.system.manager.setAdmin.post(data);
							this.isSaveing = false;
							if(res.resultCode == "0000"){
								// this.$parent.$refs.table.refresh()
								this.$emit('success', this.form, this.mode)
								this.visible = false;
								this.$message.success("操作成功")
							}else{
								this.$alert(res.note, "提示", {type: 'error'})
							}
						}
						
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				console.log(data)
				if(this.mode == "edit" || this.mode == "show") {
					//查看和编辑时获取目录权限
					let menu = JSON.parse(data.menuList)
					var obj = new Object();
					menu && menu.forEach(function(aval) {
						let titlea = aval.meta.title;
						obj[titlea] = titlea;
						if(aval.children) {
							aval.children.forEach(function(bval) {
								let titleb = bval.meta.title;
								obj[titleb] = titleb;
								if(bval.children) {
									bval.children.forEach(function(cval) {
										let titlec = cval.meta.title;
										obj[titlec] = titlec;
									})
								}
							})
						}
					})
					console.log(obj)
					let res = this.cascader(obj, this.menuList);
					console.log(res)
					this.form.menuValue = res
					//查看和编辑时获取角色权限
					let role = JSON.parse(data.roleList)
					for(let i in role) {
						if(role[i].value) {
							this.form.roleList.push(role[i].value)
						}else {
							this.form.roleList.push(role[i])
						}
						
					}
				}
        this.form.uid = data.uid
				this.form.loginName = data.loginName
				this.form.status = data.status
				this.form.adminName = data.adminName

				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style scoped>
.el-select--small {
  width: 100%;
}
::v-deep .el-cascader {
	width: 100%;
}
</style>
