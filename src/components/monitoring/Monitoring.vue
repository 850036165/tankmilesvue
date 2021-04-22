<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('monitorList.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('monitorList.monitorSetting') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('monitorList.monitorList') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            {{ $t('monitorList.monitorList') }}
          </h1>
          <!-- <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
          >
            Button
          </el-button>-->
        </div>
      </div>
      <!--      主体表格-->
      <div>
        <vxe-grid
          :header-cell-style="headerCellStyle"
          ref="xGrid"
          :height="tableHeight+'px'"
          v-bind="gridOptions"
          highlight-hover-row
          highlight-hover-column
          size="mini"
        >
          <!--          是否启用账户-->
          <template v-slot:content="{row}">
            <el-tag
              style="margin: 5px"
              v-for="item in row.devices.split(',')"
              :key="item"
            >
              {{ item }}
            </el-tag>
          </template>
          <!--          是否启用-->
          <template v-slot:enableMonitor="{row}">
            <el-switch
              @change="enableMonitor(row)"
              v-model="row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
          <!--          自定义插槽-->
          <template v-slot:monitorOperation="{row}">
            <div class="operationButton">
              <el-popconfirm
                :confirm-button-text="$t('monitorList.yes')"
                :cancel-button-text="$t('monitorList.cancel')"
                icon="el-icon-info"
                icon-color="red"
                :title=" $t('monitorList.confirmDelete')"
                @confirm="deleteMonitor() "
              >
                <i
                  slot="reference"
                  class="el-icon-delete deleteIcon"
                  @click="getMonitorId(row)"
                />
              </el-popconfirm>
            </div>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div>
              <div style="display: flex;justify-content:start;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="addMonitor"
                />
                <span class="addText">{{ $t('monitorList.newMonitor') }}</span>
              </div>
            </div>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: #2F74EB;">
              <span>{{ $t('monitorList.contactCIMC') }}</span>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'

export default {
  name: 'Monitoring',
  data () {
    return {
      toBeDeletedMonitor: null,
      tableHeight: 0,
      formData: {
        keywords: ''
      },
      gridOptions: {
        stripe: true,
        resizable: true,
        showOverflow: true,
        exportConfig: {
          types: ['xlsx', 'csv', 'html', 'xml', 'txt']
        },
        border: true,
        rowId: 'id',
        sortConfig: {
          defaultSort: {
            field: 'id',
            order: 'asc'
          },
          trigger: 'default',
          remote: true
        },
        filterConfig: {
          remote: false
        },
        pagerConfig: {
          // autoHidden: true,
          total: 0,
          layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'Total'],
          border: false,
          background: true,
          align: 'right',
          pageSize: 15,
          pageSizes: [5, 15, 20, 50, 100, 200]
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理
          sort: true, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async ({ page, sort, filters }) => {
              // 处理排序条件
              if (sort.property) {
                console.log('初始order非null1', sort.property)
                if (typeof sort.property === 'number') {
                  console.log('当前sort为number', sort.property)
                } else {
                  switch (sort.property) {
                    case 'id':
                      sort.property = 0
                      break
                    case 'name':
                      sort.property = 1
                      break
                    case 'enabled':
                      sort.property = 2
                      break
                    case 'alarmParameter':
                      sort.property = 3
                      break
                    case 'boundMax':
                      sort.property = 4
                      break
                    case 'boundMin':
                      sort.property = 5
                      break
                  }
                  console.log('初始order非null2', sort.property)
                }
              }
              if (sort.order) {
                console.log('order值为1', sort.order)
                switch (sort.order) {
                  case 'desc':
                    sort.order = 'DESC'
                    break
                  case 'asc':
                    sort.order = 'ASC'
                    break
                  case 'DESC':
                    sort.order = 'DESC'
                    break
                  case 'ASC':
                    sort.order = 'ASC'
                    break
                  default:
                    sort.order = 'DESC'
                }
                console.log('order值为2', sort.order)
              } else {
                console.log('order值为3', sort.order)
                sort.order = 'DESC'
                console.log('order值为4', sort.order)
              }
              console.log('排序值' + JSON.stringify(sort.property))
              let queryParams = Object.assign({
                orderColumnIndex: sort.property,
                order: sort.order
              }, this.formData)
              // 处理筛选条件
              console.log('请求值1', queryParams)
              filters.forEach(({ field, values }) => {
                queryParams[field] = values.join(',')
              })
              console.log('请求值2' + JSON.stringify(queryParams))
              queryParams = Object.assign(queryParams, { currentPage: page.currentPage - 1, pageSize: page.pageSize })
              console.log('请求值3', queryParams)
              // 请求数据
              const response = await this.$http.post('/alarm/config/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `${this.$t('monitorList.requestFailed')}@${error}`, status: 'error', size: 'medium' })
              })
              console.log('源数据', response)
              this.totalDevices = response.data.data.total
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
        toolbarConfig: {
          refresh: true,
          zoom: true,
          export: true,
          print: true,
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          }
        },
        columns: [
          { type: 'seq', minWidth: 50, align: 'center' },
          { field: 'id', align: 'center', title: 'ID', sortable: true, minWidth: 80 },
          { field: 'name', align: 'center', title: `${this.$t('monitorList.monitorName')}`, sortable: true, minWidth: 150 },
          { field: 'enabled', align: 'center', title: `${this.$t('monitorList.ableOrNot')}`, minWidth: 100, slots: { default: 'enableMonitor' } },
          { field: 'alarmParameter', align: 'center', title: `${this.$t('monitorList.monitorParameter')}`, minWidth: 150 },
          { field: 'boundMax', align: 'center', title: `${this.$t('monitorList.maximum')}`, minWidth: 100 },
          { field: 'boundMin', align: 'center', title: `${this.$t('monitorList.minimum')}`, minWidth: 100 },
          { field: 'createdAt', align: 'center', title: `${this.$t('monitorList.createDate')}`, minWidth: 150, formatter: this.formatDate },
          { field: 'emails', align: 'center', title: `${this.$t('monitorList.email')}`, minWidth: 150 },
          { field: 'frequency', align: 'center', title: `${this.$t('monitorList.frequency')}`, minWidth: 80 },
          { field: 'phones', align: 'center', title: `${this.$t('monitorList.phone')}`, minWidth: 150, formatter: this.ifNoPhone },
          { field: 'startAt', align: 'center', title: `${this.$t('monitorList.startDate')}`, minWidth: 150, formatter: this.formatDate2 },
          { field: 'endAt', align: 'center', title: `${this.$t('monitorList.endDate')}`, minWidth: 150, formatter: this.formatDate2 },
          { type: 'expand', title: `${this.$t('monitorList.deviceSn')}`, minWidth: 80, align: 'center', slots: { content: 'content' } },
          { title: `${this.$t('monitorList.operation')}`, align: 'center', minWidth: 80, slots: { default: 'monitorOperation' } }
        ]
      }
    }
  },
  methods: {
    deleteMonitor () {
      this.$http.post('/alarm/config/delete', { id: this.toBeDeletedMonitor.id }).then(
        response => {
          if (response.data.code !== 0) {
            VXETable.modal.message({
              message: `${this.$t('monitorList.deletedFailed')}@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          } else {
            this.$refs.xGrid.remove(this.toBeDeletedMonitor)
            VXETable.modal.message({
              message: `${this.$t('monitorList.deleteSuccess')}`,
              status: 'success',
              size: 'medium',
              id: 'unique1'
            })
          }
        }
      ).catch((error) => {
        VXETable.modal.message({ message: `${this.$t('monitorList.deletedFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique1' })
      })
    },
    getMonitorId (row) {
      console.log(row)
      this.toBeDeletedMonitor = row
    },
    enableMonitor (row) {
      console.log(row)
      this.$http.post('/alarm/config/switch', { id: row.id, enabled: row.enabled })
        .then((response) => {
          console.log(response)
          if (response.data.code !== 0) {
            row.enabled = !row.enabled
            VXETable.modal.message({
              message: `${this.$t('monitorList.startFailed')}@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          }
        })
        .catch((error) => {
          console.log(error)
          row.enabled = !row.enabled
          VXETable.modal.message({
            message: `${this.$t('monitorList.modifyFailed')}@${error}`,
            status: 'error',
            size: 'medium',
            id: 'unique1'
          })
        })
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    addMonitor () {
      this.$router.push('/createMonitor')
    },
    formatDate ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    ifNoPhone ({ cellValue }) {
      if (cellValue) {
        return cellValue
      } else {
        return '-'
      }
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
</style>
