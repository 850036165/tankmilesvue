<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/device' }">
        设备管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ this.$route.query.sn }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="display: flex;align-items: center;justify-content: flex-end">
      <h1 style="margin-right: auto;margin-left: 10px">
        设备详情&nbsp;<span
          style="color: #2A68D3"
        >{{ this.$route.query.sn }}</span>
      </h1>
      <el-button
        style="height: 30px"
        type="info"
        plain
        size="mini"
        @click="editDevice"
        v-show="canNotEdit&&this.activeTabs!=='third'"
      >
        编辑配置
      </el-button>
      <el-button
        type="success"
        size="mini"
        @click="saveEdit"
        v-show="!canNotEdit"
      >
        保存配置
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="quitEdit"
        v-show="!canNotEdit"
      >
        放弃修改
      </el-button>
      <el-tooltip
        effect="dark"
        placement="bottom-end"
      >
        <div slot="content">
          点击编辑可修改设置<br>否则仅能查看和复制
        </div>
        <i
          class="el-icon-warning-outline"
          v-show="canNotEdit&&this.activeTabs!=='third'"
          style="font-size: 20px;height: 30px;cursor: pointer;line-height: 30px;margin-left: 10px"
        />
      </el-tooltip>
    </div>
    <el-card>
      <el-tabs v-model="activeTabs">
        <!--        分页1-->
        <el-tab-pane
          label="基础信息"
          name="first"
        >
          <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 250px">
            <!--          左侧详细信息显示-->
            <div>
              <p
                class="chooseDeviceType"
                style="margin-bottom: 10px"
              >
                基础信息
              </p>
              <!--              表单1-->
              <el-form
                status-icon
                label-width="100px"
                style="width: 400px;margin: 0 auto"
                :model="addForm"
                size="small"
                :rules="addRules"
                ref="ruleForm1"
                hide-required-asterisk
              >
                <!--              选择设备类型-->
                <div>
                  <el-form-item
                    label="设备型号:"
                    label-width="100px"
                    prop="category"
                  >
                    <el-select
                      style="width: 300px"
                      placeholder="请选择设备型号"
                      v-model="addForm.category"
                      :disabled="canNotEdit"
                    >
                      <el-option
                        v-for="items in typeList"
                        :label="items.name"
                        :value="items.name"
                        :key="items.id"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <!--              设备SN-->
                <el-form-item
                  label="DeviceSN:"
                  prop="deviceSn"
                >
                  <el-input
                    placeholder="6位数字"
                    :maxlength="6"
                    v-model.number="addForm.deviceSn"
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <!--              设备key-->
                <el-form-item
                  label="ProductKey:"
                  prop="key"
                >
                  <el-input
                    placeholder="6位数字"
                    :maxlength="6"
                    v-model.number="addForm.key"
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <!--              备注-->
                <el-form-item label="备注:">
                  <el-input
                    type="text"
                    placeholder="请输入内容"
                    v-model="addForm.remark"
                    :maxlength="30"
                    show-word-limit
                    :readonly="canNotEdit"
                  />
                </el-form-item>
              </el-form>
            </div>
            <!--            右侧详细信息-->
            <div>
              <p
                class="chooseDeviceType"
                style="margin-bottom: 10px"
              >
                详细信息
              </p>
              <table
                cellspacing="0"
                class="tableClass"
              >
                <tr>
                  <td>箱号</td>
                  <td>{{ addForm.tankSn }}</td>
                  <td>连接状态</td>
                  <td>
                    <i
                      :class="[addForm.connected?'el-icon-success':'el-icon-error',addForm.connected?'connected':'disconnected']"
                    />
                  </td>
                </tr>
                <tr style="background-color: #F5F7FA">
                  <td>更新时间</td>
                  <td colspan="3">
                    {{ addForm.updateTime|formatDate }}
                  </td>
                </tr>
                <tr>
                  <td>当前地址</td>
                  <td colspan="3">
                    {{ addForm.location }}
                  </td>
                </tr>
                <tr style="background-color: #F5F7FA">
                  <td>温度°C</td>
                  <td>{{ addForm.tankTemperature }}</td>
                  <td>压力Bar</td>
                  <td>{{ addForm.tankPressure }}</td>
                </tr>
                <tr>
                  <td>液位%</td>
                  <td>{{ addForm.tankLevel }}</td>
                  <td>电量%</td>
                  <td>{{ addForm.batteryLeft }}</td>
                </tr>
                <tr style="background-color: #F5F7FA">
                  <td>所属项目</td>
                  <td colspan="3">
                    {{ addForm.projectNames }}
                  </td>
                </tr>
              </table>
            </div>
            <!--              左下开关显示-->
            <div>
              <p
                class="chooseDeviceType"
                style="margin-bottom: 10px"
              >
                监控选项
              </p>
              <!--              表单2-->
              <el-form
                :model="addForm"
                label-width="100px"
                size="small"
                :disabled="canNotEdit"
                ref="ruleForm2"
                style="width: 400px;margin: 0 auto"
              >
                <!--              监控参数选择-->
                <div style="" />
                <el-form-item label="监控参数:">
                  <el-switch
                    active-color="#13ce66"
                    style="margin-right: 5px;margin-left: 5px"
                    inactive-color="#ff4949"
                    v-model="addForm.deviceTemp"
                  />
                  温度
                  <el-switch
                    active-color="#13ce66"
                    style="margin-right: 5px;margin-left: 5px"
                    inactive-color="#ff4949"
                    v-model="addForm.devicePressure"
                  />
                  压力
                  <el-switch
                    active-color="#13ce66"
                    style="margin-right: 5px;margin-left: 5px"
                    inactive-color="#ff4949"
                    v-model="addForm.deviceLevel"
                  />
                  液位
                </el-form-item>
                <el-form-item label="设备激活:">
                  <el-switch
                    active-color="#13ce66"
                    style="margin-right: 5px;margin-left: 5px"
                    inactive-color="#ff4949"
                    v-model="addForm.enabled"
                  />
                </el-form-item>
                <el-form-item label="设备日志:">
                  <el-switch
                    :active-value="1"
                    :inactive-value="0"
                    v-model="addForm.logEnabled"
                    style="margin-right: 5px;margin-left: 5px"
                  />
                  <span style="margin: 10px">日志等级</span>
                  <el-input-number
                    v-model.number="addForm.logLevel"
                    :readonly="canNotEdit"
                    size="mini"
                    :min="0"
                    :max="4"
                    style="width: 100px;margin-left: 12px"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <!--        分页2-->
        <el-tab-pane
          label="设备调试"
          name="second"
        >
          <div style="display: grid;grid-template-columns:1fr 1fr;">
            <!--            左侧区域-->
            <div style="float: left">
              <!--              表单3-->
              <el-form
                :model="addForm"
                :rules="addRules"
                size="mini"
                ref="ruleForm3"
                label-position="left"
                label-width="150px"
                hide-required-asterisk
                style="width: 30vw;margin: 0 auto"
              >
                <p
                  class="chooseDeviceType"
                  style="margin-bottom: 10px;transform: translate(-2vw)"
                >
                  罐箱信息
                </p>
                <el-form-item
                  label="内径mm"
                  prop="tankDiameter"
                >
                  <el-input
                    v-model="addForm.tankDiameter"
                    placeholder="请输入内径mm"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="长度mm"
                  prop="tankLength"
                >
                  <el-input
                    v-model="addForm.tankLength"
                    placeholder="请输入长度mm"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="大圆弧半径mm"
                  prop="tankCrownRadius"
                >
                  <el-input
                    v-model="addForm.tankCrownRadius"
                    placeholder="请输入大圆弧半径mm"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="小圆弧半径mm"
                  prop="tankKnuckleRadius"
                >
                  <el-input
                    v-model="addForm.tankKnuckleRadius"
                    placeholder="请输入小圆弧半径mm"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="封头深度mm"
                  prop="tankEndsEdpth"
                >
                  <el-input
                    v-model="addForm.tankEndsEdpth"
                    placeholder="请输入封头深度mm"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <p
                  class="chooseDeviceType"
                  style="margin-bottom: 10px;transform: translate(-2vw)"
                >
                  显示屏调试
                </p>
                <el-form-item
                  label="温度单位"
                  prop="temperatureUnit"
                >
                  <el-select
                    v-model="addForm.temperatureUnit"
                    placeholder="℃/℉"
                    :disabled="canNotEdit"
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="(item, index) in temperatureUnitOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="压力单位"
                  prop="pressureUnit"
                >
                  <el-select
                    v-model="addForm.pressureUnit"
                    placeholder="Bar/PSI"
                    :disabled="canNotEdit"
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="(item, index) in pressureUnitOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="液位单位"
                  prop="levelUnit"
                >
                  <el-select
                    v-model="addForm.levelUnit"
                    placeholder="cm/m³"
                    :disabled="canNotEdit"
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="(item, index) in levelUnitOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="屏幕背光"
                  prop="backlight"
                >
                  <el-select
                    v-model="addForm.backlight"
                    placeholder="请选择屏幕背光"
                    :disabled="canNotEdit"
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="(item, index) in backlightOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <!--                todo 尚未实现-->
                <p
                  class="chooseDeviceType"
                  style="margin-bottom: 10px;transform: translate(-2vw)"
                >
                  固件更新
                </p>
                <el-form-item label="固件版本">
                  <p style="margin: 0;color: #FA675C;font-size: 14px;font-weight: 400;">
                    当前版本&nbsp;<span
                      style="font-weight: bold;"
                    >{{ addForm.firmwareVersion|filters1 }}</span>
                  </p>
                </el-form-item>
                <el-form-item
                  label="选择固件"
                  prop="backlight"
                >
                  <el-select
                    placeholder="Todo"
                    :disabled="true"
                    :style="{width: '100%'}"
                    value="Todo"
                  />
                </el-form-item>
              </el-form>
            </div>
            <!--            右侧区域-->
            <div>
              <!--              表单4-->
              <el-form
                :model="addForm"
                :rules="addRules"
                ref="ruleForm4"
                size="mini"
                label-position="left"
                label-width="150px"
                hide-required-asterisk
                style="width: 30vw;margin: 0 auto"
              >
                <p
                  class="chooseDeviceType"
                  style="margin-bottom: 10px;transform: translate(-2vw)"
                >
                  系统设置
                </p>
                <el-form-item
                  label="PT1000校准电阻 Ω"
                  prop="pt1000BalanceResistor"
                >
                  <el-input
                    v-model="addForm.pt1000BalanceResistor"
                    placeholder="请输入PT1000校准电阻 Ω"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="PT1000修正系数 a"
                  prop="pt1000A"
                >
                  <el-input
                    v-model="addForm.pt1000A"
                    placeholder="请输入PT1000修正系数 a"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="PT1000修正系数 b"
                  prop="pt1000B"
                >
                  <el-input
                    v-model="addForm.pt1000B"
                    placeholder="请输入PT1000修正系数 b"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="温度刷新周期 s"
                  prop="temperatureInterval"
                >
                  <el-input
                    v-model="addForm.temperatureInterval"
                    placeholder="请输入温度刷新周期 s"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="液位刷新周期 s"
                  prop="levelInterval"
                >
                  <el-input
                    v-model="addForm.levelInterval"
                    placeholder="请输入液位刷新周期 s"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="压力刷新周期 s"
                  prop="pressureInterval"
                >
                  <el-input
                    v-model="addForm.pressureInterval"
                    placeholder="请输入压力刷新周期 s"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="GPS工作周期 s"
                  prop="gpsInterval"
                >
                  <el-input
                    v-model="addForm.gpsInterval"
                    placeholder="请输入GPS工作周期 s"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="基站通讯周期 s"
                  prop="commInterval"
                >
                  <el-input
                    v-model="addForm.commInterval"
                    placeholder="请输入基站通讯周期 s"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="最大工作时长 s"
                  prop="maxWorkTime"
                >
                  <el-input
                    v-model="addForm.maxWorkTime"
                    placeholder="请输入最大工作时长 s"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="记录保存间隔 min"
                  prop="recordSaveInterval"
                >
                  <el-input
                    v-model="addForm.recordSaveInterval"
                    placeholder="请输入记录保存间隔 min"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="撞击门限 g"
                  prop="acceleratorWakeupThreshold"
                >
                  <el-input
                    v-model="addForm.acceleratorWakeupThreshold"
                    placeholder="请输入撞击门限 g"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="低液位报警 %"
                  prop="lowAlarm"
                >
                  <el-input
                    v-model="addForm.lowAlarm"
                    placeholder="请输入低液位报警 %"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="高液位报警 %"
                  prop="highAlarm"
                >
                  <el-input
                    v-model="addForm.highAlarm"
                    placeholder="请输入高液位报警 %"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
                <el-form-item
                  label="空液转换 mm"
                  prop="autoLevelConvert"
                >
                  <el-input
                    v-model="addForm.autoLevelConvert"
                    placeholder="请输入空液转换 mm"
                    clearable
                    :readonly="canNotEdit"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <!--        分页3-->
        <el-tab-pane
          label="设备日志"
          name="third"
          :disabled="!canNotEdit"
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
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'DeviceDetail',
  data () {
    return {
      activeTabs: 'first',
      deviceRawId: undefined,
      selectDate: [undefined, undefined],
      formData: {
        keywords: ''
      },
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
                    case 'at':
                      sort.property = 0
                      break
                    case 'operationType':
                      sort.property = 1
                      break
                    case 'operatedName':
                      sort.property = 2
                      break
                    case 'operatedValue':
                      sort.property = 3
                      break
                    case 'oldValue':
                      sort.property = 4
                      break
                    case 'operator':
                      sort.property = 5
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
              console.log('时间值为', this.selectDate)
              if (this.selectDate === null) this.selectDate = []
              queryParams = Object.assign(queryParams, {
                id: this.addForm.id,
                startAt: `${this.selectDate[0] / 1000}`,
                endAt: `${this.selectDate[1] / 1000}`
              })
              queryParams = Object.assign(queryParams, { currentPage: page.currentPage - 1, pageSize: page.pageSize })
              console.log('请求值3', queryParams)
              // 请求数据
              const response = await this.$http.post('device/operation/history/list', queryParams).catch((error) => {
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
          { field: 'at', title: '更改时间', remoteSort: true, minWidth: 180, align: 'center', formatter: this.formatDate2 },
          { field: 'operationType', title: '操作类型', remoteSort: true, minWidth: 180, align: 'center' },
          { field: 'operatedName', title: '操作参数', remoteSort: true, minWidth: 100 },
          { field: 'operatedValue', title: '修改数值', remoteSort: true, minWidth: 100 },
          { field: 'oldValue', title: '原数值', remoteSort: true, minWidth: 100 },
          { field: 'operator', title: '操作账户', remoteSort: true, minWidth: 100 }
        ]
      },
      addFormTemp: {},
      canNotEdit: true,
      changeStatus: 0,
      addForm: {
        deviceSn: undefined,
        id: undefined,
        tankSn: undefined,
        projectNames: undefined,
        category: undefined,
        firmwareVersion: undefined,
        lastUpgradeTime: undefined,
        key: undefined,
        remark: undefined,
        enabled: undefined,
        logEnabled: undefined,
        temperatureInterval: undefined,
        levelInterval: undefined,
        pressureInterval: undefined,
        gpsInterval: undefined,
        commInterval: undefined,
        maxWorkTime: undefined,
        recordSaveInterval: undefined,
        acceleratorWakeupThreshold: undefined,
        pressureUnit: undefined,
        temperatureUnit: undefined,
        levelUnit: undefined,
        backlight: undefined,
        pt1000BalanceResistor: undefined,
        pt1000A: undefined,
        pt1000B: undefined,
        tankType: undefined,
        tankDiameter: undefined,
        tankLength: undefined,
        tankCrownRadius: undefined,
        tankKnuckleRadius: undefined,
        tankEndsEdpth: undefined,
        tankEndsType: undefined,
        lowAlarm: undefined,
        highAlarm: undefined,
        autoLevelConvert: undefined,
        logLevel: undefined,
        updateTime: undefined,
        lat: undefined,
        lon: undefined,
        location: undefined,
        tankTemperature: undefined,
        tankPressure: undefined,
        tankLevel: undefined,
        batteryLeft: undefined,
        connected: undefined
      },
      typeList: undefined,
      logLevelOptions: [
        { label: 1 },
        { label: 2 },
        { label: 3 },
        { label: 4 }
      ],
      temperatureUnitOptions: [{
        label: '℃',
        value: 0
      }, {
        label: '℉',
        value: 1
      }],
      pressureUnitOptions: [{
        label: 'Bar',
        value: 0
      }, {
        label: 'PSI',
        value: 1
      }],
      levelUnitOptions: [{
        label: 'cm',
        value: 0
      }, {
        label: 'm³',
        value: 1
      }],
      backlightOptions: [{
        label: 'OFF',
        value: 0
      }, {
        label: 'AUTO',
        value: 1
      }, {
        label: 'ON',
        value: 2
      }]
    }
  },
  computed: {
    scrollerHeight: function () {
      return (window.innerHeight - 250) + 'px'
    },
    addRules () {
      return {
        deviceSn: [
          { required: true, message: '请输入设备SN', trigger: 'change' },
          { pattern: /^\d{6}|0$/, message: '设备SN为6位数字', trigger: 'change' }],
        key: [
          { required: true, message: '请输入设备ProductKey', trigger: 'change' },
          { pattern: /^\d{6}|0$/, message: 'ProductKey为6位数字', trigger: 'change' }],
        pt1000BalanceResistor: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        pt1000A: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        pt1000B: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        temperatureInterval: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        levelInterval: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        pressureInterval: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        gpsInterval: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        commInterval: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        maxWorkTime: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        recordSaveInterval: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        acceleratorWakeupThreshold: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        lowAlarm: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        highAlarm: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        autoLevelConvert: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        tankDiameter: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        tankLength: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        tankCrownRadius: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        tankKnuckleRadius: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        tankEndsEdpth: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        temperatureUnit: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        levelUnit: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        pressureUnit: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }],
        backlight: [{ required: true, message: '不能为空', trigger: 'change' },
          { pattern: /^[1-9]\d*|0$/, message: '此处为数字', trigger: 'change' }]
      }
    }
  },
  methods: {
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    queryTime () {
      console.log(this.selectDate)
      this.$refs.xGrid.commitProxy('query')
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    async requestDevice () {
      const response = await this.$http.post('/device/category/list').then(this.$XModal.message({
        message: '设备类型请求成功',
        status: 'success'
      })).catch(error => {
        this.$XModal.message({ message: `设备类型请求失败@${error}`, status: 'warning' })
      })
      this.typeList = response.data.data
      console.log('列表', this.typeList)
    },
    // 验证所有表单
    async saveEdit () {
      console.log('当前表单内容', this.addForm)
      console.log('原始表单内容', this.addFormTemp)
      await Promise.all([
        this.$refs.ruleForm1.validate(),
        this.$refs.ruleForm2.validate(),
        this.$refs.ruleForm3.validate(),
        this.$refs.ruleForm4.validate()
      ]).then(() => {
        this.canNotEdit = true
        this.$http.post('/device/edit', this.addForm).then(async response => {
          console.log('test', response.data)
          if (response.data.code !== 0) {
            this.$XModal.message({ message: `修改错误@${response.data.message}`, status: 'warning', id: '2' })
            this.addForm = this.addFormTemp // 若修改错误，恢复初始数据
          } else {
            console.log('请求设备代码', this.$route.query.sn)
            await this.$router.push({ query: { sn: this.addForm.deviceSn } })
            //    this.$route.query.sn = this.addForm.deviceSn // 将query值修改为修改后的值
            await this.getDeviceDetail(this.addForm.deviceSn)
            this.$XModal.message({ message: '修改成功', status: 'success', id: '3' })
            console.log('提交内容为', this.addForm)
          }
        }).catch(error => console.log(error))
      }).catch(() => {
        this.$XModal.message({ message: '配置错误,检查后重试', status: 'warning', id: '1' })
      })
    },
    quitEdit () {
      this.addForm = this.addFormTemp // 若放弃修改，将原始表单恢复
      this.$refs.ruleForm1.resetFields()
      this.$refs.ruleForm2.resetFields()
      this.$refs.ruleForm3.resetFields()
      this.$refs.ruleForm4.resetFields()
      this.canNotEdit = true
    },
    editDevice () {
      this.activeTabs = 'second'
      if (this.typeList === undefined) this.requestDevice() // 请求设备类型
      this.canNotEdit = false // 取消不可编辑状态
      this.addFormTemp = JSON.parse(JSON.stringify(this.addForm)) // 点击编辑时暂存原始数据
    },
    // 请求设备详情
    async getDeviceDetail (sn) {
      const deviceDetail = await this.$http.post('/device/detail', { sn: sn })
      this.addForm = deviceDetail.data.data
      await this.$refs.xGrid.commitProxy('query')
      console.log('设备详情', this.addForm)
    }
  },
  mounted () {
    this.getDeviceDetail(this.$route.query.sn)
  },
  filters: {
    filters1 (value) {
      if (value) {
        return value
      } else return '无数据'
    },
    formatDate (value) {
      if (value) {
        return XEUtils.toDateString(value, 'yyyy/MM/dd/ HH:mm:ss')
      }
    }
  }
}
</script>

<style scoped>
/deep/ .el-date-editor .el-range__icon {
  color: blue;
}

/deep/ .el-card__body {
  padding-bottom: 0;
}

.chooseDeviceType {
  margin: 0;
  font-size: 18px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold, monospace;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

.tableClass {
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
  width: 100%;
}

.tableClass td {
  width: 1px;
  white-space: nowrap; /* 自适应宽度*/
  word-break: keep-all; /* 避免长单词截断，保持全部 */
  padding: 5px 10px;
}

table, table tr th, table tr td {
  border: 1px solid #D8D8D8;
}

.connected {
  color: green;
}

.disconnected {
  color: red;
}
</style>
