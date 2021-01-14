<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom:0;"
    >
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tank' }">
        罐箱列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.sn }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 style="display: inline-block">
      罐箱详情
    </h2>
    <h2 style="display: inline-block;margin-left: 10px;color:#006af1 ">
      {{ latestData.tankSn |ifEmpty }}
    </h2>
    <el-tabs
      :value="activeTab"
      @tab-click="resetMap"
    >
      <el-tab-pane
        label="数据监控"
        name="first"
      >
        <!--        设备总览栏-->
        <el-card style="margin:5px">
          <h3 style="margin-top: 0;margin-bottom: 10px;font-weight:normal">
            监控信息总览
          </h3>
          <div
            class="dataCard"
            v-loading="dataLoading"
          >
            <div class="cardItem1">
              <span><i class="el-icon-connection cardIcon" />设备号</span>
              <span>{{ latestData.deviceSn |ifEmpty }}</span>
              <span><i class="el-icon-mobile cardIcon" />设备型号</span>
              <span>tanktrac</span>
              <span><i class="el-icon-set-up cardIcon" />固件版本</span>
              <span>v1.0</span>
              <span><i class="el-icon-time cardIcon" />记录时间</span>
              <span style="font-weight: bold">{{ latestData.sampledAt |ifEmpty |dateFilter }}</span>
              <span><i class="el-icon-time cardIcon" />更新时间</span>
              <span style="font-weight: bold">{{ latestData.receivedAt |ifEmpty |dateFilter }}</span>
            </div>
            <div class="cardItem3">
              <span><i class="el-icon-cpu cardIcon" />电池电量/%</span>
              <span style="font-weight: bold">{{ latestData.batteryLeft |ifEmpty | batteryLimit }}<span
                style="padding-left: 2px;font-weight: normal"
              /></span>
              <i class="el-icon-alarm-clock" />
              <span><i class="el-icon-odometer cardIcon" />温度/C°</span>
              <span style="font-weight: bold">{{ latestData.tankTemperature|ifTemp }}<span
                style="padding-left: 2px;font-weight: normal"
              /></span>
              <i class="el-icon-alarm-clock" />
              <span><i class="el-icon-stopwatch cardIcon" />压力/Bar</span>
              <span style="font-weight: bold">{{ latestData.tankPressure |ifEmpty }}<span
                style="padding-left: 2px;font-weight: normal"
              /></span>
              <i class="el-icon-alarm-clock" />
              <span><i class="el-icon-goblet-full cardIcon" />液位/mm</span>
              <span style="font-weight: bold">{{ latestData.tankLevel |ifEmpty }}<span
                style="padding-left: 2px;font-weight: normal"
              /></span>
              <i class="el-icon-alarm-clock" />
              <span><i class="el-icon-map-location cardIcon" />位置</span>
              <span style="font-size: 13px">{{ latestData.location|ifEmpty }}<span /></span>
              <i class="el-icon-alarm-clock" />
            </div>
            <div style="display: flex">
              <el-image
                style="user-select: none"
                :src="url"
                fit="contain"
              />
            </div>
          </div>
        </el-card>
        <!--        设备地图-->
        <el-card
          class="deviceMapCard"
          v-loading="loading1"
        >
          <div
            id="deviceMap"
            ref="mapDiv"
            class="mapDiv"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane
        label="数据图表"
        name="second"
      >
        <el-card>
          <el-date-picker
            :clearable="false"
            style="width:320px;margin-bottom:30px;"
            format="yyyy/MM/dd HH:mm:ss"
            size="mini"
            value-format="timestamp"
            v-model="chartDate"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="From"
            end-placeholder="To"
            :default-time="['0:00:00']"
            @change="printSelectDate"
          />
          <div
            ref="tempChart"
            :style="{width: scrollerWidth,height: '1000px',margin: '0 auto'}"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane
        label="历史数据"
        name="third"
      >
        <div
          ref="tableDiv"
          :style="{height: scrollerHeight}"
        >
          <vxe-grid
            :header-cell-style="headerCellStyle"
            ref="xGrid"
            auto-resize
            v-bind="gridOptions"
            highlight-hover-row
            highlight-current-row
            highlight-hover-column
            highlight-current-column
            size="mini"
          >
            <!--自定义列插槽-->
            <template v-slot:toolbar_buttons>
              <el-date-picker
                prefix-icon="el-icon-date"
                style="width: 300px"
                size="mini"
                v-model="selectDate"
                type="daterange"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="queryTime"
              />
            </template>
            <template v-slot:tools>
              <vxe-form
                size="mini"
                :data="formData"
                @submit="searchEvent"
                @reset="searchEvent"
                style="margin-left: auto;"
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
            <!--自定义空数据模板-->
            <template v-slot:empty>
              <span style="color: black;">
                <span>暂无数据,请联系cimc后台咨询</span>
              </span>
            </template>
          </vxe-grid>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="罐箱资料"
        name="fourth"
      >
        <el-card />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import echarts from 'echarts'
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import mapboxgl from 'mapbox-gl'
import {EventBus} from '@/assets/JS/eventBus'

export default {
  name: 'TankDetail',
  filters: {
    batteryLimit (value) {
      if (value > 100) return 100
      else return value
    },
    ifEmpty (value) {
      if (value === undefined || value === '' || value < 0 || value === 32767) return '-'
      else return value
    },
    ifTemp (value) {
      if (value === undefined || value === '' || value === 32767) return '-'
      else return value
    },
    dateFilter (value) {
      return XEUtils.toDateString(value, 'yyyy/MM/dd HH:mm:ss')
    }
  },
  data () {
    return {
      activeTab: 'first',
      chartDate: null,
      loading1: false,
      formData: {
        keywords: ''
      },
      selectDate: [undefined, undefined],
      url: 'https://oss.tankmiles.com/tankTrac.png',
      dataLoading: true,
      deviceSn1: undefined,
      latestData: {},
      gridOptions: {
        height: 'auto',
        stripe: true,
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
            field: 'sampledAt',
            order: 'desc'
          }
        },
        filterConfig: {
          remote: false
        },
        pagerConfig: {
          // autoHidden: true,
          total: 0,
          perfect: true,
          currentPage: 1,
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
                if (typeof sort.property === 'number') {
                  console.log('当前sort为number', sort.property)
                } else {
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
              console.log('时间值为', this.selectDate)
              if (this.selectDate === null) this.selectDate = []
              queryParams = Object.assign(queryParams, {
                sn: this.deviceSn1,
                startAt: `${this.selectDate[0] / 1000}`,
                endAt: `${this.selectDate[1] / 1000}`
              })
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
            field: 'tankSn',
            align: 'center',
            title: '箱号',
            minWidth: 150,
            sortable: true
          },
          { field: 'deviceSn', align: 'center', title: '设备号', sortable: true, minWidth: 100 },
          { field: 'sampledAt', title: '记录时间', width: 140, sortable: true, formatter: this.formatDate },
          { field: 'location', title: '地址', width: 100 },
          { field: 'tankTemperature', title: '温度', minWidth: 70, align: 'center', sortable: true, formatter: this.formatTemp },
          { field: 'tankPressure', title: '压力', minWidth: 70, align: 'center', sortable: true, formatter: this.formatPressure },
          { field: 'tankLevel', title: '液位', minWidth: 70, align: 'center', sortable: true, formatter: this.formatLevel },
          { field: 'batteryLeft', title: '电量', minWidth: 70, align: 'center', sortable: true, formatter: this.formatBattery },
          { field: 'lat', title: '经度', width: 100 },
          { field: 'lon', title: '纬度', width: 100 },
          { field: 'speed', title: '速度', width: 100 },
          { field: 'altitude', title: '高度', width: 100 },
          { field: 'gps_valid', title: 'GPSValid', align: 'center', width: 100 }
        ]
      }
    }
  },
  methods: {
    resetMap () {
      console.log(this.activeTab)
      this.$nextTick(() => {
        this.changeMap()
      })
    },
    async  printSelectDate () {
      console.log('SelectDate', this.chartDate)
      this.myChart.showLoading()
      if (this.chartDate !== null) {
        const response = await this.$http.post('/device/message/list', {
          currentPage: 0,
          keywords: '',
          order: 'DESC',
          orderColumnIndex: 7,
          pageSize: 999,
          startAt: parseInt(this.chartDate[0] / 1000),
          endAt: parseInt(this.chartDate[1] / 1000),
          sn: this.deviceSn1
        }).catch((error) => {
          VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
        })
        if (response.data.data.data.length === 0) {
          this.myChart.showLoading({
            text: '暂无数据',
            color: '#ffffff',
            textColor: '#8a8e91',
            maskColor: 'rgba(255, 255, 255, 0.8)'
          }
          )
        } else {
          console.log(response.data.data.data, '图表打印数据1')
          this.myChart.setOption({
            dataset: {
              source: response.data.data.data
            }
          })
          this.myChart.hideLoading()
        }
      }
    },
    translatePosition (x, y) {
      const lon = Math.floor(x / 100) + (x % 100) / 60
      const lat = Math.floor(y / 100) + (y % 100) / 60
      console.log([lon, lat])
      return [lon, lat]
    },
    changeMap () {
      this.Mapbox.resize()
    },
    initDeviceMap (location) {
      const that = this
      this.loading1 = true
      mapboxgl.accessToken = 'pk.eyJ1IjoiemhlbmdnYW5nemh1IiwiYSI6ImNrZWFxMGRoOTAxYXcycnFqbjFkaXBmcHgifQ.C7gXGFGRWOuA3w5hwfuU1g'
      const position = this.translatePosition(location.lon, location.lat)
      console.log('当前经纬度', this.translatePosition(location.lon, location.lat))
      this.Mapbox = new mapboxgl.Map({  // eslint-disable-line
        container: 'deviceMap', // container id 绑定的组件的id
        style: 'mapbox://styles/mapbox/streets-v11', // 地图样式
        center: position,
        minZoom: 3,
        customAttribution: 'CIMC罐程',
        zoom: 10, // starting zoom 地图初始的拉伸比例
        pitch: 10, // 地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
        bearing: 0, // 地图的初始方向，值是北的逆时针度数，默认是0，即是正北
        antialias: false // 抗锯齿，通过false关闭提升性能
      })
      const marker = new mapboxgl.Marker() // eslint-disable-line
        .setLngLat(position)
        .addTo(this.Mapbox)
      this.Mapbox.addControl(new mapboxgl.FullscreenControl())
      this.Mapbox.addControl(new mapboxgl.NavigationControl())
      this.Mapbox.on('load', function () {
        that.Mapbox.resize()
        that.loading1 = false
      })
    },
    queryTime () {
      console.log(this.selectDate)
      this.$refs.xGrid.commitProxy('query')
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    formatTemp ({ cellValue }) {
      if (cellValue === 32767) {
        return '-'
      } else return cellValue.toFixed(1)
    },
    formatPressure ({ cellValue }) {
      if (cellValue < 0 || cellValue === 32767) {
        return '-'
      } else return cellValue.toFixed(1)
    },
    formatLevel ({ cellValue }) {
      if (cellValue < 0 || cellValue === 32767) {
        return '-'
      } else return cellValue
    },
    formatDate ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    formatBattery ({ cellValue }) {
      if (cellValue > 100) return 100
      else return cellValue
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    getTankLatestData () {
      const that = this
      this.$http.post('/device/message/latest', { deviceSn: this.deviceSn1 }).then(response => {
        if (response.data.code !== 0) {
          that.dataLoading = false
          VXETable.modal.message({ message: `请求失败@${response.data.message}`, status: 'error', size: 'medium' })
        } else {
          this.latestData = response.data.data
          this.initDeviceMap(response.data.data)
          this.$nextTick(() => {
            that.dataLoading = false
          })
        }
      }).catch((error) => {
        VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
      })
    }
  },
  async mounted () {
    const that = this
    this.deviceSn1 = this.$route.query.sn
    this.getTankLatestData()
    EventBus.$on('demo', function (isCollapse) {
      if (isCollapse === true) {
        that.loading1 = true
        setTimeout(function () {
          console.log(isCollapse)
          that.changeMap()
          that.loading1 = false
        }, 1000)
      }
    })
    this.myChart = echarts.init(this.$refs.tempChart)
    this.myChart.showLoading()
    const currentDate = Math.round(new Date().getTime() / 1000)
    const currentLastDate = currentDate - 24 * 60 * 60
    this.chartDate = [currentLastDate * 1000, currentDate * 1000]
    console.log('currentTime,currentLastDate', currentDate, currentLastDate)
    const response = await this.$http.post('/device/message/list', {
      currentPage: 0,
      keywords: '',
      order: 'DESC',
      orderColumnIndex: 7,
      pageSize: 999,
      startAt: currentLastDate,
      endAt: currentDate,
      sn: this.deviceSn1
    }).catch((error) => {
      VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
    })
    console.log(response.data.data.data, '图表打印数据')
    const option = {
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {
            readOnly: false
          },
          magicType: {
            type: ['line', 'bar']
          },
          restore: {},
          saveAsImage: {}
        }
      },
      legend: [{}, {}, {}, {}],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: [0, 1, 2, 3],
          start: 0,
          end: 100,
          minSpan: 30
        },
        {
          type: 'inside',
          xAxisIndex: [0, 1, 2, 3],
          start: 0,
          end: 100,
          minSpan: 30
        },
        {
          type: 'slider',
          yAxisIndex: [0],
          start: 0,
          end: 100
        }, {
          type: 'slider',
          yAxisIndex: [1],
          start: 0,
          end: 100
        }, {
          type: 'slider',
          yAxisIndex: [2],
          start: 0,
          end: 100
        }, {
          type: 'slider',
          yAxisIndex: [3],
          start: 0,
          end: 100
        }
      ],
      tooltip: {
        show: true,
        trigger: 'axis',
        triggerOn: 'mousemove',
        axisPointer: {
          type: 'line',
          axis: 'x'
        }
        /*,
        formatter: function (params) {
          // console.log(params, 'dasjkdhka') // 查看数据
          let res = ''
          let data1 = ''
          const time = XEUtils.toDateString(params[0].value.receivedAt, 'yyyy-MM-dd HH:mm:ss')
          for (let i = 0; i < params.length; i++) {
            console.log(params[i].value, params[i].dimensionNames[1], 'test11231')
            data1 = '<p>' + params[i].name + '</p>'
            res += '<p class="padding:15px 0;">' + params[i].marker + params[i].seriesName + '<span style="font-weight:900;float:right;padding-left:15px;">' + params[i].value[params[i].dimensionNames[[params[i].encode.y[0]]]] + '</span>' + '</p>'
          }
          return time + data1 + res
        } */
      },
      axisPointer: {
        type: 'line',
        snap: true,
        label: {
          show: true
        },
        lineStyle: {
          type: 'dashed'
        },
        link: [
          {
            xAxisIndex: [0, 1, 2, 3]
          }
        ]
      },
      grid: [
        { top: '8%', height: '15%' },
        { top: '30%', height: '15%' },
        { top: '55%', height: '15%' },
        { bottom: '8%', height: '15%' }
      ],
      dataset: {
        source: response.data.data.data
      },
      xAxis: [
        { type: 'time', name: '时间', gridIndex: 0 },
        { type: 'time', name: '时间', gridIndex: 1 },
        { type: 'time', name: '时间', gridIndex: 2 },
        { type: 'time', name: '时间', gridIndex: 3 }],
      yAxis: [
        { type: 'value', name: '温度', gridIndex: 0 },
        { type: 'value', name: '压力', gridIndex: 1 },
        { type: 'value', name: '液位', gridIndex: 2 },
        { type: 'value', name: '电量', gridIndex: 3 }],
      series: [
        {
          name: '温度',
          type: 'line',
          showSymbol: false,
          xAxisIndex: 0,
          yAxisIndex: 0,
          connectNulls: false,
          dimensions: ['sampledAt', 'tankTemperature']
        },
        {
          name: '压力',
          type: 'line',
          showSymbol: false,
          xAxisIndex: 1,
          yAxisIndex: 1,
          connectNulls: false,
          dimensions: ['sampledAt', 'tankPressure']
        },
        {
          name: '液位',
          type: 'line',
          showSymbol: false,
          xAxisIndex: 2,
          yAxisIndex: 2,
          connectNulls: false,
          dimensions: ['sampledAt', 'tankLevel']
        },
        {
          name: '电量',
          type: 'line',
          showSymbol: false,
          xAxisIndex: 3,
          yAxisIndex: 3,
          connectNulls: false,
          dimensions: ['sampledAt', 'batteryLeft']
        }
      ]
    }
    this.myChart.setOption(option)
    if (response.data.data.data.length === 0) {
      this.myChart.showLoading({
        text: '暂无数据',
        color: '#ffffff',
        textColor: '#8a8e91',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      }
      )
    } else {
      console.log(response.data.data.data, '图表打印数据1')
      this.myChart.hideLoading()
    }
  },
  computed: {
    pickerOptions () {
      return {
        shortcuts: [
          {
            text: '最近一天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      }
    },
    scrollerHeight: function () {
      return (window.innerHeight - 230) + 'px'
    },
    scrollerWidth: function () {
      return (window.innerWidth - 300) + 'px'
    }
  }
}
</script>

<style scoped>
.deviceMapCard {
  margin: 10px 5px;
}

/deep/ .deviceMapCard .el-card__body {
  padding: 0;
}

.mapDiv {
  width: 100%;
  margin: 0;
  height: 300px;
}

.dataCard {
  font: 15px Tahoma, Helvetica, Arial, '微软雅黑', sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr 0.8fr;
  grid-template-rows: 160px
}

.cardItem1 {
  text-align: start;
  border-right: 2px solid #EBEEF5;
  display: grid;
  grid-template-columns:auto 1fr;
  grid-template-rows:repeat(5, 1fr);
  justify-items: center;
  align-items: center;
}

.cardItem2 {
  padding-left: 10px;
  border-right: 2px solid #EBEEF5;
  display: grid;
  grid-template-columns:repeat(2, 1fr);
  grid-template-rows:repeat(5, 1fr);
  justify-items: start;
  align-items: center;
}

.cardItem3 {
  border-right: 2px solid #EBEEF5;
  padding-left: 10px;
  display: grid;
  grid-template-columns:0.8fr 1fr 20px;
  grid-template-rows:repeat(5, 1fr);
  justify-items: start;
  align-items: center;
}

.cardIcon {
  margin-right: 5px;
  font-size: 18px;
  color: #006af1;
}
</style>
