<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>模型管理</el-breadcrumb-item>
      <el-breadcrumb-item>罐箱模型</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            罐箱模型
          </h1>
          <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
          >
            Button
          </el-button>
        </div>
      </div>
      <!--      主体表格-->
      <div>
        <el-dialog
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          title="新增模型"
          :visible.sync="dialogVisible"
          width="60%"
        >
          <div
            slot="title"
            style="font-weight: bold;font-size: 20px;color: #2F74EB"
          >
            <i
              class="el-icon-document-copy"
              style="margin: 3px"
            />
            <span>新增模型</span>
          </div>
          <div>
            <el-form
              label-position="right"
              inline
              v-model="newTankModelForm"
              label-width="100px"
              style="height: 50px"
            >
              <el-form-item label="模型名称">
                <el-input
                  :maxlength="8"
                  size="small"
                  v-model="newTankModelForm.name"
                />
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  size="small"
                  v-model="newTankModelForm.remark"
                />
              </el-form-item>
            </el-form>
          </div>
          <div>
            <table class="tankModelTable">
              <tr>
                <th colspan="3">
                  集装箱尺寸 mm
                </th>
                <th colspan="3">
                  重量参数 kg
                </th>
                <th>材质信息</th>
              </tr>
              <tr>
                <td class="tableBackground">
                  长
                </td>
                <td class="tableBackground">
                  宽
                </td>
                <td class="tableBackground">
                  高
                </td>
                <td class="tableBackground">
                  最大许可总重
                </td>
                <td class="tableBackground">
                  自重
                </td>
                <td class="tableBackground">
                  载重
                </td>
                <td class="tableBackground">
                  罐体材料
                </td>
              </tr>
              <tr>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.length"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.width"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.height"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.MPGM"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.tareMass"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.payLoad"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.tankMaterial"
                  />
                </td>
              </tr>
            </table>
            <table class="tankModelTable">
              <tr>
                <th colspan="2">
                  筒体尺寸 mm
                </th>
                <th colspan="4">
                  压力参数 Bar
                </th>
                <th>保温</th>
              </tr>
              <tr>
                <td class="tableBackground">
                  内直径
                </td>
                <td
                  class="tableBackground"
                  style="width: 12%"
                >
                  长
                </td>
                <td
                  style="width: 10%"
                  class="tableBackground"
                >
                  -
                </td>
                <td class="tableBackground">
                  最大许可压力
                </td>
                <td class="tableBackground">
                  试验压力
                </td>
                <td class="tableBackground">
                  最大外部压力
                </td>
                <td class="tableBackground">
                  保温厚度 mm
                </td>
              </tr>
              <tr>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.internalDIA"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.internalLength"
                  />
                </td>
                <td>罐体</td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.tankMAWP"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.tankTestPressure"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.externalDesignPressure"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.insulationThickness"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="2">
                  温度参数 °C
                </th>
                <td>加热管</td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.heatingCoilsMAWP"
                  />
                </td>
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.heatingCoilsTestPressure"
                  />
                </td>
                <td class="tableContent">
                  N/A
                </td>
                <td>保温材料</td>
              </tr>
              <tr>
                <td>筒体设计温度</td>
                <td
                  class="tableContent"
                >
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.vesselDesignTemperature"
                  />
                </td>
                <td>容积</td>
                <td
                  class="tableContent"
                >
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.capacity"
                  />
                </td>
                <td colspan="2" />
                <td class="tableContent">
                  <el-input
                    class="inputStyle"
                    v-model="newTankModelForm.insulation"
                  />
                </td>
              </tr>
            </table>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="small"
              @click="createCancel"
            >取 消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="createTankModel"
            >确 定</el-button>
          </span>
        </el-dialog>
        <vxe-grid
          row-id="name"
          :header-cell-style="headerCellStyle"
          ref="xGrid"
          :height="tableHeight+'px'"
          v-bind="gridOptions"
          highlight-hover-row
          highlight-hover-column
          size="mini"
        >
          <!--          自定义插槽-->
          <template v-slot:content="{row}">
            <div>
              <table class="tankModelTable">
                <tr>
                  <th colspan="3">
                    集装箱尺寸 mm
                  </th>
                  <th colspan="3">
                    重量参数 kg
                  </th>
                  <th>材质信息</th>
                </tr>
                <tr>
                  <td class="tableBackground">
                    长
                  </td>
                  <td class="tableBackground">
                    宽
                  </td>
                  <td class="tableBackground">
                    高
                  </td>
                  <td class="tableBackground">
                    最大许可总重
                  </td>
                  <td class="tableBackground">
                    自重
                  </td>
                  <td class="tableBackground">
                    载重
                  </td>
                  <td class="tableBackground">
                    罐体材料
                  </td>
                </tr>
                <tr>
                  <td class="tableContent">
                    {{ row.length|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.width|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.height|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.MPGM|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.tareMass|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.payLoad|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.tankMaterial|filter2 }}
                  </td>
                </tr>
              </table>
              <table class="tankModelTable">
                <tr>
                  <th colspan="2">
                    筒体尺寸 mm
                  </th>
                  <th colspan="4">
                    压力参数 Bar
                  </th>
                  <th>保温</th>
                </tr>
                <tr>
                  <td class="tableBackground">
                    内直径
                  </td>
                  <td class="tableBackground">
                    长
                  </td>
                  <td
                    style="width: 10%"
                    class="tableBackground"
                  >
                    -
                  </td>
                  <td class="tableBackground">
                    最大许可压力
                  </td>
                  <td class="tableBackground">
                    试验压力
                  </td>
                  <td class="tableBackground">
                    最大外部压力
                  </td>
                  <td class="tableBackground">
                    保温厚度 mm
                  </td>
                </tr>
                <tr>
                  <td class="tableContent">
                    {{ row.internalDIA|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.internalLength|filter2 }}
                  </td>
                  <td>罐体</td>
                  <td class="tableContent">
                    {{ row.tankMAWP|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.tankTestPressure|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.externalDesignPressure|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.insulationThickness |filter2 }}
                  </td>
                </tr>
                <tr>
                  <th colspan="2">
                    温度参数 °C
                  </th>
                  <td>加热管</td>
                  <td class="tableContent">
                    {{ row.heatingCoilsMAWP|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ row.heatingCoilsTestPressure|filter2 }}
                  </td>
                  <td class="tableContent">
                    N/A
                  </td>
                  <td>保温材料</td>
                </tr>
                <tr>
                  <td>筒体设计温度</td>
                  <td
                    class="tableContent"
                  >
                    {{ row.vesselDesignTemperature|filter2 }}
                  </td>
                  <td>容积</td>
                  <td
                    class="tableContent"
                  >
                    {{ row.capacity|filter2 }}
                  </td>
                  <td colspan="2" />
                  <td class="tableContent">
                    {{ row.insulation|filter2 }}
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <template v-slot:tankModelOperation="{row}">
            <div
              class="operationButton"
            >
              <i
                class="el-icon-edit-outline deleteIcon"
                @click="goProjectDetail(row)"
              />
              <i
                class="el-icon-delete deleteIcon"
                @click="deleteTankModel(row)"
                title="删除"
              />
            </div>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div style="display: grid;grid-template-columns: 100px 120px;grid-template-rows: 40px">
              <div style="display: flex;justify-content:center;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="addTankModel"
                />
                <span class="addText">新增模型</span>
              </div>
            </div>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: #2F74EB;">
              <span>请联系CIMC后台咨询</span>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  name: 'TankModel',
  filters: {
    filter2: function (value) {
      if (value === undefined || value === null) {
        value = '-'
      }
      return value
    }
  },
  data () {
    return {
      tankModelTemp: undefined,
      newTankModelForm: {
        name: null,
        capacity: null,
        length: null,
        width: null,
        height: null,
        MPGM: null,
        tareMass: null,
        payLoad: null,
        tankMaterial: null,
        internalDIA: null,
        internalLength: null,
        tankMAWP: null,
        tankTestPressure: null,
        heatingCoilsMAWP: null,
        heatingCoilsTestPressure: null,
        externalDesignPressure: null,
        insulationThickness: null,
        vesselDesignTemperature: null,
        insulation: null,
        remark: null
      },
      dialogVisible: false,
      tableHeight: 0,
      gridOptions: {
        resizable: true,
        showOverflow: true,
        expandConfig: {
          accordion: true
        },
        exportConfig: {
          types: ['xlsx', 'csv', 'html', 'xml', 'txt']
        },
        border: true,
        sortConfig: {
          trigger: 'default',
          defaultSort: {
            field: 'deviceSn',
            order: 'desc'
          }
        },
        filterConfig: {
          remote: false
        },
        toolbar: {
          refresh: true,
          zoom: true,
          export: true,
          print: true,
          custom: {
            immediate: true
          },
          slots: {
            buttons: 'toolbar_buttons'
          }
        },
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              const response = await this.$http.post('tank/model/list').catch((error) => {
                VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
              })
              console.log('源数据', response)
              const tankModelData = response.data.data
              console.log('模型数据', tankModelData)
              return tankModelData.data
            }
          }
        },
        columns: [
          { type: 'expand', title: '#', width: 50, align: 'center', slots: { content: 'content' } },
          { field: 'name', title: '模型名称', minWidth: 60, align: 'center' },
          { field: 'tankNum', title: '描述', minWidth: 60 },
          { field: 'createDate', title: '创建时间', minWidth: 60 },
          { field: 'changeDate', title: '更新时间', minWidth: 60 },
          { title: '操作', align: 'center', maxWidth: 80, slots: { default: 'tankModelOperation' } }
        ]
      }
    }
  },
  methods: {
    deleteTankModel (row) {
      this.$confirm(`确认删除模型:${row.name}?`, '删除模型', {
        closeOnClickModal: false,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row.name)
        this.$http.post('/tank/model/delete', { name: row.name }).then(response => {
          console.log(response)
          if (response.data.code === 0) {
            this.$refs.xGrid.remove(row)
            // this.$refs.xGrid.commitProxy('query')
            this.$XModal.message({ message: '删除成功', status: 'success', id: '1' })
          } else { this.$XModal.message({ message: `删除失败@${response.data.message}`, status: 'error', id: '1' }) }
        }).catch(error => { this.$XModal.message({ message: `删除失败@${error}`, status: 'error', id: '1' }) })
      }).catch(() => {
      }
      )
    },
    createCancel () {
      this.dialogVisible = false
      this.newTankModelForm = this.tankModelTemp
      console.log('1234', this.newTankModelForm, this.tankModelTemp)
    },
    createTankModel () {
      console.log(this.newTankModelForm)
      this.$http.post('/tank/model/create', this.newTankModelForm).then(response => {
        console.log(response)
        if (response.data.code === 0) {
          this.newTankModelForm = this.tankModelTemp
          this.dialogVisible = false
          this.$refs.xGrid.commitProxy('query')
          this.$XModal.message({ message: '创建成功', status: 'success', id: '1' })
        } else { this.$message({ message: `创建失败@${response.data.message}`, type: 'error' }) }
      }).catch(error => { this.$message({ message: `创建失败@${error}`, type: 'error' }) })
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    addTankModel () {
      this.dialogVisible = true
      console.log('form值1', this.newTankModelForm)
      this.tankModelTemp = JSON.parse(JSON.stringify(this.newTankModelForm))
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - 185
    window.onresize = () => {
      return (() => {
        this.tableHeight = window.innerHeight - 185
      })()
    }
  }
}
</script>

<style scoped>
.addButton {
  margin-right: 3px;
  font-size: 20px;
  color: #2F74EB;
  cursor: pointer;
}

.addButton:hover {
  color: #b1bed5;
}

.addText {
  color: #2F74EB;
  display: inline-block;
  font-size: 15px;
  font-weight: bold;
}
/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 5px;
}
.deleteIcon {
  font-weight: bold;
  margin-left: 5px;
  font-size: 15px;
  color: #58647A;
  cursor: pointer;
}
.deleteIcon:hover {
  color: black;
}
.tableBackground {
  background-color: #F5F7FA;
}

.tableContent {
  width: 35px;
  height: 18px;
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold sans-serif;
  font-weight: 700;
  color: #58647a;
}

.tableTitle {
  width: 97px;
  height: 23px;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

.tankModelTable {
  text-align: center;
  white-space: nowrap;
  border-collapse: collapse;
  width: 100%;
  margin: 0 auto;
  border-spacing: 0;
}

.tankModelTable1 tr {
  border: 1px solid gainsboro;
}

.tankModelTable td {
  height: 30px;
  padding: 1px;
  border: 1px solid gainsboro;
}

.tankModelTable th {
  height: 30px;
  text-align: center;
  background-color: #acacac;
  font-size: 14px;
  font-weight: 700;
  color: black;
  border: 1px solid gainsboro;
}
/deep/.inputStyle .el-input__inner{
  border-radius: 0;
  height: 35px;
  text-align:center;
}
/deep/.el-dialog__body{
  padding: 10px 20px;
}

</style>
