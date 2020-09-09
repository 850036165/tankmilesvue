<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/device' }">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加设备</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="height: 550px">
      <div slot="header">
        <h1 style="margin: 0">添加设备</h1>
      </div>
      <p class="chooseDeviceType">
        设备类型
      </p>
      <div style="height: 80px;display: flex;justify-content: start;align-items: center">
        <div :class="deviceType1===1?'deviceType1':'deviceType2'" @click="chooseDeviceType1">
          <p :class="deviceType1===1?'deviceTypeText1':'deviceTypeText2'">罐程设备</p>
        </div>
        <div :class="deviceType1===2?'deviceType1':'deviceType2'" @click="chooseDeviceType2">
          <p :class="deviceType1===2?'deviceTypeText1':'deviceTypeText2'">第三方设备</p>
        </div>
      </div>
      <!--      罐程设备显示-->
      <div v-if="deviceType1===1">
        <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 300px">
          <!--          左侧详细信息显示-->
          <div>
            <p class="chooseDeviceType" style="margin-bottom: 10px">详细信息</p>
            <el-form status-icon label-width="100px" style="width: 400px;margin-left: 30px" :model="addForm"
                     :rules="addRules" ref="ruleForm">
              <!--              选择设备类型-->
              <div>
                <el-form-item label="设备型号:" label-width="100px" prop="category">
                  <el-select style="width: 300px" placeholder="请选择设备型号" v-model="addForm.category">
                    <el-option v-for="items in typeList" :label="items.name" :value="items.id"
                               :key="items.id"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!--              设备SN-->
              <el-form-item label="DeviceSN:" prop="sn">
                <el-input placeholder="6位数字" :maxlength="6" v-model.number="addForm.sn"></el-input>
              </el-form-item>
              <!--              设备key-->
              <el-form-item label="ProductKey:" prop="key">
                <el-input placeholder="6位数字" :maxlength="6" v-model.number="addForm.key"></el-input>
              </el-form-item>
              <!--              备注-->
              <el-form-item label="备注:">
                <el-input
                  type="text"
                  placeholder="请输入内容"
                  v-model="addForm.remark"
                  :maxlength="30"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <!--              右侧开关显示-->
          <div>
            <el-tooltip effect="dark" placement="bottom-end">
              <div slot="content">*部分为必填<br/>SN/ProductKey为数字<br/>若不激活设备则无法获取最新数据</div>
              <i class="el-icon-warning-outline" style="font-size: 20px;float: right;margin: 10px;cursor: pointer"></i>
            </el-tooltip>
            <p class="chooseDeviceType" style="margin-bottom: 10px">监控选项</p>
            <el-form :model="addForm" label-width="100px">
              <!--              监控参数选择-->
              <div style=""></div>
              <el-form-item label="监控参数:">
                <el-switch active-color="#13ce66"
                           style="margin-right: 5px;margin-left: 5px"
                           inactive-color="#ff4949"
                           v-model="addForm.deviceTemp"></el-switch>
                温度
                <el-switch active-color="#13ce66"
                           style="margin-right: 5px;margin-left: 5px"
                           inactive-color="#ff4949"
                           v-model="addForm.devicePressure"></el-switch>
                压力
                <el-switch active-color="#13ce66"
                           style="margin-right: 5px;margin-left: 5px"
                           inactive-color="#ff4949"
                           v-model="addForm.deviceLevel"></el-switch>
                液位
              </el-form-item>
              <el-form-item label="设备激活:">
                <el-switch active-color="#13ce66"
                           style="margin-right: 5px;margin-left: 5px"
                           inactive-color="#ff4949"
                           v-model="addForm.enabled"></el-switch>
              </el-form-item>
              <el-form-item label="设备日志:">
                <el-switch v-model="addForm.logEnabled" style="margin-right: 5px;margin-left: 5px"></el-switch>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div style="width: 100%;float: left;">
          <el-form style="display: flex;justify-content: flex-end" v-model="addForm">
            <el-form-item>
              <el-button type="primary" @click="addDevices">添加设备</el-button>
              <el-button @click="leavePage">取消返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--      第三方设备显示-->
      <!--      todo：待实现-->
      <div v-if="deviceType1===2">
        <p class="chooseDeviceType" style="margin-bottom: 10px">详细信息</p>
        <el-form status-icon label-width="100px" style="width: 400px;margin-left: 30px" :model="addForm2"
                 size="small" ref="ruleForm">
          <!--              选择设备类型-->
          <div>
            <el-form-item label="请求方式:" label-width="100px" prop="deviceType">
              <el-select style="width: 300px" placeholder="请选择请求方式" v-model="addForm2.requestType">
                <el-option v-for="items in requestType" :label="items.label" :value="items.value"
                           :key="items.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!--              设备名称-->
          <el-form-item label="请求地址:">
            <el-input :maxlength="20" v-model="addForm2.requestAddress"></el-input>
          </el-form-item>
          <!--              参数-->
          <el-form-item label="参数:">
            <el-input :maxlength="20" v-model.number="addForm2.requestParameter"></el-input>
          </el-form-item>
          <!--              备注-->
          <el-form-item label="备注:">
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="addForm2.deviceTxt"
              :maxlength="30"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    if (this.changeStatus >= 1) {
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
  computed: {
    addRules() {
      return {
        category: [
          {required: true, message: '请选择设备类型', trigger: 'change'}
        ],
        sn: [
          {required: true, message: '请输入设备SN', trigger: 'blur'},
          {type: 'number', message: 'SN为数字格式', trigger: 'blur'},
          {pattern: /^\d{6}$/, message: '设备SN为6位数字', trigger: 'blur'}
        ],
        key: [
          {required: true, message: '请输入设备ProductKey', trigger: 'blur'},
          {type: 'number', message: 'ProductKey为数字格式', trigger: 'blur'},
          {pattern: /^\d{6}$/, message: 'ProductKey为6位数字', trigger: 'blur'}
        ]
      }
    }
  },
  data() {
    return {
      cardHeight: 0,
      deviceType1: 1,
      changeStatus: 0,
      ruleForm: {
        category: '',
        sn: '',
        key: ''
      },
      addForm: {
        category: undefined,
        sn: '',
        key: '',
        remark: '',
        enabled: true,
        logEnabled: true,
        deviceTemp: false,
        deviceLevel: false,
        devicePressure: false
      },
      addForm2: {
        requestType: 0,
        requestAddress: '',
        requestParameter: ''
      },
      typeList: [],
      requestType: [
        {value: 1, label: 'Get'},
        {value: 2, label: 'Post'}
      ]
    }
  },
  methods: {
    leavePage() {
      this.changeStatus = 0
      this.$router.push('/device')
    },
    chooseDeviceType1() {
      this.deviceType1 = 1
    },
    chooseDeviceType2() {
      this.deviceType1 = 2
      this.$XModal.message({message: '三方设备暂未开放', status: 'warning', id: 'unique1'})
    },
    async requestDevice() {
      const response = await this.$http.post('/device/category/list').then(this.$XModal.message({
        message: '设备类型请求成功',
        status: 'success'
      })).catch(error => {
        this.$XModal.message({message: `设备类型请求失败@${error}`, status: 'warning'})
      })
      this.typeList = response.data.data
      console.log('列表', this.typeList)
    },
    addDevices() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$XModal.message({message: '检查所有必填项', status: 'warning'})
        } else {
          console.log(this.addForm)
          this.$http.post('/device/create', this.addForm).then(response => {
            if (response.data.code === 0) {
              this.$XModal.message({message: '设备创建成功', status: 'success'})
              this.changeStatus = 0
              this.$router.push('/device')
            } else {
              this.$XModal.message({message: `创建失败@${response.data.message}`, status: 'error'})
            }
          }).catch(error =>
            this.$XModal.message({message: `遇到一个错误@${error}`, status: 'error'}))
        }
      })
    },
    watchChange() {
      this.changeStatus = this.changeStatus + 1
      console.log(this.changeStatus)
    }
  },
  name: 'AddDevices',
  watch: {
    addForm: {
      handler() {
        this.watchChange()
      },
      deep: true
    }
  },
  mounted() {
    this.requestDevice()
  }
}
</script>

<style scoped>
.chooseDeviceType {
  margin: 0;
  font-size: 18px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

.deviceType1 {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3px;
  outline: none;
  width: 150px;
  height: 40px;
  background: #2f74eb;
  border: 1px solid #d6daea;
}

.deviceType2 {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3px;
  outline: none;
  width: 150px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #d6daea;
}

.deviceTypeText1 {
  margin: 0;
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
  letter-spacing: 1px;
}

.deviceTypeText2 {
  margin: 0;
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: center;
  color: #58647a;
}
</style>
