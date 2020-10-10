<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tank' }">
        罐箱列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加罐箱</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="display: flex;align-items: center;justify-content: flex-end">
      <h1 style="margin-right: auto;margin-left: 10px">
        添加罐箱
      </h1>
      <el-button
        size="mini"
        @click="backToList"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="AddTanks"
      >
        新建
      </el-button>
    </div>
    <el-card>
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          label="基础信息"
          name="first"
        >
          <el-form
            ref="addTankForm"
            :model="addTankForm"
            :rules="ruleForm"
            size="small"
            label-width="150px"
          >
            <div style="display: grid;grid-template-columns: 1fr 1fr">
              <div>
                <el-form-item
                  label-width="100px"
                  label="箱号"
                  prop="tankSn"
                >
                  <el-input
                    v-model="addTankForm.tankSn"
                    placeholder="请输入箱号"
                    clearable
                    :maxlength="13"
                    show-word-limit
                    :style="{width: '100%'}"
                  />
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  label="制造日期"
                  prop="buildAt"
                >
                  <el-date-picker
                    v-model="addTankForm.buildAt"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :style="{width: '100%'}"
                    placeholder="请选择制造日期"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  label="关联设备"
                  prop="device"
                >
                  <el-select
                    :loading="loadingMedia"
                    v-model="addTankForm.device"
                    placeholder="请输入关联设备"
                    remote
                    :remote-method="remoteMethod1"
                    filterable
                    clearable
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="item in options1"
                      :key="item.deviceSn"
                      :label="item.deviceSn"
                      :value="item.deviceSn"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  label="介质"
                  prop="medium"
                >
                  <el-select
                    :loading="loadingMedia"
                    remote
                    :remote-method="remoteMethod"
                    v-model="addTankForm.medium"
                    placeholder="请选择介质"
                    filterable
                    clearable
                    default-first-option
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  label="认证船级社"
                  prop="classificationSociety"
                >
                  <el-input
                    v-model="addTankForm.classificationSociety"
                    placeholder="请输入认证船级社"
                    clearable
                    :maxlength="10"
                    show-word-limit
                    :style="{width: '100%'}"
                  />
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  label-width="100px"
                  label="备注"
                  prop="remark"
                >
                  <el-input
                    v-model="addTankForm.remark"
                    type="textarea"
                    placeholder="请输入备注"
                    :maxlength="200"
                    show-word-limit
                    :autosize="{minRows: 4, maxRows: 4}"
                    :style="{width: '100%'}"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          label="罐箱模型"
          name="second"
        >
          <div
            class="tanModelTab"
            :style="{minHeight:pageHeight}"
          >
            <div>
              <p class="title">
                罐箱模型
              </p>
              <div style="margin: 0 auto;padding:0 20px 0;">
                <el-tag
                  :hit="false"
                  class="addTagClass"
                >
                  <i class="el-icon-circle-plus addTag"/><span class="addTagText">自定义</span>
                </el-tag>
                <el-tag
                  :id="item.name"
                  style="margin: 3px;width: 80px;cursor:pointer;user-select: none"
                  v-for="item in tankModelList"
                  :key="item.name"
                  :effect="item.name===selectedTag?'dark':'plain'"
                  @click="selectTag(item)"
                >
                  {{ item.name }}
                </el-tag>
              </div>
            </div>
            <div>
              <span class="tableTitle">{{ selectedTag }}</span>
              <span
                style="float:right;width: 100px;height: 18px;font-size: 14px;font-weight: 400;color: #58647a;line-height: 24px;">罐箱容积:{{
                  selectedTagTable.volume
                }}L</span>
              <table class="tankModelTable">
                <tr>
                  <th colspan="3">
                    集装箱尺寸 mm
                  </th>
                  <th colspan="3">
                    重量参数 kg
                  </th>
                  <th>材质信息</th>
                </tr>
                <tr>
                  <td class="tableBackground">
                    长
                  </td>
                  <td class="tableBackground">
                    宽
                  </td>
                  <td class="tableBackground">
                    高
                  </td>
                  <td class="tableBackground">
                    最大许可总重
                  </td>
                  <td class="tableBackground">
                    自重
                  </td>
                  <td class="tableBackground">
                    载重
                  </td>
                  <td class="tableBackground">
                    罐体材料
                  </td>
                </tr>
                <tr>
                  <td class="tableContent">
                    {{ selectedTagTable.length }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.width }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.height }}
                  </td>
                  <td class="tableContent">
                    36000
                  </td>
                  <td class="tableContent">
                    3910
                  </td>
                  <td class="tableContent">
                    32360
                  </td>
                  <td class="tableContent">
                    ASME SA240 304或同等材料
                  </td>
                </tr>
              </table>
              <table class="tankModelTable">
                <tr>
                  <th colspan="2">
                    筒体尺寸 mm
                  </th>
                  <th colspan="4">
                    压力参数 Bar
                  </th>
                  <th>保温</th>
                </tr>
                <tr>
                  <td class="tableBackground">
                    内直径
                  </td>
                  <td class="tableBackground">
                    长
                  </td>
                  <td
                    style="width: 10%"
                    class="tableBackground"
                  >
                    -
                  </td>
                  <td class="tableBackground">
                    最大许可压力
                  </td>
                  <td class="tableBackground">
                    试验压力
                  </td>
                  <td class="tableBackground">
                    最大外部压力
                  </td>
                  <td class="tableBackground">
                    保温厚度 mm
                  </td>
                </tr>
                <tr>
                  <td class="tableContent">
                    2333
                  </td>
                  <td class="tableContent">
                    5988
                  </td>
                  <td>罐体</td>
                  <td class="tableContent">
                    2.67
                  </td>
                  <td class="tableContent">
                    4
                  </td>
                  <td class="tableContent">
                    0.21
                  </td>
                  <td class="tableContent">
                    30
                  </td>
                </tr>
                <tr>
                  <th colspan="2">
                    温度参数 °C
                  </th>
                  <td>加热管</td>
                  <td class="tableContent">
                    4
                  </td>
                  <td class="tableContent">
                    6
                  </td>
                  <td>-</td>
                  <td>保温材料</td>
                </tr>
                <tr>
                  <td>筒体设计温度</td>
                  <td
                    colspan="2"
                    class="tableContent"
                  >
                    -40-130
                  </td>
                  <td colspan="3"/>
                  <td class="tableContent">
                    岩棉
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="附件上传"
          name="third"
        >
          附件上传
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddTanks',
  data() {
    return {
      selectedTagTable: {name: undefined, length: undefined, width: undefined, height: undefined, volume: undefined},
      selectedTag: undefined,
      tankModelList: [
        {name: '11m³Tank', length: 6058, width: 2438, height: 1591, volume: 1100},
        {name: '12m³Tank', length: 6218, width: 2438, height: 2591, volume: 1200},
        {name: '13m³Tank', length: 6318, width: 2438, height: 3591, volume: 3000},
        {name: '14m³Tank', length: 1118, width: 2438, height: 4591, volume: 4000},
        {name: '15m³Tank', length: 2582, width: 2438, height: 5591, volume: 5000},
        {name: '16m³Tank', length: 3058, width: 2438, height: 6591, volume: 6000},
        {name: '17m³Tank', length: 5058, width: 2738, height: 7591, volume: 7000},
        {name: '18m³Tank', length: 6058, width: 2458, height: 8591, volume: 8000},
        {name: '19m³Tank', length: 7058, width: 2478, height: 9591, volume: 9000},
        {name: '20m³Tank', length: 2058, width: 2438, height: 2591, volume: 1300},
        {name: '21m³Tank', length: 2258, width: 2421, height: 2591, volume: 1400},
        {name: '22m³Tank', length: 1111, width: 2438, height: 2591, volume: 1600},
        {name: '23m³Tank', length: 3333, width: 2238, height: 2591, volume: 1700},
        {name: '24m³Tank', length: 4048, width: 2328, height: 2591, volume: 1090}
      ],
      deviceList: [],
      loadingMedia: false,
      options: [],
      options1: [],
      mediaList: [],
      activeName: 'first',
      addTankForm: {
        tankSn: undefined,
        buildAt: null,
        device: undefined,
        classificationSociety: undefined,
        medium: undefined,
        remark: undefined
      },
      ruleForm: {
        tankSn: [{
          required: true,
          message: '请输入箱号',
          trigger: 'blur'
        },
          {min: 13, max: 13, message: '长度为13个字符', trigger: 'blur'}],
        buildAt: [{
          required: true,
          message: '请选择制造日期',
          trigger: 'change'
        }],
        device: [{
          required: true,
          message: '请输入关联设备',
          trigger: 'change'
        }],
        classificationSociety: [{
          required: true,
          message: '请输入认证船级社',
          trigger: 'blur'
        }],
        medium: [{
          required: true,
          message: '请选择介质',
          trigger: 'change'
        }]
      }
    }
  },
  mounted() {
    this.getMedia()
    this.getDevice()
    // this.getTankModel()
    this.selectedTagTable = this.tankModelList[0]
    this.selectedTag = this.tankModelList[0].name
  },
  methods: {
    backToList() {
      this.$router.push('/tank')
    },
    selectTag(x) {
      this.selectedTag = x.name
      this.selectedTagTable = x
      console.log(this.selectedTag)
    },
    async getTankModel() {
      const response = await this.$http.post('/tank/model/list').catch(error => {
        this.$XModal.message({message: `罐箱请求失败@${error}`, status: 'warning'})
      })
      this.tankModelList = response.data.data.data
      console.log('罐箱模型列表', this.tankModelList)
    },
    remoteMethod1(query) {
      if (query !== '') {
        this.loadingMedia = true
        setTimeout(() => {
          this.loadingMedia = false
          this.options1 = this.deviceList.filter(item => {
            return item.deviceSn.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options1 = []
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loadingMedia = true
        setTimeout(() => {
          this.loadingMedia = false
          this.options = this.mediaList.filter(item => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    async getDevice() {
      const request = {
        currentPage: 0,
        keywords: '',
        order: 'DESC',
        orderColumnIndex: 0,
        pageSize: 999999
      }
      const response = await this.$http.post('/device/list', request).catch(error => {
        this.$XModal.message({message: `设备列表请求失败@${error}`, status: 'warning'})
      })
      console.log(response)
      this.deviceList = response.data.data.data.map(item => {
        return {deviceSn: item.deviceSn}
      })
      console.log('设备列表', this.deviceList)
    },
    async getMedia() {
      const response = await this.$http.post('/tank/media/list').catch(error => {
        this.$XModal.message({message: `介质列表请求失败@${error}`, status: 'warning'})
      })
      this.mediaList = response.data.data.data
      console.log(this.mediaList)
    },
    AddTanks() {
      this.$refs.addTankForm.validate(valid => {
        if (valid) {
          this.addTankForm.tankModel = this.selectedTag
          console.log(this.addTankForm)
          this.$http.post('/tank/create', this.addTankForm).then(response => {
            console.log(response.data.code)
            if (response.data.code === 0) {
              this.$XModal.message({message: '创建成功', status: 'success', id: '1'})
              this.backToList()
            } else {
              this.$XModal.message({message: `创建失败@${response.data.message}`, status: 'warning', id: '1'})
            }
          }).catch(error => {
            this.$XModal.message({message: `创建失败@${error}`, status: 'warning'})
          })
        } else this.$XModal.message({message: '请检查必填项', status: 'warning', id: '1'})
      })
    }
  },
  computed: {
    pageHeight() {
      return (window.innerHeight - 280) + 'px'
    }
  }
}
</script>

<style scoped lang="less">
.tableBackground {
  background-color: #F5F7FA;
}

.tableContent {
  width: 35px;
  height: 18px;
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  color: #58647a;
}

.tableTitle {
  width: 97px;
  height: 23px;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

.tankModelTable {
  text-align: center;
  white-space: nowrap;
  border-collapse: collapse;
  width: 100%;
  margin: 0 auto;
  border-spacing: 0;
}

.tankModelTable1 tr {
  border: 1px solid gainsboro;
}

.tankModelTable td {
  height: 30px;
  padding: 1px;
  border: 1px solid gainsboro;
}

.tankModelTable th {
  height: 30px;
  text-align: center;
  background-color: #2A68D3;
  font-size: 14px;
  font-weight: 700;
  color: white;
  border: 1px solid gainsboro;
}

.addTagClass {
  user-select: none;
  margin: 3px;
  width: 80px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2f74eb;
}

.addTagText {
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  letter-spacing: 1px;
}

.addTagClass:hover {
  color: #8cc5ff;
}

@media only screen  and (max-width: 900px) {

}

@media only screen  and (min-width: 900px) and (max-width: 1400px) {
  .tanModelTab {
    display: grid;
    grid-template-columns: 300px auto;
  }
}

@media only screen  and (min-width: 1400px) {
  .tanModelTab {
    display: grid;
    grid-template-columns: 300px auto;
    grid-gap: 100px;
  }
}

.title {
  margin: 0 0 30px 0;
  font-size: 18px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

/deep/ ::-webkit-scrollbar {
  width: 0;
}
</style>
