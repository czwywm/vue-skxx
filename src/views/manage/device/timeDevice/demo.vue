<template>
  <div>
    <div class="out-style">
      <div class="out-header-style">
        <span>查询条件</span>
      </div>
      <div class="out-body-style">
        <el-form :inline="true" :model="formInline" label-width="70px" label-position="left">
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备类型">
                <el-input v-model="formInline.type" placeholder="请输入类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备号">
                <el-input v-model="formInline.number" placeholder="请输入设备号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input v-model="formInline.name" placeholder="请输入名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备地址">
                <el-input v-model="formInline.address" placeholder="请输入地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" class="search-button" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="button-div">
      <el-button type="primary" class="search-button" icon="el-icon-plus" @click="add">添加设备</el-button>
      <el-button type="primary" class="search-button" icon="el-icon-edit" @click="edit" :disabled="disabled">修改</el-button>
      <el-button type="primary" class="search-button" icon="el-icon-delete" @click="del" :disabled="disabled">删除</el-button>
      <el-button type="primary" class="search-button" icon="el-icon-warning-outline">设备详情</el-button>
    </div>
    <div class="out-style" style="height: calc(100vh - 558px)">
      <div class="out-header-style">
        <span>查询结果</span>
      </div>
      <div>
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          height="calc(100vh - 458px)"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            prop="id"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="number"
            label="设备号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="设备名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="status"
            label="工作状态"
            width="120">
            <template #default="scope">
              <el-tag
                v-if="scope.row.status === '0'"
                type="success"
                disable-transitions>在线</el-tag>
              <el-tag
                v-else
                type="info"
                disable-transitions>离线</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="设备类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="设备地址"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="time"
            label="最后在线时间"
            width="120">
          </el-table-column>
        </el-table>
        <div class="pagination-style">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="7">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <save-dialog
    v-if="dialog.save"
    ref="saveDialog"
    @success="handleSuccess"
    @closed="dialog.save = false"
  ></save-dialog>
</template>
<script>
  import saveDialog from "./save";

  export default {
    name: "device",
    components: {
      saveDialog,
    },
    data() {
      return {
        disabled: true,
        dialog: {
          save: false,
        },
        formInline: {
          type: '',
          number: '',
          name: '',
          address: ''
        },
        tableData: [{
          id: '1',
          number: '001',
          name: '某某设备',
          status: '1',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }, {
          id: '2',
          number: '001',
          name: '某某设备',
          status: '0',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }, {
          id: '3',
          number: '001',
          name: '某某设备',
          status: '0',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }, {
          id: '4',
          number: '001',
          name: '某某设备',
          status: '1',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }, {
          id: '5',
          number: '001',
          name: '某某设备',
          status: '0',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }, {
          id: '6',
          number: '001',
          name: '某某设备',
          status: '1',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }, {
          id: '7',
          number: '001',
          name: '某某设备',
          status: '0',
          type: '类型一',
          address: '上海市普陀区金沙江路 1518 弄',
          time: '2022-09-27'
        }],
        multipleSelection: []
      }
    },
    methods: {
      //添加
      add() {
        this.dialog.save = true;
        this.$nextTick(() => {
          this.$refs.saveDialog.open();
        });
      },
      //编辑
      edit(){
        if((this.multipleSelection[0]??'') !== '' ) {
          this.dialog.save = true
          this.$nextTick(() => {
            this.$refs.saveDialog.open('edit').setData(this.multipleSelection[0])
          })
        }
				
			},
      //删除
      del() {

      },
      //本地更新数据
			handleSuccess(data, mode){
				if(mode=='edit'){
					console.log(data);
          this.formInline= data[0];
				}
			},
      //监听表格项的选择
      handleSelectionChange(val) {
        console.log(val[0])
        if((val[0]??'') !== '') {
          this.disabled = false;
        }else {
          this.disabled = true;
        }
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    }
  }
</script>
<style scoped>
.out-style {
  margin: 6px 1%;
  width: 98%;
  height: 150px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  background: #fff;
}
.out-header-style {
  height: 40px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #0070c0;
  text-align: center;
}
.out-header-style span {
  color: #fff;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
}
.out-body-style {
  padding:15px 20px;
}
.search-button {
  /* background-color: #0070c0;
  border-color: #0070c0; */
  border-radius: 10px;
}
.button-div {
  display: flex;
  margin: auto 1%;
  width: 98%;
  height: 40px;
  line-height: 40px;
  padding: 5px 0px;
}
.pagination-style {
  position: absolute;
  height: 50px;
  width: 100%;
  bottom: 0px;
  left: 50%;
}
::v-deep .el-form-item--small .el-form-item__label {
  color:#000;
}
::v-deep .el-table th.el-table__cell>.cell {
  font-size: 13px;
  color: #000;
  text-align: center;
}
::v-deep .el-table .cell {
  text-align: center;
}
::v-deep .el-table tr {
  background-color: #fff;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #0070c0;
}
</style>