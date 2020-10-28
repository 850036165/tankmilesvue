<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>罐箱列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            罐箱列表
          </h1>
          <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
            @click="massChange"
          >
            批量操作
          </el-button>
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
            <vxe-button
              class="operationButton"
              status="primary"
              round
              @click="clickOperation(row)"
            >
              操作
            </vxe-button>
          </template>
          <template v-slot:tankSn_default="{ row }">
            <div>
              <button
                class="deviceDetail"
                @click="goDetail(row)"
              >
                罐箱号:{{ row.tankSn }}
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
                :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"
              />
              <vxe-form-item
                :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }"
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
                <span class="addText">新增罐箱</span>
              </div>
              <div style="display: flex;justify-content:center;align-items:center;border-left: 1px solid #D8D8D8;">
                <span
                  class="addText"
                  style="color: black;"
                >罐箱总数</span>
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
              <p>OOPS!此处暂无罐箱！</p>
              <span>请联系cimc后台咨询或</span>
              <router-link
                to="/tank/addtanks"
                style="color: red"
              >
                新建罐箱
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
                    case 'tankSn':
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
              const response = await this.$http.post('/device/message/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
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
        toolbar: {
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
          { type: 'seq', width: 50, align: 'center' },
          {
            field: 'tankSn',
            align: 'center',
            title: '箱号',
            minWidth: 150,
            remoteSort: true,
            slots: { default: 'tankSn_default' }
          },
          { field: 'deviceSn', align: 'center', title: '设备号', remoteSort: true, minWidth: 100 },
          { field: 'sampledAt', title: '记录时间', width: 140, formatter: this.formatDate2 },
          { field: 'receivedAt', title: '更新时间', width: 140, remoteSort: true, formatter: this.formatDate2 },
          { field: 'location', title: '地址', width: 100 },
          { field: 'tankTemperature', title: '温度', minWidth: 70, remoteSort: true },
          { field: 'tankPressure', title: '压力', minWidth: 70, remoteSort: true },
          { field: 'tankLevel', title: '液位', minWidth: 70, remoteSort: true },
          { field: 'batteryLeft', title: '电量', minWidth: 70, remoteSort: true },
          { field: 'lat', title: '经度', width: 100 },
          { field: 'lon', title: '纬度', width: 100 },
          { field: 'speed', title: '速度', width: 100 },
          { field: 'altitude', title: '高度', width: 100 },
          { field: 'gps_valid', title: 'GPSValid', align: 'center', width: 100 },
          { title: '操作', align: 'center', width: 80, slots: { default: 'operation' } }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    this.tableHeight = window.innerHeight - 185
    window.onresize = () => {
      return (() => {
        this.tableHeight = window.innerHeight - 185
      })()
    }
  },
  methods: {
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
    },
    massChange () {
      this.$router.push('/device/massoperation')
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
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
  width: 100px;
  background-color: grey;
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
