<template>
    <el-main>
        <el-card :style="{width: fullwidth + 'px'}" shadow="never">
            <div class="clearfix">
                <i class="el-icon-document-copy"></i>
                <text style="font-weight:600;font-size: 14px;margin-left: 5px;">基本信息</text>
            </div>
            <div class="text item">
                <el-row class="demo-avatar demo-basic">
                    <el-col :span="2">
                    <div class="demo-basic--circle">
                        <div class="block">
                            <el-avatar shape="square" :size="50" :src="squareUrl" prop="avatar"></el-avatar>
                        </div>
                    </div>
                    </el-col> 
                    <el-col :span="11">
                      <el-descriptions title="基本信息" column="1">
                        <el-descriptions-item label="用户名:" prop="userName">{{baseinfo.userName}}</el-descriptions-item>
                        <el-descriptions-item label="用户名ID:" prop="uid">{{baseinfo.uid}}</el-descriptions-item>
                        <el-descriptions-item label="电话号码:" prop="mobile">{{baseinfo.mobile}}</el-descriptions-item>
                        <el-descriptions-item label="邮箱:" prop="mail">{{baseinfo.mail}}</el-descriptions-item>
                        <el-descriptions-item label="登录密码:">已设置</el-descriptions-item>
                      </el-descriptions>
                    </el-col>
                    <el-col :span="11">
                      <el-descriptions title="开发者信息" column="1">
                        <template #extra>
                          <el-button class="search-button" type="primary" size="small" @click="baseInfo_edit()">编辑</el-button>
                        </template>
                        <el-descriptions-item label="开发者类型:" prop="type" v-if="this.baseinfo.type == '0'">个人开发者</el-descriptions-item>
                        <el-descriptions-item label="开发者类型:" prop="type" v-if="this.baseinfo.type == '1'">企业开发者</el-descriptions-item>
                        <el-descriptions-item label="真实姓名:">{{baseinfo.realName}}</el-descriptions-item>
                        <el-descriptions-item label="单位:" prop="company">{{baseinfo.company}}</el-descriptions-item>
                        <el-descriptions-item label="地区:" prop="address">{{baseinfo.address}}</el-descriptions-item>
                      </el-descriptions>
                      <!-- <div style="position: relative;top: 10px;right: -350px;">
                        <el-button size="mini" @click="baseInfo_edit()">编辑</el-button>
                      </div> -->
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card :style="{width: fullwidth + 'px'}" shadow="never" class="box-card">
            <div class="clearfix">
                <i class="el-icon-circle-check"></i>
                <text style="font-weight:600;font-size: 14px;margin-left: 5px;">实名认证</text>
            </div>
            <div class="text item" style="margin-top:5px">
                <div v-show="isActive"><text style="margin-left: 16px;color: rgb(0, 153, 255);font-size: 10px">您尚未进行任何实名认证</text><i style="font-size: 10px;color: #b9b9b9;margin-left: 15px;">温馨提示：请谨慎选择认证类型，企业使用的账号请勿做个人认证，以避免人员变动、交接账户时可能产生不便。</i></div>
                <el-row style="margin-top: 25px;">
                    <el-col :span="12" style="border-right: 1px solid rgb(244, 244, 244);padding-left: 0px;">
                        <el-row class="demo-avatar demo-basic" style="margin-top: 20px;">
                            <el-col :span="2">
                                <div class="demo-basic--circle">
                                    <div class="block">
                                        <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="20" :offset="2" style="font-size: 10px;">
                                <text style="font-size: 16px;font-weight: 700;">企业实名认证</text>
                                <el-row style="margin-top:8px;height: 30px;">
                                    <text style="color: rgb(136, 137, 139);">适用群体：企业、政党及国家机关、事业单位、民办非企业单位、社会团体、个体工商户等。</text>
                                </el-row>
                                <el-row style="margin-top:30px;">
                                    <text style="font-weight: 600;">完成认证，您将获得：</text>
                                </el-row>
                                <el-row style="margin-top:10px;">
                                     <ul style="color: rgb(136, 137, 139);" class="c-ul-color">
                                        <li>使用免费SDK，每年可激活5000台终端</li>
                                        <li>获得增值版SDK各3个测试码，有效期3个月</li>
                                        <li>免费下载使用门禁应用套件</li>
                                        <li>优质的工单服务，技术工程师一对一服务</li>
                                    </ul>
                                </el-row>
                            </el-col>
                            
                        </el-row>
                    </el-col> 
                    <el-col :span="12" style="padding-left: 20px;">
                        <el-row class="demo-avatar demo-basic" style="margin-top: 20px;">
                            <el-col :span="2">
                                <div class="demo-basic--circle">
                                    <div class="block">
                                        <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="20" :offset="2" style="font-size: 10px;">
                                <text style="font-size: 16px;font-weight: 700;">个人实名认证</text>
                                <el-row style="margin-top:8px;height: 30px;">
                                    <text style="color: rgb(136, 137, 139);">适用于个人开发爱好者。</text>
                                </el-row>
                                <el-row style="margin-top:30px;">
                                    <text style="font-weight: 600;">完成认证，您将获得：</text>
                                </el-row>
                                <el-row style="margin-top:10px;">
                                     <ul style="color: rgb(136, 137, 139);" class="p-ul-color">
                                        <li>使用免费SDK，每年可激活100台终端</li>
                                        <li>优质的工单服务</li>
                                    </ul>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </el-main>
    
  <save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>
</template>

<script>
  import saveDialog from './save.vue'
    
  export default {
    name: "personal-info",
    components: {
      saveDialog
    },
    data() {
      return {
        dialog: {
					save: false
				},
        baseinfo: {
          userName: "",
          uid: "",
          mobile: "",
          mail: "",
          type: "",
          realName: "",
          company: "",
          address: "",
        },
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        isActive: true
      }
    },
    created() {
      var userInfo = this.$TOOL.data.get("USER_INFO");
			if(userInfo.truth == "0") {
				this.isActive = false;//已认证
			}
    },
    mounted() {
			this.getGroup();
		},
    methods: {
      //加载数据
			async getGroup(){
        var data = {
          token:this.$TOOL.data.get("TOKEN")
        };
				var res = await this.$API.info.getinfo.post(data);
        if (res.resultCode == "0000") {
          this.baseinfo= res.data;
        } else {
          this.$message.error(res.note);
        }
			},
      baseInfo_edit(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(this.baseinfo)
				})
			},
      //本地更新数据
			handleSuccess(data, mode){
				if(mode=='edit'){
          this.baseinfo.mail = data.mail;
          this.baseinfo.realName = data.realName;
          this.baseinfo.mobile = data.mobile;
          this.baseinfo.type = data.type;
          this.baseinfo.company = data.company;
          this.baseinfo.address = data.address;
          // this.$router.go(0)
				}
			}
    }
  }
</script>

<style scoped>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul li {
    height: 25px;
  }
  ul li::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius:50%; 
    background:#000; 
    display:inline-block; 
    margin-right:10px; 
    vertical-align:middle; 
    margin-top:-3px;
  }
  .el-descriptions__title {
    font-size: 9px;
  }
  .c-ul-color>li::before {
    background: rgb(53, 202, 53); 
  }
  .p-ul-color>li::before {
    background: rgb(249, 48, 48);
  }
  .el-icon-edit {
    margin-left:8px;
    color: #b9b9b9;
    cursor: pointer;
  }
  .el-button--mini {
    min-height: 26px;
    padding: 5px 12px;
    font-size: 11px;
  }
  /* 基本信息table样式 */
  ::v-deep .el-table th.el-table__cell>.cell {
    color: #000;
    font-size: 16px;
    margin-bottom: 10px;
  }
  ::v-deep .el-table tr {
    height: 25px;
  }
  ::v-deep .el-table--small .el-table__cell {
    padding: 0px;
    font-size: 11px;
    color: rgb(136, 137, 139);
  }
  ::v-deep .el-table th.is-leaf{ /* 去掉最上面的那一条线 */
    border: none;
  }
  ::v-deep .el-table::before { /* 去掉最下面的那一条线 */
	  height: 0px;
  }
  ::v-deep .el-table__row>td{ /* 去掉中间数据的分割线 */
    border: none;
  }

  ::v-deep .el-descriptions__label {
    color: rgb(136, 137, 139);
    font-size: 11px;
  }
  ::v-deep .el-descriptions__content {
    color: #000;
    font-size: 11px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-top: 15px;
  }

  .clearfix:before,.clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    /* width: 480px; */
    margin-top: 10px;
  }
  .search-button {
    border-radius: 10px;
  }
  /* .c-ul-color>li::marker {
    color: rgb(53, 202, 53);
    font-size: 18px;
    vertical-align: middle;
  }
  .c-ul-color>li {
    height: 25px;
    line-height: 25px;
  }
  .p-ul-color>li::marker {
    color: rgb(249, 48, 48);
    font-size: 18px;
  }
  .p-ul-color>li {
    height: 25px;
    line-height: 25px;
  } */
</style>