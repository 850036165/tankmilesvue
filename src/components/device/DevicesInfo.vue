<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/device' }">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ this.$route.query.id }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <h1 style="margin: 0;display: inline-block">设备详情</h1>
        <el-button style="float: right;" type="primary" size="mini">编辑</el-button>
      </div>
      <el-tabs active-name="first">
        <!--        分页1-->
        <el-tab-pane label="基础信息" name="first">
          <div style="width: 50%;float: left;height: 375px">
            <el-form status-icon style="width: 400px" :model="addForm" size="medium" :rules="addRules" ref="ruleForm"
                     disabled>
              <!--              选择设备类型-->
              <div>
                <el-form-item label="设备类型:" label-width="100px" prop="deviceType">
                  <el-select style="width: 300px" placeholder="请选择设备类型" v-model="addForm.deviceType">
                    <el-option v-for="items in typeList" :label="items.label" :value="items.value"
                               :key="items.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!--              选择项目-->
              <el-form-item label="所属项目:" label-width="100px">
                <el-cascader
                  placeholder="请选择项目"
                  v-model="addForm.deviceProject"
                  filterable
                  style="width: 300px"
                  :options="options"
                  :props="props"
                  collapse-tags
                  clearable></el-cascader>
              </el-form-item>
              <!--              设备名称-->
              <el-form-item label="设备名称:" label-width="100px" prop="deviceName">
                <el-input placeholder="5-20位" :maxlength="20" v-model="this.$route.query.id"></el-input>
              </el-form-item>
              <!--              设备SN-->
              <el-form-item label="DeviceSN:" label-width="100px" prop="deviceSN">
                <el-input placeholder="12位数字" :maxlength="20" v-model.number="addForm.deviceSN"></el-input>
              </el-form-item>
              <!--              设备key-->
              <el-form-item label="ProductKey:" label-width="100px" prop="productKey">
                <el-input placeholder="12位数字" :maxlength="20" v-model.number="addForm.productKey"></el-input>
              </el-form-item>
              <!--              备注-->
              <el-form-item label="备注:" label-width="100px">
                <el-input
                  type="text"
                  placeholder="请输入内容"
                  v-model="addForm.deviceTxt"
                  :maxlength="30"
                  show-word-limit>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="width: 50%;float: right;">
            <el-tooltip effect="dark" placement="bottom-end">
              <div slot="content">*部分为必填<br/>SN/ProductKey为数字<br/>监控参数至少选择一项</div>
              <i class="el-icon-warning-outline" style="font-size: 20px;float: right;margin: 10px;cursor: pointer"></i>
            </el-tooltip>
            <el-form style="width: 300px" :model="addForm" size="medium" disabled>
              <!--              监控参数选择-->
              <el-form-item label="监控参数:" label-width="100px">
                <el-checkbox-group :min="1" v-model="addForm.checkedFunction">
                  <el-checkbox label="deviceTemp" checked>设备温度</el-checkbox>
                  <el-checkbox label="level">液位</el-checkbox>
                  <el-checkbox label="temp">介质温度</el-checkbox>
                  <el-checkbox label="pressure">压力</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!--              激活开关选择-->
              <el-form-item label="设备激活:" label-width="100px">
                <el-switch active-color="#13ce66"
                           inactive-color="#ff4949"
                           v-model="addForm.deviceState"></el-switch>
              </el-form-item>
              <el-form-item label="设备日志:" label-width="100px">
                <el-switch
                  v-model="addForm.deviceLog"
                ></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--        分页2-->
        <el-tab-pane label="设备调试" name="second">
          <div style="width: 50%;float: left;height: 375px">
            <div style="margin-left: 50px;display: flex;align-items: center">
              <p style="margin-right: 5px;font-weight: bold;">设备调试</p>
              <el-tooltip effect="dark" content="工作模式设置/数字格式" placement="right">
                <i class="el-icon-warning-outline" style="font-size: 20px;cursor: pointer"></i>
              </el-tooltip>
            </div>
            <el-form style="width: 300px" size="small" :model="addForm" :rules="addRules" ref="ruleForm" disabled>
              <el-form-item label="休眠时间(s):" label-width="150px" prop="restTime">
                <el-input-number :min="1" :max="99" v-model.number="addForm.restTime"></el-input-number>
              </el-form-item>
              <el-form-item label="GPS周期(s):" label-width="150px" prop="gpsTime">
                <el-input-number :min="1" :max="99" v-model.number="addForm.gpsTime"></el-input-number>
              </el-form-item>
              <el-form-item label="通讯基站周期(s):" label-width="150px" prop="cellTime">
                <el-input-number :min="1" :max="99" v-model.number="addForm.cellTime"></el-input-number>
              </el-form-item>
              <el-form-item label="最大工作时间(s):" label-width="150px" prop="maxJobTime">
                <el-input-number :min="1" :max="99" v-model.number="addForm.maxJobTime"></el-input-number>
              </el-form-item>
              <el-form-item label="低液位报警(mm):" label-width="150px" prop="minLevelAlert">
                <el-input-number controls-position="right" :min="1" :max="3000" :step="100"
                                 v-model.number="addForm.minLevelAlert"></el-input-number>
              </el-form-item>
              <el-form-item label="高液位报警(mm):" label-width="150px" prop="maxLevelAlert">
                <el-input-number controls-position="right" :min="3001" :max="5000" :step="100"
                                 v-model.number="addForm.maxLevelAlert"></el-input-number>
              </el-form-item>
            </el-form>
          </div>
          <div style="width: 50%;float: right;">
            <div style="display: flex;align-items: center">
              <p style="margin-right: 5px;font-weight: bold;">显示屏调试</p>
              <el-tooltip effect="dark" content="屏幕显示设置" placement="right">
                <i class="el-icon-warning-outline" style="font-size: 20px;cursor: pointer"></i>
              </el-tooltip>
            </div>
            <el-form style="width: 400px" size="small" :model="addForm">
              <el-form-item label="压力单位:">
                <el-radio-group v-model="addForm.pressureUnit">
                  <el-radio :label="1">PSI</el-radio>
                  <el-radio :label="2">BAR</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="温度单位:" prop="checkEmpty">
                <el-radio-group v-model="addForm.temperatureUnit">
                  <el-radio :label=1>°C</el-radio>
                  <el-radio :label=2>°F</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="液位单位:" prop="checkEmpty">
                <el-radio-group v-model="addForm.levelUnit">
                  <el-radio :label=1>%</el-radio>
                  <el-radio :label=2>mm</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="屏幕常亮:" prop="checkEmpty">
                <el-radio-group v-model="addForm.screenOn">
                  <el-radio :label=1>常亮</el-radio>
                  <el-radio :label=2>自动</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--        分页3-->
        <el-tab-pane label="设备日志" name="third">
        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>

<script>
export default {
  name: 'DevicesInfo',
  data() {
    return {
      changeStatus: 0,
      ruleForm: {
        deviceName: '',
        deviceType: '',
        deviceSN: '',
        restTime: '',
        gpsTime: '',
        cellTime: '',
        maxJobTime: '',
        minLevelAlert: '',
        maxLevelAlert: ''
      },
      props: {
        checkStrictly: true,
        multiple: true,
        value: 'value',
        label: 'label',
        children: 'children'
      },
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
      addForm: {
        deviceType: '',
        deviceSN: '',
        deviceName: '',
        productKey: '',
        deviceState: true,
        deviceProject: '',
        deviceTxt: '',
        deviceLog: true,
        checkedFunction: [],
        restTime: 5,
        gpsTime: 10,
        cellTime: 15,
        maxJobTime: 99,
        minLevelAlert: 2000,
        maxLevelAlert: 3000,
        pressureUnit: 2,
        temperatureUnit: 1,
        levelUnit: 1,
        screenOn: 1
      },
      typeList: [
        {value: 1, label: 'tanktrac'},
        {value: 2, label: 'smartflank'},
        {value: 3, label: 'fleettrac'},
        {value: 4, label: 'cargotrac'},
        {value: 5, label: 'heatingsystem'}
      ]
    }
  },
  computed: {
    addRules() {
      return {
        deviceName: [
          {required: true, message: '请输入设备名称', trigger: 'blur'},
          {min: 5, max: 20, message: '设备名称为5到20字符', trigger: 'blur'}
        ],
        deviceType: [
          {required: true, message: '请选择设备类型', trigger: 'change'}
        ],
        deviceSN: [
          {required: true, message: '请输入设备SN', trigger: 'blur'},
          {type: 'number', message: 'SN为数字格式', trigger: 'blur'},
          {pattern: /^\d{12}$/, message: '设备SN为12位数字', trigger: 'blur'}
        ],
        productKey: [
          {required: true, message: '请输入设备ProductKey', trigger: 'blur'},
          {type: 'number', message: 'ProductKey为数字格式', trigger: 'blur'},
          {pattern: /^\d{12}$/, message: 'ProductKey为12位数字', trigger: 'blur'}
        ],
        restTime: [
          {required: true, message: '此处不能为空', trigger: 'blur'}
        ],
        gpsTime: [
          {required: true, message: '此处不能为空', trigger: 'blur'}
        ],
        cellTime: [
          {required: true, message: '此处不能为空', trigger: 'blur'}
        ],
        maxJobTime: [
          {required: true, message: '此处不能为空', trigger: 'blur'}
        ],
        minLevelAlert: [
          {required: true, message: '此处不能为空', trigger: 'blur'}
        ],
        maxLevelAlert: [
          {required: true, message: '此处不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    addForm: {
      handler() {
        this.watchChange()
      },
      deep: true
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.changeStatus >= 2) {
      setTimeout(() => {
        this.$confirm('检测到未保存的信息，是否保存修改？', '确认信息', {
          closeOnClickModal: false,
          confirmButtonText: '确认离开',
          cancelButtonText: '留在此页',
          type: 'warning'
        }).then(() => {
          next(true)
        }).catch(() => {
            next(false)
          }
        )
      }, 100)
    } else {
      next(true)
    }
  },
  methods: {
    watchChange() {
      this.changeStatus = this.changeStatus + 1
      console.log(this.changeStatus)
    },
    addDevices() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$message.error({
            title: '错误',
            message: '请检查所有必填项',
            center: 'true'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
/deep/ .el-card__body {
  padding-bottom: 0;
}
</style>
