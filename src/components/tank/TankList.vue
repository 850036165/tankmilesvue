<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('tankList.homePage') }}
      </el-breadcrumb-item>
      <!--      <el-breadcrumb-item>资产管理</el-breadcrumb-item>-->
      <el-breadcrumb-item>{{ $t('tankList.tankList') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            {{ $t('tankList.tankList') }}
          </h1>
          <!--    <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
            @click="massChange"
          >
            批量操作
          </el-button>-->
        </div>
      </div>
      <div>
        <vxe-grid
          :cell-style="cellStyle"
          :header-cell-style="headerCellStyle"
          ref="xGrid"
          :height="tableHeight+'px'"
          v-bind="gridOptions"
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          highlight-current-column
          size="mini"
        >
          <!--自定义列插槽-->
          <template v-slot:operation="{row}">
            <el-button
              class="operationButton"
              type="info"
              size="mini"
              @click="clickOperation(row)"
            >
              {{ $t('tankList.operation') }}
            </el-button>
          </template>
          <template v-slot:tankSn_default="{ row }">
            <div style="display: flex;justify-content: left;align-items: start">
              <button
                class="deviceDetail"
                @click="goDetail(row)"
              >
                {{ row.sn }}
              </button>
            </div>
          </template>
          <template v-slot:tools>
            <vxe-form
              :data="formData"
              @submit="searchEvent"
              @reset="searchEvent"
              style="padding: 0;margin-right: 10px"
            >
              <vxe-form-item
                field="keywords"
                :item-render="{name: 'input', attrs: {placeholder: $t('tankList.inputName')}}"
              />
              <vxe-form-item
                :item-render="{ name: '$buttons',
                                children: [{ props: { type: 'submit', content: $t('tankList.search'),
                                                      status: 'primary' } },
                                           { props: { type: 'reset', content: $t('tankList.reset')} }] }"
              />
            </vxe-form>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div style="display: grid;grid-template-columns: 100px 120px;grid-template-rows: 40px">
              <div style="display: flex;justify-content:center;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="addDevices"
                />
                <span class="addText">{{ $t('tankList.newTank') }}</span>
              </div>
              <div style="display: flex;justify-content:center;align-items:center;border-left: 1px solid #D8D8D8;">
                <span
                  class="addText"
                  style="color: black;"
                >{{ $t('tankList.totalTank') }}</span>
                <span
                  class="addText"
                  style="margin-left:10px;color: #2A68D3"
                >{{ totalDevices }}</span>
              </div>
            </div>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <div style="color: black;">
              <i />
              <p>OOPS!{{ $t('tankList.noTankHere') }}！</p>
              <span>{{ $t('tankList.contactCIMC') }}</span>
              <router-link
                to="/tank/addtanks"
                style="color: red"
              >
                {{ $t('tankList.newTank') }}
              </router-link>
            </div>
          </template>
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/styles/variable.scss'

export default {
  name: 'TankList',
  data () {
    return {
      totalDevices: null,
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
            field: 'sampledAt',
            order: 'desc'
          },
          remote: true,
          trigger: 'default'
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
        // radioConfig: {
        //   labelField: 'id',
        //   reserve: true,
        //   highlight: true
        // },
        proxyConfig: {
          seq: true, // 启用动态序号代理
          sort: true, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async ({ page, sort, filters }) => {
              // 处理排序条件
              if (sort.property) {
                console.log('初始order非null1', sort.property)
                if (typeof sort.property === 'number') { console.log('当前sort为number', sort.property) } else {
                  switch (sort.property) {
                    case 'sn':
                      sort.property = 0
                      break
                    case 'deviceSn':
                      sort.property = 1
                      break
                    case 'receivedAt':
                      sort.property = 2
                      break
                    case 'tankTemperature':
                      sort.property = 3
                      break
                    case 'tankPressure':
                      sort.property = 4
                      break
                    case 'tankLevel':
                      sort.property = 5
                      break
                    case 'batteryLeft':
                      sort.property = 6
                      break
                    case 'sampledAt':
                      sort.property = 7
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
              const response = await this.$http.post('/tank/list/message', queryParams).catch((error) => {
                VXETable.modal.message({ message: `${this.$t('login.loginFailed')}请求失败@${error}`, status: 'error', size: 'medium' })
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
            buttons: 'toolbar_buttons',
            tools: 'tools'
          }
        },
        columns: [
          { type: 'seq', width: 50, align: 'center' },
          {
            field: 'sn',
            align: 'center',
            title: `${this.$t('tankList.tankContainerNo')}`,
            minWidth: 150,
            sortable: true,
            slots: { default: 'tankSn_default' }
          },
          { field: 'deviceSn', align: 'left', title: `${this.$t('tankList.deviceID')}`, sortable: true, minWidth: 100 },
          { field: 'sampledAt', title: `${this.$t('tankList.recordTime')}`, width: 140, sortable: true, formatter: this.formatDate2 },
          { field: 'location', title: `${this.$t('tankList.address')}`, minWidth: 100 },
          { field: 'tankTemperature', title: `${this.$t('tankList.temperature')}`, Width: 80, sortable: true, formatter: this.formatDate },
          { field: 'tankPressure', title: `${this.$t('tankList.pressure')}`, Width: 70, sortable: true, formatter: this.formatDate },
          { field: 'tankLevel', title: `${this.$t('tankList.fluidLevel')}`, Width: 70, sortable: true, formatter: this.formatDate },
          { field: 'batteryLeft', title: `${this.$t('tankList.battery')}`, Width: 70, sortable: true, formatter: this.formatBattery },
          // { field: 'lat', title: `${this.$t('tankList.longitude')}`, width: 100 },
          // { field: 'lon', title: `${this.$t('tankList.latitude')}`, width: 100 },
          // { field: 'speed', title: `${this.$t('tankList.speed')}`, width: 100 },
          // { field: 'altitude', title: `${this.$t('tankList.high')}`, width: 100 },
          { field: 'gps_valid', title: 'GPSValid', align: 'center', width: 100 },
          { title: `${this.$t('tankList.operation')}`, align: 'center', width: 80, slots: { default: 'operation' } }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    this.tableHeight = window.innerHeight - 185
  },
  methods: {
    formatDate ({ cellValue }) {
      if (cellValue < 0 || cellValue === 32767) { return '-' } else return cellValue
    },
    cellStyle ({ row, rowIndex, column, columnIndex }) {
      if (column.property === 'batteryLeft') {
        if (row.batteryAlert === true) {
          return {
            borderLeft: 'solid 4px #FA675C'
          }
        } else {
          return {
            paddingLeft: '4px'
          }
        }
      }
    },
    clickOperation (row, column) {
      console.log(row, column)
      this.$router.push({
        path: '/edittank',
        query: {
          id: row.id
        }
      })
    },
    massChange () {
      this.$router.push('/device/massoperation')
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff',
        textAlign: 'left'
      }
    },
    goDetail (row) {
      console.log(row)
      // 传递列参数至组件
      this.$router.push({
        path: '/tank/tankdetail',
        query: {
          sn: row.deviceSn
        }
      })
    },
    addDevices () {
      this.$router.push('/tank/addtanks')
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy/MM/dd HH:mm:ss')
    },
    formatBattery ({ cellValue }) {
      if (cellValue > 100) return 100
      else return cellValue
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 0;
}

.deviceDetail {
  background-color: white;
  border-radius: 2px;
  border: none;
}

.deviceDetail:hover {
  background-color: #2F74EB;
  border-radius: 2px;
  cursor: pointer;
}

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

.classA {
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #FA675C;
  margin-right: 3px
}

.classB {
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #33B892;
  margin-right: 3px
}
</style>
