<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('createMonitor.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('createMonitor.monitorSetting') }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/monitoring'}">
        {{ $t('createMonitor.monitorList') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('createMonitor.createMonitor') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            {{ $t('createMonitor.createMonitor') }}
          </h1>
          <div style="margin: 0 auto;width: 150px">
            <el-button
              size="small"
              type="primary"
              @click="submitForm"
            >
              {{ $t('createMonitor.submit') }}
            </el-button>
            <el-button
              @click="resetForm"
              size="small"
            >
              {{ $t('createMonitor.reset') }}
            </el-button>
          </div>
        </div>
      </div>
      <!--      主体表格-->
      <div style="display: grid;grid-template-columns: 1fr 1fr;justify-content: start;align-items: start;grid-column-gap: 50px">
        <div style="width: 100%">
          <el-row>
            <el-form
              size="mini"
              style="margin-left: 20px"
              :hide-required-asterisk="true"
              ref="addMonitorForm"
              :model="addMonitorForm"
              :rules="GroupForm"
              label-width="100px"
              label-position="left"
            >
              <el-col :span="18">
                <el-form-item
                  :label="$t('createMonitor.monitorName')"
                  prop="name"
                >
                  <el-input
                    v-model="addMonitorForm.name"
                    :placeholder="$t('createMonitor.inputMonitorName')"
                    clearable
                    :style="{width: '100%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label-width="0"
                  style="margin-left: 20px"
                  prop="enabled"
                  required
                >
                  <el-switch
                    v-model="addMonitorForm.enabled"
                    :active-text="$t('createMonitor.startUsing')"
                    active-color="#33B892"
                    inactive-color="#FF0000"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.description')"
                  prop="description"
                >
                  <el-input
                    v-model="addMonitorForm.description"
                    :placeholder="$t('createMonitor.inputDescription')"
                    clearable
                    :style="{width: '100%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.monitorParameter')"
                  prop="alarmParameter"
                >
                  <el-select
                    v-model="addMonitorForm.alarmParameter"
                    :placeholder="$t('createMonitor.InputMonitorParameter')"
                    clearable
                    @change="changeRange"
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="(item, index) in alarmParameterOptions"
                      :key="index"
                      :label="item|setParameter"
                      :value="item"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.warningThreshold')"
                  prop="range"
                  required
                >
                  <p style="margin: 0;color: #006af1;font-weight: bold">
                    {{ addMonitorForm.range[0] }}-{{ addMonitorForm.range[1] }} {{ addMonitorForm.alarmParameter|setParameterValue }}
                  </p>
                  <el-slider
                    :max="rangeMax"
                    :min="rangeMin"
                    :step="rangeStep"
                    v-model="addMonitorForm.range"
                    range
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.alarmCycle')"
                  prop="timeRange"
                >
                  <el-date-picker
                    type="daterange"
                    v-model="addMonitorForm.timeRange"
                    format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    value-format="timestamp"
                    :style="{width: '100%'}"
                    start-placeholder="YY-MM-DD"
                    end-placeholder="YY-MM-DD"
                    range-separator="-"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <!--              <el-col :span="2">-->
              <!--                <el-tooltip-->
              <!--                  class="item"-->
              <!--                  effect="dark"-->
              <!--                  content="若此处为空,则此监控规则永久生效"-->
              <!--                  placement="right"-->
              <!--                >-->
              <!--                  <i-->
              <!--                    class="el-icon-question"-->
              <!--                    style="margin-left: 10px;line-height: 30px"-->
              <!--                  />-->
              <!--                </el-tooltip>-->
              <!--              </el-col>-->
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.alarmFrequency')"
                  prop="frequency"
                >
                  <el-input-number
                    :min="7200"
                    :max="72000"
                    controls-position="right"
                    v-model="addMonitorForm.frequency"
                    placeholder="s"
                    :step="1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.alarmEmail')"
                  prop="emails"
                >
                  <el-input
                    v-model="addMonitorForm.emails"
                    :placeholder="$t('createMonitor.inputAlarmEmail')"
                    clearable
                    :style="{width: '100%'}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  :label="$t('createMonitor.alarmPhoneNumber')"
                  :prop="'phones.' + index + '.value'"
                  v-for="(item,index) in addMonitorForm.phones"
                  :key="item.key"
                  :rules="[{
                    pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: $t('createMonitor.errorPhone'), trigger: 'blur'
                  }]"
                >
                  <el-input
                    v-model="item.value"
                    :placeholder="$t('createMonitor.inputAlarmPhoneNumber')"
                    clearable
                    :style="{width: '100%',marginBottom:'10px'}"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                style=" white-space:nowrap;"
              >
                <i
                  style="margin-left: 5px;color: #33B892;font-size: 20px;line-height: 30px;cursor:pointer"
                  class="el-icon-circle-plus"
                  @click="addMonitorPhones"
                />
                <i
                  style="color: #FA675C;font-size: 20px;line-height: 30px;cursor:pointer"
                  v-if="addMonitorForm.phones.length>1"
                  class="el-icon-remove"
                  @click="deleteMonitorPhones()"
                />
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-card style="width: 100%">
          <vxe-grid
            row-id="sn"
            :header-cell-style="headerCellStyle"
            ref="xGrid"
            height="400px"
            v-bind="gridOptions"
            highlight-hover-row
            highlight-current-row
            highlight-hover-column
            highlight-current-column
            size="mini"
          >
            <!--            顶部模板-->
            <template v-slot:toolbar_buttons_left>
              <div>
                <span style="font-weight: bold;color: #006af1;font-size: 18px">{{ $t('createMonitor.selectTank') }}:</span>
              </div>
            </template>
            <!--搜索-->
            <template v-slot:tools>
              <vxe-form
                :data="formData"
                @submit="searchEvent"
                style="padding: 0"
              >
                <vxe-form-item
                  field="keywords"
                  :item-render="{name: 'input', attrs: {placeholder: $t('createMonitor.inputName')}}"
                />
                <vxe-form-item
                  :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: $t('createMonitor.search'), status: 'primary' } }] }"
                />
              </vxe-form>
            </template>
            <!--自定义空数据模板-->
            <template v-slot:empty>
              <p style="color: #2F74EB;">
                {{ $t('createMonitor.noTankAvailable') }}
              </p>
            </template>
          </vxe-grid>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  name: 'CreateMonitor',
  data () {
    return {
      rangeStep: 1,
      rangeMax: 100,
      rangeMin: -20,
      addMonitorForm: {
        alarmParameter: 'TEMPERATURE',
        enabled: true,
        name: undefined,
        description: undefined,
        range: [11, 56],
        timeRange: [],
        frequency: 7200,
        emails: undefined,
        phones: [
          { value: '' }
        ]
      },
      GroupForm: {
        alarmParameter: [{
          required: true,
          message: `${this.$t('createMonitor.selectMonitorParameter')}`,
          trigger: 'change'
        }],
        name: [{
          required: true,
          message: `${this.$t('createMonitor.inputMonitorName')}`,
          trigger: 'blur'
        }],
        frequency: [{
          required: true,
          message: `${this.$t('createMonitor.inputFrequency')}`,
          trigger: 'blur'
        }],
        timeRange: [{
          required: true,
          message: `${this.$t('createMonitor.inputTimeRange')}`,
          trigger: 'blur'
        }],
        emails: [{
          required: true,
          message: `${this.$t('createMonitor.inputEmail')}`,
          trigger: 'blur'
        },
        { pattern: /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\,))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/, message: `${this.$t('createMonitor.errorEmail')}`, trigger: 'blur' }]//eslint-disable-line
      },
      alarmParameterOptions: [],
      formData: {
        keywords: ''
      },
      gridOptions: {
        toolbarConfig: {
          refresh: true,
          slots: {
            buttons: 'toolbar_buttons_left',
            tools: 'tools'
          }
        },
        checkboxConfig: {
          reserve: true
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
        resizable: true,
        showOverflow: true,
        border: true,
        sortConfig: {
          remote: true,
          trigger: 'default',
          defaultSort: {
            field: 'deviceSn',
            order: 'desc'
          }
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: true, // 启用筛选代理
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
              const response = await this.$http.post('/tank/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `${this.$t('createMonitor.requestFailed')}@${error}`, status: 'error', size: 'medium' })
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
        columns: [
          { type: 'checkbox', width: 50, align: 'center' },
          { field: 'sn', title: `${this.$t('createMonitor.tankNo')}`, minWidth: 30 },
          { field: 'deviceSn', title: `${this.$t('createMonitor.deviceID')}`, minWidth: 30 }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.addMonitorForm.validate(valid => {
        if (!valid) return
        console.log(this.addMonitorForm)
        const deviceSn = [...this.$refs.xGrid.getCheckboxRecords(), ...this.$refs.xGrid.getCheckboxReserveRecords()]
          .map(item => { return item.deviceSn }).join(';')
        console.log(deviceSn)
        const phones = this.addMonitorForm.phones.map(item => { return item.value }).join(',')
        const boundMin = this.addMonitorForm.range[0]
        const boundMax = this.addMonitorForm.range[1]
        const duration = this.addMonitorForm.timeRange.map(item => { if (item) return item / 1000 })
        this.$http.post('/alarm/config/create', {
          name: this.addMonitorForm.name,
          deviceSn: deviceSn,
          alarmParameter: this.addMonitorForm.alarmParameter,
          boundMin: boundMin,
          boundMax: boundMax,
          phones: phones,
          description: this.addMonitorForm.description,
          startAt: duration[0],
          endAt: duration[1],
          emails: this.addMonitorForm.emails,
          frequency: this.addMonitorForm.frequency,
          enabled: this.addMonitorForm.enabled
        }).then(response => {
          if (response.data.code === 0) {
            VXETable.modal.message({ message: `${this.$t('createMonitor.monitorCreateSuccess')}`, status: 'success' })
            this.$router.push('/monitoring')
          } else {
            VXETable.modal.message({ message: `${this.$t('createMonitor.createFailed')}@${response.data.message}`, status: 'error' })
          }
        })
      })
    },
    resetForm () {
      this.$refs.addMonitorForm.resetFields()
    },
    deleteMonitorPhones () {
      this.addMonitorForm.phones.pop()
    },
    addMonitorPhones () {
      if (this.addMonitorForm.phones.length < 5) {
        this.addMonitorForm.phones.push({ value: '', key: Date.now() })
      } else {
        VXETable.modal.message({ message: `${this.$t('createMonitor.MaxFiveContact')}`, status: 'error', size: 'medium', id: 'unique' })
      }
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    async   getAllTanks () {
      const test = await this.$http.post('tank/list', {
        currentPage: 0,
        keywords: '',
        order: 'DESC',
        orderColumnIndex: 0,
        pageSize: 9999
      })
      console.log(test)
    },
    changeRange (item) {
      console.log(item)
      switch (item) {
        case 'TEMPERATURE':
          this.rangeMax = 250
          this.rangeMin = -50
          this.rangeStep = 0.1
          break
        case 'LEVEL':
          this.rangeMax = 3000
          this.rangeMin = 0
          this.rangeStep = 100
          break
        case 'PRESSURE':
          this.rangeMax = 4
          this.rangeMin = 0
          this.rangeStep = 0.1
          break
      }
    },
    async getAlarmParameter () {
      const result = await this.$http.post('/alarm/parameters')
      console.log(result)
      this.alarmParameterOptions = result.data.data
      console.log(this.alarmParameterOptions)
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    }
  },
  filters: {
    setParameter (item) {
      if (window.localStorage.getItem('lang') === 'zh') {
        if (item === 'LEVEL') {
          item = '液位'
          return item
        } else if (item === 'TEMPERATURE') {
          item = '温度'
          return item
        } else if (item === 'PRESSURE') {
          item = '压力'
          return item
        }
      }
    },
    setParameterValue (item) {
      if (item === 'LEVEL') {
        item = 'mm'
        return item
      } else if (item === 'TEMPERATURE') {
        item = '℃'
        return item
      } else if (item === 'PRESSURE') {
        item = 'Bar'
        return item
      } else {
        item = '℃'
        return item
      }
    }
  },
  mounted () {
    this.getAllTanks()
    this.getAlarmParameter()
  },
  computed: {
    pickerOptions () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
