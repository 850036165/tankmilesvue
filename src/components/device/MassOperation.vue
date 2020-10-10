<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/devicemanage' }">
        设备管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>批量操作</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style="margin-bottom: 15px;margin-top: 15px">
      批量操作
    </h1>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <el-row
          :gutter="20"
          style="height: 32px"
        >
          <el-col :span="3">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit-outline"
              @click="massAssign"
            >
              批量分配
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button
              size="small"
              type="warning"
              icon="el-icon-edit-outline"
              @click="massUpgrade"
            >
              批量升级
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-edit-outline"
              @click="massDelete"
            >
              批量删除
            </el-button>
          </el-col>
          <span
            style="width:150px;font-weight: bold;line-height: 32px;float: right"
          >当前选择：{{ selectedDevices }}台</span>
        </el-row>
      </div>
      <div>
        <vxe-grid
          @checkbox-change="selectChangeEvent"
          @checkbox-all="selectAllEvent"
          ref="xGrid"
          :height="tableHeight+'px'"
          v-bind="gridOptions"
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          highlight-current-column
          size="mini"
        >
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <vxe-form
              :data="formData"
              @submit="searchEvent"
              @reset="searchEvent"
            >
              <vxe-form-item
                field="name"
                :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"
              />
              <vxe-form-item
                :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }"
              />
            </vxe-form>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: black;">
              <span>没有更多数据了！</span>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>
    <!--   分配弹窗-->
    <el-dialog
      :close-on-click-modal="false"
      title="批量分配"
      :visible.sync="massAssignDialogVisible"
      width="50%"
    >
      <div slot="title">
        <i
          class="el-icon-warning"
          style="font-size: 20px;color: #2F74EB;padding-right: 5px"
        />
        <span style="font-weight: bold;font-size: 20px;color: #2F74EB">批量分配</span>
      </div>
      <span style="display:inline-block;margin:15px 0;font-weight: bold;font-size: 15px">已选设备:</span>
      <span style="display: inline-block;margin: 0 10px 0 10px">{{ allSelectedRecords.length }}台</span><br>
      <div>
        <el-tag
          style="width: 15%;margin: 1px 1px"
          type="info"
          v-for="items in massAssignName"
          :key="items"
        >
          {{ items }}
        </el-tag>
      </div>
      <p style="font-weight: bold;font-size: 15px">
        选择项目:
      </p>
      <!--              选择项目-->
      <el-cascader
        placeholder="请选择项目"
        v-model="deviceProject"
        filterable
        style="width: 300px"
        :options="options"
        :props="props"
        collapse-tags
        clearable
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="massAssignDialogClose">取 消</el-button>
        <el-button
          type="primary"
          @click="massAssignConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--    升级弹窗-->
    <el-dialog
      :close-on-click-modal="false"
      title="批量升级"
      :visible.sync="massUpgradeDialogVisible"
      width="50%"
    >
      <div slot="title">
        <i
          class="el-icon-warning"
          style="font-size: 20px;color: orange;padding-right: 5px"
        />
        <span style="font-weight: bold;font-size: 20px;color: orange">批量升级</span>
      </div>
      <span style="display:inline-block;margin:15px 0;font-weight: bold;font-size: 15px">已选设备:</span>
      <span style="display: inline-block;margin: 0 10px 0 10px">{{ allSelectedRecords.length }}台</span><br>
      <div>
        <el-tag
          style="width: 15%;margin: 1px 1px"
          type="info"
          v-for="items in massAssignName"
          :key="items"
        >
          {{ items }}
        </el-tag>
      </div>
      <p style="font-weight: bold;font-size: 15px">
        选择固件:
      </p>
      <el-select
        v-model="firmware"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="massUpgradeDialogClose">取 消</el-button>
        <el-button
          type="warning"
          @click="massUpgradeConfirm"
        >升 级</el-button>
      </span>
    </el-dialog>
    <!--    删除弹窗-->
    <el-dialog
      :close-on-click-modal="false"
      custom-class="dialogDelete"
      title="批量删除"
      :visible.sync="massDeleteDialogVisible"
      width="50%"
    >
      <div slot="title">
        <i
          class="el-icon-warning"
          style="font-size: 20px;color: red;padding-right: 5px"
        />
        <span style="font-weight: bold;font-size: 20px;color: red">批量删除</span>
      </div>
      <span style="display:inline-block;margin:15px 0;font-weight: bold;font-size: 15px">已选设备:</span>
      <span style="display: inline-block;margin: 0 10px 0 10px">{{ allSelectedRecords.length }}台</span><br>
      <div>
        <el-tag
          style="width: 15%;margin: 1px 1px"
          type="info"
          v-for="items in massAssignName"
          :key="items"
        >
          {{ items }}
        </el-tag>
      </div>
      <!--      <p style="font-size: 20px;font-weight: bold;color: red">选择的设备将会被删除，请确认后操作！</p>-->
      <p style="font-weight: bold;color: red">
        请输入确认后点击删除
      </p>
      <el-input
        style="width: 100px"
        v-model="confirmText"
        placeholder="YES"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="massDeleteDialogClose">取 消</el-button>
        <el-button
          type="danger"
          @click="massDeleteConfirm"
        >删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'DeviceManage',
  data() {
    return {
      firmware: '',
      options1: [
        {label: 'V1.0.1', value: 1},
        {label: 'V1.0.2test', value: 2},
        {label: 'V2.0.1', value: 3},
        {label: 'V3.0.1beta', value: 4}
      ],
      selectedDevices: 0,
      confirmText: '',
      props: {
        multiple: true,
        checkStrictly: true,
        value: 'value',
        label: 'label',
        children: 'children'
      },
      deviceProject: '',
      options: [
        {
          value: 1,
          label: '万华',
          children:
            [{value: 2, label: '万华烟台'},
              {
                value: 3,
                label: '万华宁波',
                children: [
                  {value: 7, label: '万华宁波子用户1'},
                  {value: 8, label: '万华宁波子用户2'},
                  {value: 9, label: '万华宁波子用户3'},
                  {value: 10, label: '万华宁波子用户4'},
                  {value: 11, label: '万华宁波子用户5'}
                ]
              }]
        },
        {
          value: 4,
          label: 'exsif',
          children:
            [{value: 5, label: 'exsif国内'},
              {value: 6, label: 'exsif国外'}]
        }
      ],
      massAssignName: [],
      massDeleteDialogVisible: false,
      massUpgradeDialogVisible: false,
      massAssignDialogVisible: false,
      massChangeShow: true,
      allSelectedRecords: [],
      tableHeight: 0,
      formData: {
        name: ''
      },
      gridOptions: {
        stripe: true,
        resizable: true,
        showOverflow: true,
        exportConfig: true,
        border: true,
        rowId: 'id',
        sortConfig: {
          trigger: 'default',
          defaultSort: {
            field: 'name',
            order: 'desc'
          }
        },
        filterConfig: {
          remote: true
        },
        pagerConfig: {
          total: 0,
          layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'Total'],
          border: false,
          background: true,
          align: 'right',
          pageSize: 15,
          pageSizes: [5, 15, 50, 100, 200]
        },
        checkboxConfig: {
          labelField: 'id',
          reserve: true
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理
          sort: true, // 启用排序代理
          filter: true, // 启用筛选代理
          ajax: {
            query: async ({page, sort, filters}) => {
              // 处理排序条件
              const queryParams = Object.assign({
                sort: sort.property,
                order: sort.order
              }, this.formData)
              // 处理筛选条件
              filters.forEach(({field, values}) => {
                queryParams[field] = values.join(',')
              })
              // const queryParamsJson = JSON.stringify(queryParams)
              // console.log(queryParamsJson)
              console.log(queryParams)
              const response = await this.$http.get(`https://api.xuliangzhan.com:10443/api/pub/page/list/${page.pageSize}/${page.currentPage}`, {params: queryParams}).catch((error) => {
                VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium'})
              })
              console.log(response.data)
              return response.data
            }
          }
        },
        toolbar: {
          refresh: true,
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          }
        },
        columns: [
          {type: 'checkbox', title: 'ID', width: 60},
          {
            field: 'name',
            title: 'Name',
            minWidth: 200,
            remoteSort: true
          },
          {field: 'nickname', title: 'Nickname', remoteSort: true, minWidth: 200},
          {field: 'age', title: 'Age', remoteSort: true, width: 100},
          {
            field: 'role',
            title: 'Role',
            remoteSort: true,
            minWidth: 200,
            filters: [
              {label: '前端开发', value: '前端'},
              {label: '后端开发', value: '后端'},
              {label: '测试', value: '测试'},
              {label: '程序员鼓励师', value: '程序员鼓励师'}
            ],
            filterMultiple: false
          },
          {field: 'amount', title: 'Amount', width: 100, formatter: this.formatAmount},
          {field: 'updateDate', title: 'Update Date', width: 160, remoteSort: true, formatter: this.formatDate},
          {field: 'createDate', title: 'Create Date', width: 160, remoteSort: true, formatter: this.formatDate}
        ]
      }
    }
  },
  created() {
  },
  mounted() {
    this.tableHeight = window.innerHeight - 230
    window.onresize = () => {
      return (() => {
        this.tableHeight = window.innerHeight - 230
      })()
    }
  },
  methods: {
    selectAllEvent() {
      this.selectedDevices = [...this.$refs.xGrid.getCheckboxRecords(), ...this.$refs.xGrid.getCheckboxReserveRecords()].length
    },
    selectChangeEvent() {
      this.selectedDevices = [...this.$refs.xGrid.getCheckboxRecords(), ...this.$refs.xGrid.getCheckboxReserveRecords()].length
    },
    massAssignDialogClose() {
      this.massAssignDialogVisible = false
      this.deviceProject = ''
    },
    massUpgradeDialogClose() {
      this.massUpgradeDialogVisible = false
    },
    massDeleteDialogClose() {
      this.massDeleteDialogVisible = false
      this.confirmText = ''
    },
    massAssignConfirm() {
      this.massAssignDialogVisible = false
      VXETable.modal.message({message: '分配成功', status: 'success'})
    },
    massUpgradeConfirm() {
      this.massUpgradeDialogVisible = false
      VXETable.modal.message({message: '升级指令已发送', status: 'success'})
    },
    massDeleteConfirm() {
      if (this.confirmText === '确认') {
        this.massDeleteDialogVisible = false
        VXETable.modal.message({message: '删除成功', status: 'error'})
        this.confirmText = ''
      } else {
        this.$message.error('请确认后再试')
      }
    },
    massAssign() {
      const checkedRecords = this.$refs.xGrid.getCheckboxRecords()
      const reserveRecords = this.$refs.xGrid.getCheckboxReserveRecords()
      this.allSelectedRecords = [...checkedRecords, ...reserveRecords]
      if (this.allSelectedRecords.length !== 0) {
        this.massAssignDialogVisible = !this.massAssignDialogVisible
        this.massAssignName = this.allSelectedRecords.map(item => item.name)
      } else {
        VXETable.modal.message({message: '请先选择设备', status: 'warning'})
      }
    },
    massUpgrade() {
      const checkedRecords = this.$refs.xGrid.getCheckboxRecords()
      const reserveRecords = this.$refs.xGrid.getCheckboxReserveRecords()
      this.allSelectedRecords = [...checkedRecords, ...reserveRecords]
      if (this.allSelectedRecords.length !== 0) {
        this.massUpgradeDialogVisible = !this.massUpgradeDialogVisible
        this.massAssignName = this.allSelectedRecords.map(item => item.name)
      } else {
        VXETable.modal.message({message: '请先选择设备', status: 'warning'})
      }
    },
    massDelete() {
      const checkedRecords = this.$refs.xGrid.getCheckboxRecords()
      const reserveRecords = this.$refs.xGrid.getCheckboxReserveRecords()
      this.allSelectedRecords = [...checkedRecords, ...reserveRecords]
      if (this.allSelectedRecords.length !== 0) {
        this.massDeleteDialogVisible = !this.massDeleteDialogVisible
        this.massAssignName = this.allSelectedRecords.map(item => item.name)
      } else {
        VXETable.modal.message({message: '请先选择设备', status: 'warning'})
      }
    },
    searchEvent() {
      this.$refs.xGrid.commitProxy('reload')
    },
    formatAmount({cellValue}) {
      return cellValue ? `$${XEUtils.commafy(XEUtils.toFixedString(cellValue, 2))}` : ''
    },
    formatDate({cellValue}) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 0;
}

/deep/ .el-dialog__body {
  padding: 0 50px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
