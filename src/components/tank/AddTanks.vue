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
                    :remote-method="remoteMethod"
                    filterable
                    clearable
                    default-first-option
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="item in options"
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
                    v-model="addTankForm.medium"
                    placeholder="请选择介质"
                    filterable
                    clearable
                    default-first-option
                    :style="{width: '100%'}"
                  >
                    <el-option
                      v-for="item in mediaList"
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
                  @click="$router.push('/tankmodel')"
                >
                  <i class="el-icon-circle-plus addTag" /><span class="addTagText">自定义</span>
                </el-tag>
                <el-tag
                  :id="item.name"
                  style="margin: 3px;cursor:pointer;
                  user-select: none;
                  width: 80px;
                  overflow:hidden;
                  text-overflow:ellipsis;
                  white-space:nowrap;"
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
              <span class="tableTitle">{{ selectedTag |filter1 }}</span>
              <span
                style="float:right;width: 100px;height: 18px;font-size: 14px;font-weight: 400;color: #58647a;line-height: 24px;"
              >罐箱容积:{{
                selectedTagTable.capacity|filter2
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
                    {{ selectedTagTable.length |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.width |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.height |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.MPGM |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.tareMass|filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.payLoad |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.tankMaterial |filter2 }}
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
                  <td
                    class="tableBackground"
                    style="width: 12%"
                  >
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
                    {{ selectedTagTable.internalDIA |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.internalLength |filter2 }}
                  </td>
                  <td>罐体</td>
                  <td class="tableContent">
                    {{ selectedTagTable.tankMAWP |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.tankTestPressure |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.externalDesignPressure |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.insulationThickness |filter2 }}
                  </td>
                </tr>
                <tr>
                  <th colspan="2">
                    温度参数 °C
                  </th>
                  <td>加热管</td>
                  <td class="tableContent">
                    {{ selectedTagTable.heatingCoilsMAWP |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.heatingCoilsTestPressure |filter2 }}
                  </td>
                  <td class="tableContent">
                    N/A
                  </td>
                  <td>保温材料</td>
                </tr>
                <tr>
                  <td>筒体设计温度</td>
                  <td
                    class="tableContent"
                  >
                    {{ selectedTagTable.vesselDesignTemperature |filter2 }}
                  </td>
                  <td colspan="4" />
                  <td class="tableContent">
                    {{ selectedTagTable.insulation |filter2 }}
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
          <div style="display:flex;justify-content: flex-start">
            <el-card style="margin: 5px 20px;width: 400px;">
              <p class="uploadTile">
                图片上传
              </p>
              <el-upload
                :headers="myHeaders"
                style="margin: 0 auto"
                action="http://47.89.13.131:9090/tank/attachment/upload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                :before-remove="beforeRemovePicture"
                :before-upload="uploadPicture"
                :on-error="handleError"
                list-type="picture"
                multiple
                drag
                :limit="pictureNumber"
                :on-exceed="handleExceedPicture"
                :file-list="fileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将图片拖到此处，或<br>
                  <el-button
                    type="primary"
                    size="small"
                  >
                    点击上传
                  </el-button>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  只能上传图片，且不超过5MB
                </div>
              </el-upload>
            </el-card>
            <el-card style="margin: 5px 20px;width: 400px">
              <p class="uploadTile">
                文件上传
              </p>
              <el-upload
                :headers="myHeaders"
                action="http://47.89.13.131:9090/tank/attachment/upload"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-remove="beforeRemoveFile"
                :before-upload="uploadFile"
                list-type="list"
                multiple
                drag
                :limit="fileNumber"
                :on-exceed="handleExceedFile"
                :file-list="fileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或<br>
                  <el-button
                    type="primary"
                    size="small"
                  >
                    点击上传
                  </el-button>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  只能上传文档，且不超过5MB
                </div>
              </el-upload>
            </el-card>
          </div>
          <el-dialog :visible.sync="dialogVisible">
            <img
              width="100%"
              :src="dialogImageUrl"
              alt=""
            >
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  name: 'AddTanks',
  filters: {
    longFilter: function (value) {
      if (value.length > 5) {
        return value.substring(0, 8)
      }
    },
    filter1: function (value) {
      if (value === undefined || value === null) {
        value = '未选择模型'
      }
      return value
    },
    filter2: function (value) {
      if (value === undefined || value === null) {
        value = '-'
      }
      return value
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.createTank === false) {
      setTimeout(() => {
        this.$confirm('此时离开将会丢失所有信息!已上传的附件也将被删除！', '确认信息', {
          closeOnClickModal: false,
          confirmButtonText: '确认离开',
          cancelButtonText: '留在此页',
          type: 'warning'
        }).then(() => {
          const attachment1 = this.attachmentArray.join(';')
          console.log('删除的附件为', attachment1)
          this.deletedFile(attachment1)
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
  data () {
    return {
      myHeaders: { authtoken: 1 },
      fileNumber: 10,
      pictureNumber: 5,
      createTank: false,
      previewList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      attachmentArray: [],
      fileList: [],
      selectedTagTable: {},
      selectedTag: undefined,
      tankModelList: [{
        name: undefined,
        capacity: undefined,
        length: undefined,
        width: undefined,
        height: undefined,
        MPGM: undefined,
        tareMass: undefined,
        payLoad: undefined,
        tankMaterial: undefined,
        internalDIA: undefined,
        internalLength: undefined,
        tankMAWP: undefined,
        tankTestPressure: undefined,
        heatingCoilsMAWP: undefined,
        heatingCoilsTestPressure: undefined,
        externalDesignPressure: undefined,
        insulationThickness: undefined,
        vesselDesignTemperature: undefined,
        insulation: undefined
      }],
      deviceList: [],
      loadingMedia: false,
      options: [],
      mediaList: [],
      activeName: 'first',
      addTankForm: {
        tankSn: undefined,
        buildAt: null,
        device: undefined,
        classificationSociety: undefined,
        medium: undefined,
        remark: undefined,
        attachment: ''
      },
      ruleForm: {
        tankSn: [{
          required: true,
          message: '请输入箱号',
          trigger: 'blur'
        },
        { min: 13, max: 13, message: '长度为13个字符', trigger: 'blur' }],
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
  created () {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  mounted () {
    this.myHeaders.authtoken = sessionStorage.getItem('token')
    this.getMedia()
    this.getDevice()
    this.getTankModel()
  },
  methods: {
    uploadPicture (file) {
      const isPicture = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('picture', file)
      console.log('isPicture', isPicture)
      if (!isPicture) {
        VXETable.modal.message({ message: '请上传图片格式文件!', status: 'error', id: '1' })
      }
      if (!isLt5M) {
        VXETable.modal.message({ message: '上传图片大小不能超过 5MB!', status: 'error', id: '1' })
      }
      return isPicture && isLt5M
    },
    uploadFile (file) {
      const isFile = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('file', file)
      console.log('isFile', isFile)
      if (!isFile) {
        VXETable.modal.message({ message: '请上传文档格式的文件!', status: 'error', id: '1' })
      }
      if (!isLt5M) {
        VXETable.modal.message({ message: '上传图片大小不能超过 5MB!', status: 'error', id: '1' })
      }
      return isFile && isLt5M
    },
    // 关闭或刷新时删除当前所有附件
    beforeunloadFn () {
      const attachment1 = this.attachmentArray.join(';')
      console.log('删除的附件为', attachment1)
      this.deletedFile(attachment1)
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleError (response) {
      VXETable.modal.message({ message: '上传失败,请重新再试', status: 'error', id: '1' })
      console.log('错误', response)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (response, fileList) {
      console.log('返回', response)
      console.log('文件列表', fileList)
      this.attachmentArray.push(response.data)
      console.log('附件列表数组', this.attachmentArray)
      VXETable.modal.message({ message: '上传成功！', status: 'success', id: '1' })
    },
    deletedFile (attachmentURL) {
      if (!attachmentURL) console.log('附件为空', attachmentURL)
      else {
        this.$http.post('/tank/attachment/delete', { attachment: attachmentURL }).then(response => {
          console.log('删除的响应值为', response)
          if (response.data.code === 0) {
            VXETable.modal.message({ message: '附件已删除', status: 'success', id: '1' })
          } else {
            VXETable.modal.message({ message: '删除失败！', status: 'error', id: '2' })
          }
        }).catch(error => {
          VXETable.modal.message({ message: `操作失败,文件未删除@${error}`, status: 'error', id: '2' })
        })
      }
    },
    handleRemove (file, fileList) {
      // removeFunction
      console.log('当前文件列表', fileList)
      console.log('移除的文件', file)
      if (file.response) {
        console.log('移除的文件URL', file.response.data)
        // 首先从附件列表中删除
        this.attachmentArray.splice(this.attachmentArray.indexOf(file.response.data), 1)
        // 再从服务器内删除
        this.deletedFile(file.response.data)
      }
      console.log('附件列表数组', this.attachmentArray)
    },
    handleExceedFile (files, fileList) {
      this.$message.info(`当前限制选择 ${this.fileNumber} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleExceedPicture (files, fileList) {
      this.$message.info(`当前限制选择 ${this.pictureNumber} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemovePicture (file, fileList) {
      const isPicture = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'].includes(file.raw.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('beforeRemove', isPicture, file)
      if (isPicture && isLt5M) {
        return this.$confirm(`确认移除文件 ${file.name}?`)
      }
    },
    beforeRemoveFile (file, fileList) {
      const isFile = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.raw.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('beforeRemove', isFile, file)
      if (isFile && isLt5M) {
        return this.$confirm(`确认移除文件 ${file.name}?`)
      }
    },
    backToList () {
      this.$router.push('/tank')
    },
    selectTag (x) {
      this.selectedTag = x.name
      this.selectedTagTable = x
      console.log(this.selectedTag)
    },
    async getTankModel () {
      const response = await this.$http.post('/tank/model/list').catch(error => {
        VXETable.modal.message({ message: `罐箱请求失败@${error}`, status: 'warning', id: '1' })
      })
      this.tankModelList = response.data.data.data
      console.log('罐箱模型列表', this.tankModelList)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loadingMedia = true
        setTimeout(() => {
          this.loadingMedia = false
          this.options = this.deviceList.filter(item => {
            return item.deviceSn.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    async getDevice () {
      const request = {
        currentPage: 0,
        keywords: '',
        order: 'DESC',
        orderColumnIndex: 0,
        pageSize: 999999
      }
      const response = await this.$http.post('/device/list', request).catch(error => {
        VXETable.modal.message({ message: `设备列表请求失败@${error}`, status: 'warning', id: '1' })
      })
      console.log(response)
      this.deviceList = response.data.data.data.map(item => {
        return { deviceSn: item.deviceSn }
      })
      console.log('设备列表', this.deviceList)
    },
    async getMedia () {
      const response = await this.$http.post('/tank/media/list').catch(error => {
        VXETable.modal.message({ message: `介质列表请求失败@${error}`, status: 'warning', id: '1' })
      })
      this.mediaList = response.data.data.data
      console.log(this.mediaList)
    },
    AddTanks () {
      this.$refs.addTankForm.validate(valid => {
        if (valid) {
          this.addTankForm.tankModel = this.selectedTag
          this.addTankForm.attachment = this.attachmentArray.join(';')
          console.log(this.addTankForm)
          if (this.addTankForm.tankModel === undefined) {
            VXETable.modal.message({ message: '罐箱模型未选择', status: 'warning' })
            this.activeName = 'second'
          } else {
            this.$http.post('/tank/create', this.addTankForm).then(response => {
              console.log(response.data.code)
              if (response.data.code === 0) {
                VXETable.modal.message({ message: '创建成功', status: 'success', id: '1' })
                this.createTank = true
                this.backToList()
              } else {
                VXETable.modal.message({ message: `创建失败@${response.data.message}`, status: 'warning', id: '1' })
              }
            }).catch(error => {
              VXETable.modal.message({ message: `创建失败@${error}`, status: 'warning' })
            })
          }
        } else {
          VXETable.modal.message({ message: '请检查必填项', status: 'warning', id: '1' })
          this.activeName = 'first'
        }
      })
    }
  },
  computed: {
    pageHeight () {
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
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold sans-serif;
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
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold sans-serif;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

/deep/ ::-webkit-scrollbar {
  width: 0;
}

.uploadTile {
  margin: 5px;
  font-size: 18px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold, sans-serif;
  text-align: left;
  color: #58647a;
}
</style>
