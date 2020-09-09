<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/project' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增项目</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">新增项目</h1>
          <el-button style="height: 30px;" size="mini" type="primary" icon="el-icon-edit-outline" round>批量新增
          </el-button>
        </div>
      </div>
      <div>
        <el-form ref="addProjectForm" :model="addProjectForm" :rules="rules" size="small" label-width="100px"
                 style="margin-top: 10px">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="addProjectForm.projectName" placeholder="请输入项目名称" clearable
                      prefix-icon='el-icon-document-copy' :style="{width: '30%'}"></el-input>
          </el-form-item>
          <el-form-item label="顶级项目" prop="isRoot">
            <vxe-switch v-model="addProjectForm.isRoot" on-label="是" off-label="否"
                        @change="cleanParentProject"></vxe-switch>
            <!--  <el-switch  active-color="#13ce66"
                          inactive-color="#ff4949" v-model="addProjectForm.isRoot" @change="cleanParentProject"></el-switch>-->
          </el-form-item>
          <el-form-item label="所属项目" prop="parentProject">
            <el-cascader ref="projectCascader" v-model="addProjectForm.parentProject" :options="parentProjectOptions"
                         @change="chooseProject"
                         collapse-tags :disabled="addProjectForm.isRoot"
                         :show-all-levels="true"
                         :props="parentProjectProps" :style="{width: '30%'}" :placeholder="chooseProjectHolder"
                         separator=">"
                         filterable
                         clearable></el-cascader>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addProjectForm.addProjectText" placeholder="请输入备注" :maxlength="20" show-word-limit
                      clearable
                      :style="{width: '30%'}"></el-input>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="submitForm" :loading="loadingStatus">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <div class="chooseTanks">
          <!--          左侧表格-->
          <vxe-grid
            @checkbox-change="selectChangeEventLeft"
            @checkbox-all="selectChangeEventLeft"
            :data="selectedTanksLeft"
            ref="xGridLeft"
            sync-resize
            height="266px"
            v-bind="gridOptionsLeft"
            highlight-hover-row
            highlight-current-row
            highlight-hover-column
            highlight-current-column
            size="mini">
            <!--            顶部模板-->
            <template v-slot:toolbar_buttons_left>
              <div style="background-color: #FA8532;line-height: 46px;border: 1px solid darkgrey">
                <span class="addProjectText">已添加罐箱数:</span>
                <span class="addProjectText" style="margin-left:10px;">{{ selectedTanksLeft.length }}</span>
              </div>
            </template>
            <!--自定义空数据模板-->
            <template v-slot:empty>
            <span style="color: black;">
              <span>请添加设备或暂不添加</span>
            </span>
            </template>
          </vxe-grid>
          <!--          转移按钮-->
          <div style="display: flex;flex-flow: column;align-items: center;justify-content:center;">
            <el-button style="margin: 0 0 3px 0;background-color: #FA8532;border:none" type="primary"
                       icon="el-icon-arrow-left" circle @click="transferToLeft"></el-button>
            <el-button style="margin: 3px 0 0 0;background-color: #58647A;border:none" type="primary"
                       icon="el-icon-arrow-right" circle @click="removeChecked"></el-button>
          </div>
          <!--          右侧表格-->
          <vxe-grid
            @checkbox-change="selectChangeEventRight"
            @checkbox-all="selectAllEventRight"
            ref="xGridRight"
            sync-resize
            height="300px"
            v-bind="gridOptionsRight"
            highlight-hover-row
            highlight-current-row
            highlight-hover-column
            highlight-current-column
            size="mini">
            <!--            顶部模板-->
            <template v-slot:toolbar_buttons_right>
              <div style="background-color: #58647A;line-height: 46px;border: 1px solid #929090">
                <span class="addProjectText">可添加罐箱数:</span>
                <span class="addProjectText" style="margin-left:10px">{{ totalDevicesRight }}</span>
                <span class="addProjectText">当前选择:</span>
                <span class="addProjectText"
                      style="margin-left:10px;color:#FA8532 ">{{ currentSelectedDevicesRight.length }}</span>
              </div>
            </template>
            <!--自定义空数据模板-->
            <template v-slot:empty>
            <span style="color: black;">
              <span>请联系cimc后台咨询</span>
            </span>
            </template>
          </vxe-grid>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  name: 'AddProject',
  data() {
    return {
      loadingStatus: false,
      currentSelectedDevicesLeft: [],
      currentSelectedDevicesRight: [],
      totalDevicesRight: 1,
      selectedTanksLeft: [],
      getAllTanksRight: {},
      gridOptionsLeft: {
        stripe: true,
        resizable: true,
        showOverflow: true,
        border: true,
        checkboxConfig: {
          labelField: 'sn',
          reserve: false
        },
        toolbar: {
          slots: {
            buttons: 'toolbar_buttons_left'
          }
        },
        columns: [
          {type: 'checkbox', field: 'sn', title: '箱号', minWidth: 100},
          {field: 'deviceSn', title: '设备号', minWidth: 100},
          {field: 'projectNames', title: '已分配项目', minWidth: 150}
        ]
      },
      gridOptionsRight: {
        rowId: 'sn',
        stripe: true,
        resizable: true,
        showOverflow: true,
        border: true,
        pagerConfig: {
          size: 'mini',
          total: 0,
          layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'Total'],
          border: false,
          align: 'right',
          pageSize: 5,
          pageSizes: [5, 15, 20]
        },
        checkboxConfig: {
          labelField: 'sn',
          reserve: true
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理
          sort: true, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async ({page, sort, filters}) => {
              // 处理排序条件
              if (sort.property !== undefined) {
                sort.property = {
                  deviceSn: 0,
                  tankSn: 1,
                  category: 2,
                  projectNames: 3,
                  firmwareVersion: 4,
                  lastUpdateTime: 5,
                  sleepInterval: 6,
                  gpsCycles: 7,
                  cellCycles: 8,
                  maxWorkTime: 9,
                  lastUpgradeTime: 10,
                  tankTemperature: 11,
                  tankPressure: 12,
                  tankLevel: 13,
                  battery: 14,
                  connected: 15
                }[sort.property]
              } else sort.property = 0
              sort.order = {
                desc: 'DESC',
                asc: 'ASC'
              }[sort.order]
              console.log('排序值' + JSON.stringify(sort.property))
              let queryParams = Object.assign({
                orderColumnIndex: sort.property,
                order: sort.order
              }, this.formData)
              // 处理筛选条件
              console.log('请求值1', queryParams)
              filters.forEach(({field, values}) => {
                queryParams[field] = values.join(',')
              })
              console.log('请求值2' + JSON.stringify(queryParams))
              queryParams = Object.assign(queryParams, {currentPage: page.currentPage - 1, pageSize: page.pageSize})
              console.log('请求值3', queryParams)
              // 请求数据
              const response = await this.$http.post('tank/list', queryParams).catch((error) => {
                VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium'})
              })
              console.log('源数据', response)
              this.totalDevicesRight = response.data.data.total
              // 构造最终数据
              const listData = {
                page: {
                  currentPage: response.data.data.currentPage + 1,
                  pageSize: response.data.data.pageSize,
                  total: response.data.data.total
                },
                result: response.data.data.data
              }
              console.log('最终数据', listData)
              return listData
            }
          }
        },
        toolbar: {
          slots: {
            buttons: 'toolbar_buttons_right'
          }
        },
        columns: [
          {type: 'checkbox', title: '箱号', minWidth: '25%'},
          {field: 'deviceSn', title: '设备号', minWidth: '25%'},
          {field: 'projectNames', title: '已分配项目', minWidth: '50%'}
        ]
      },
      chooseProjectHolder: '无所属项目',
      parentProjectId: 0,
      addProjectForm: {
        projectName: undefined,
        parentProject: [],
        addProjectName: undefined,
        addProjectText: '',
        isRoot: true,
        allTanks: ''
      },
      rules: {
        projectName: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'blur'
        }],
        parentProject: [{
          required: false,
          type: 'array',
          message: '请至少选择一个所属项目',
          trigger: 'change'
        }],
        field105: []
      },
      parentProjectOptions: [],
      parentProjectProps: {
        multiple: false,
        label: 'name',
        value: 'id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created() {
  },
  methods: {
    submitCreate() {
      this.loadingStatus = true
      const addProjectData = {}
      addProjectData.name = this.addProjectForm.projectName
      addProjectData.isRoot = this.addProjectForm.isRoot
      addProjectData.remark = this.addProjectForm.addProjectText
      addProjectData.tanks = this.addProjectForm.allTanks
      if (addProjectData.isRoot === true) {
        addProjectData.parentProjectId = []
      } else {
        addProjectData.parentProjectId = this.parentProjectId
      }
      console.log('请求数据为', addProjectData)
      this.$http.post('project/create', addProjectData).then(response => {
        console.log(response)
        if (response.data.code === 0) {
          this.loadingStatus = false
          this.$notify({
            title: `${addProjectData.name}`,
            message: '新建项目成功',
            type: 'success'
          })
          this.$router.push('/project')
        } else {
          this.$notify({
            title: '失败',
            message: '新建项目失败',
            type: 'error'
          })
        }
      })
        .catch(error => {
          console.log('error@', error)
        })
    },
    selectAllEventLeft() {
      this.currentSelectedDevicesLeft = [...this.$refs.xGridLeft.getCheckboxRecords(), ...this.$refs.xGridLeft.getCheckboxReserveRecords()]
    },
    selectChangeEventLeft() {
      this.currentSelectedDevicesLeft = [...this.$refs.xGridLeft.getCheckboxRecords(), ...this.$refs.xGridLeft.getCheckboxReserveRecords()]
    },
    removeChecked() {
      if (this.currentSelectedDevicesLeft.length < 1) {
        VXETable.modal.message({message: '未选择设备', status: 'warning', id: 'unique1'})
      } else {
        this.$refs.xGridLeft.removeCheckboxRow()
        this.currentSelectedDevicesLeft = []
        this.selectedTanksLeft = this.$refs.xGridLeft.getTableData().fullData
        const record = this.$refs.xGridLeft.getTableData().fullData.map(item => item.sn)
        console.log('移除处理后的数据', record)
        this.addProjectForm.allTanks = record.toString()
        console.log('tanks最终内容', this.addProjectForm.allTanks)
        VXETable.modal.message({message: '移除成功', status: 'success'})
      }
    },
    transferToLeft() {
      if (this.currentSelectedDevicesRight.length < 1) {
        VXETable.modal.message({message: '请先选择设备', status: 'warning', id: 'unique1'})
      } else {
        this.$refs.xGridLeft.clearCheckboxRow()
        this.selectedTanksLeft = this.currentSelectedDevicesRight
        this.$refs.xGridLeft.loadData(this.selectedTanksLeft)
        const record = this.$refs.xGridLeft.getTableData().fullData.map(item => item.sn)
        console.log('添加处理后的数据', record)
        this.addProjectForm.allTanks = record.toString()
        console.log('tanks最终内容', this.addProjectForm.allTanks)
        VXETable.modal.message({message: `${record.length}台设备已添加`, status: 'success', id: 'unique1'})
      }
    },
    selectAllEventRight() {
      this.currentSelectedDevicesRight = [...this.$refs.xGridRight.getCheckboxRecords(), ...this.$refs.xGridRight.getCheckboxReserveRecords()]
      console.log('全选值', this.currentSelectedDevicesRight.map(item => item.sn))
    },
    selectChangeEventRight() {
      this.currentSelectedDevicesRight = [...this.$refs.xGridRight.getCheckboxRecords(), ...this.$refs.xGridRight.getCheckboxReserveRecords()]
      console.log('选择值', this.currentSelectedDevicesRight.map(item => item.sn))
    },
    submitForm() {
      this.$refs.addProjectForm.validate(valid => {
        if (!valid) {
        } else {
          if (this.addProjectForm.allTanks === '') {
            this.$XModal.confirm('您尚未添加罐箱,确认创建吗？', '即将创建项目').then(type => {
              if (type === 'confirm') {
                this.submitCreate()
              } else {
                close()
              }
            })
          } else {
            this.submitCreate()
          }
        }
      })
    },
    resetForm() {
      this.$refs.addProjectForm.resetFields()
    },
    cleanParentProject() {
      this.getParentProjectOptions()
      if (this.addProjectForm.isRoot === true) {
        this.chooseProjectHolder = '无所属项目'
        this.addProjectForm.parentProject = []
        this.rules.parentProject[0].required = false
        console.log(this.rules.parentProject[0].required)
      } else {
        this.chooseProjectHolder = '请选择所属项目'
        this.rules.parentProject[0].required = true
      }
    },
    async getParentProjectOptions() {
      const response = await this.$http.post('project/list').catch((error) => {
        VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium'})
      })
      this.parentProjectOptions = this.handleData(response.data.data)
      console.log('级联原始数据', this.parentProjectOptions)
    },
    chooseProject() {
      if (this.$refs.projectCascader.getCheckedNodes(true)[0].data) {
        this.parentProjectId = this.$refs.projectCascader.getCheckedNodes(true)[0].data.id
        console.log('父节点ID', this.parentProjectId)
      }
    },
    // 处理级联返回数据
    handleData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined
        } else {
          this.handleData(data[i].children)
        }
      }
      return data
    }
  }
}
</script>

<style scoped>
.addProjectText {
  margin-left: 5px;
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: left;
  color: #ffffff;
  letter-spacing: 1px;
}

/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 0;
}

.chooseTanks {
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  grid-template-rows: 300px;
}
</style>
