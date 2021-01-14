<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            设备管理
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
          <template v-slot:deviceSn_default="{ row }">
            <div>
              <i :class="row.connected?'classB':'classA'" />
              <button
                class="deviceDetail"
                @click="goDetail(row)"
              >
                {{ row.deviceSn }}
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
                <span class="addText">新增设备</span>
              </div>
              <div style="display: flex;justify-content:center;align-items:center;border-left: 1px solid #D8D8D8;">
                <span
                  class="addText"
                  style="color: black;"
                >设备总数</span>
                <span
                  class="addText"
                  style="margin-left:10px;color: #2A68D3"
                >{{ totalDevices }}</span>
              </div>
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
    </el-card>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/styles/variable.scss'

export default {
  name: 'DeviceList',
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
          trigger: 'default',
          defaultSort: {
            field: 'deviceSn',
            order: 'desc'
          }
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
          align: 'right'
        },
        // radioConfig: {
        //   labelField: 'id',
        //   reserve: true,
        //   highlight: true
        // },
        proxyConfig: {
          prop: {
            total: 'total'
          },
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
                    case 'deviceSn':
                      sort.property = 0
                      break
                    case 'tankSn':
                      sort.property = 1
                      break
                    case 'category':
                      sort.property = 2
                      break
                    case 'projectNames':
                      sort.property = 3
                      break
                    case 'firmwareVersion':
                      sort.property = 4
                      break
                    case 'lastUpdateTime':
                      sort.property = 5
                      break
                    case 'temperatureInterval':
                      sort.property = 6
                      break
                    case 'gpsInterval':
                      sort.property = 7
                      break
                    case 'commInterval':
                      sort.property = 8
                      break
                    case 'maxWorkTime':
                      sort.property = 9
                      break
                    case 'lastUpgradeTime':
                      sort.property = 10
                      break
                    case 'tankTemperature':
                      sort.property = 11
                      break
                    case 'tankPressure':
                      sort.property = 12
                      break
                    case 'tankLevel':
                      sort.property = 13
                      break
                    case 'batteryLeft':
                      sort.property = 14
                      break
                    case 'connected':
                      sort.property = 15
                      break
                    default:
                      sort.property = 0
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
              const response = await this.$http.post('device/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
              })
              console.log('源数据', response)
              this.totalDevices = response.data.data.total
              // 请求位置信息
              // for (let i = 0; i < response.data.data.data.length; i++) {
              //   console.log('行内', [response.data.data.data[i].lat, response.data.data.data[i].lon])
              //   const myLat = response.data.data.data[i].lat
              //   const myLon = response.data.data.data[i].lon
              //   const response1 = await this.$http.get(`https://restapi.amap.com/v3/geocode/regeo?location=${myLon},${myLat}&key=19c0dfb39bb8f17869228303e7df7b5f`).catch((error) => {
              //     VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
              //   })
              //   console.log('地址', response1)
              //   response.data.data.data[i].position = response1.data.regeocode.formatted_address
              // }
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
          { type: 'seq', width: 50, align: 'center' },
          {
            field: 'deviceSn',
            align: 'center',
            title: '设备号',
            minWidth: 150,
            sortable: true,
            slots: { default: 'deviceSn_default' }
          },
          { field: 'tankSn', title: '箱号', sortable: true, minWidth: 100 },
          { field: 'category', title: '设备类型', sortable: true, width: 120 },
          { field: 'projectNames', title: '所属项目', sortable: true, minWidth: 150 },
          { field: 'firmwareVersion', title: '固件版本', width: 100, sortable: true },
          { field: 'lastUpgradeTime', title: '最近更新', width: 140, sortable: true, formatter: this.formatDate1 },
          { field: 'temperatureInterval', title: '温度周期', width: 100, sortable: true },
          { field: 'gpsInterval', title: 'GPS周期', width: 100, sortable: true },
          { field: 'commInterval', title: '基站通讯周期', width: 120, sortable: true },
          { field: 'maxWorkTime', title: '最大工作时间', width: 120, sortable: true },
          { field: 'updateTime', title: '更新时间', width: 140, sortable: true, formatter: this.formatDate2 },
          { field: 'lat', title: '经度', width: 100, sortable: true },
          { field: 'lon', title: '纬度', width: 100, sortable: true },
          { field: 'location', title: '地址', width: 100 },
          { field: 'tankTemperature', title: '温度', minWidth: 70, sortable: true },
          { field: 'tankPressure', title: '压力', minWidth: 70, sortable: true },
          { field: 'tankLevel', title: '液位', minWidth: 70, sortable: true },
          { field: 'batteryLeft', title: '电量', minWidth: 70, sortable: true },
          { field: 'connected', title: '在线', align: 'center', width: 80, sortable: true },
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
    clickOperation (row) {
      console.log(row)
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
        path: '/device/devicedetail',
        query: {
          sn: row.deviceSn
        }
      })
    },
    addDevices () {
      this.$router.push('/device/adddevices')
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    formatDate1 ({ cellValue }) {
      return new Date(parseInt(cellValue) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    },
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
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
