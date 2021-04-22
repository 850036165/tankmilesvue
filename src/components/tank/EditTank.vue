<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('editTanks.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tank' }">
        {{ $t('editTanks.tankList') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('editTanks.editTank') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="display: flex;align-items: center;justify-content: flex-end">
      <h1 style="margin-right: auto;margin-left: 10px">
        {{ $t('editTanks.editTank') }}
      </h1>
      <el-button
        type="primary"
        size="mini"
        @click="editTank"
      >
        {{ $t('editTanks.edit') }}
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="deleteTank"
      >
        {{ $t('editTanks.delete') }}
      </el-button>
      <el-button
        size="mini"
        @click="backToList"
      >
        {{ $t('editTanks.back') }}
      </el-button>
    </div>
    <el-card>
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          :label="$t('editTanks.baseInfo')"
          name="first"
        >
          <el-form
            ref="editTankForm"
            :model="editTankForm"
            :rules="ruleForm"
            size="small"
            label-width="150px"
          >
            <div style="display: grid;grid-template-columns: 1fr 1fr">
              <div>
                <el-form-item
                  label-width="100px"
                  :label="$t('editTanks.tankNo')"
                  prop="tankSn"
                >
                  <el-input
                    v-model="editTankForm.tankSn"
                    :placeholder="$t('editTanks.inputTankNo')"
                    clearable
                    :maxlength="13"
                    show-word-limit
                    :style="{width: '100%'}"
                  />
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  :label="$t('editTanks.createDate')"
                  prop="buildAt"
                >
                  <el-date-picker
                    v-model="editTankForm.buildAt"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :style="{width: '100%'}"
                    :placeholder="$t('editTanks.inputCreateDate')"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  :label="$t('editTanks.associatedDevice')"
                  prop="device"
                >
                  <el-select
                    :loading="loadingMedia"
                    v-model="editTankForm.device"
                    :placeholder="$t('editTanks.inputAssociatedDevice')"
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
                  :label="$t('editTanks.medium')"
                  prop="medium"
                >
                  <el-select
                    :loading="loadingMedia"
                    v-model="editTankForm.medium"
                    :placeholder="$t('editTanks.selectMedium')"
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
                  :label="$t('editTanks.classificationSociety')"
                  prop="classificationSociety"
                >
                  <el-input
                    v-model="editTankForm.classificationSociety"
                    :placeholder="$t('editTanks.inputClassificationSociety')"
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
                  :label="$t('editTanks.remark')"
                  prop="remark"
                >
                  <el-input
                    v-model="editTankForm.remark"
                    type="textarea"
                    :placeholder="$t('editTanks.inputRemark')"
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
          :label="$t('editTanks.tankModel')"
          name="second"
        >
          <div
            class="tanModelTab"
            :style="{minHeight:pageHeight}"
          >
            <div>
              <p class="title">
                {{ $t('editTanks.tankModel') }}
              </p>
              <div style="margin: 0 auto;padding:0 20px 0;">
                <el-tag
                  :hit="false"
                  class="addTagClass"
                  @click="$router.push('/tankmodel')"
                >
                  <i class="el-icon-circle-plus addTag" /><span class="addTagText">{{ $t('editTanks.createTankModel') }}</span>
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
              >{{ $t('editTanks.tankVolume') }}:{{
                selectedTagTable.capacity|filter2
              }}L</span>
              <table class="tankModelTable">
                <tr>
                  <th colspan="3">
                    {{ $t('editTanks.tankSize') }}mm
                  </th>
                  <th colspan="3">
                    {{ $t('editTanks.tankWeightParameter') }}kg
                  </th>
                  <th>{{ $t('editTanks.materialInfo') }}</th>
                </tr>
                <tr>
                  <td class="tableBackground">
                    {{ $t('editTanks.length') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.width') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.height') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.maxGrossWeight') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.netWeight') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.loadWeight') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.tankMaterial') }}
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
                    {{ $t('editTanks.cylinderSize') }}mm
                  </th>
                  <th colspan="4">
                    {{ $t('editTanks.pressureParameter') }}Bar
                  </th>
                  <th>{{ $t('editTanks.insulation') }}</th>
                </tr>
                <tr>
                  <td class="tableBackground">
                    {{ $t('editTanks.internalDiameter') }}
                  </td>
                  <td
                    class="tableBackground"
                    style="width: 12%"
                  >
                    {{ $t('editTanks.length') }}
                  </td>
                  <td
                    style="width: 10%"
                    class="tableBackground"
                  >
                    -
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.maxPressure') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.testPressure') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.maxExternalPressure') }}
                  </td>
                  <td class="tableBackground">
                    {{ $t('editTanks.insulationThickness') }}mm
                  </td>
                </tr>
                <tr>
                  <td class="tableContent">
                    {{ selectedTagTable.internalDIA |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.internalLength |filter2 }}
                  </td>
                  <td>{{ $t('editTanks.tankBody') }}</td>
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
                    {{ $t('editTanks.temperatureParameter') }}°C
                  </th>
                  <td>{{ $t('editTanks.heatingTube') }}</td>
                  <td class="tableContent">
                    {{ selectedTagTable.heatingCoilsMAWP |filter2 }}
                  </td>
                  <td class="tableContent">
                    {{ selectedTagTable.heatingCoilsTestPressure |filter2 }}
                  </td>
                  <td class="tableContent">
                    N/A
                  </td>
                  <td>{{ $t('editTanks.insulationMaterial') }}</td>
                </tr>
                <tr>
                  <td>{{ $t('editTanks.cylinderDesignTemperature') }}</td>
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
          :label="$t('editTanks.uploadAttachment')"
          name="third"
        >
          <div style="display:flex;justify-content: flex-start">
            <el-card style="margin: 5px 20px;width: 400px;">
              <p class="uploadTile">
                {{ $t('editTanks.uploadPicture') }}
              </p>
              <el-upload
                :headers="myHeaders"
                style="margin: 0 auto"
                action="https://api.tankmiles.com:9443/tank/attachment/upload"
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
                  {{ $t('editTanks.dragPictureUpload') }}<br>
                  <el-button
                    type="primary"
                    size="small"
                  >
                    {{ $t('editTanks.clickUpload') }}
                  </el-button>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  {{ $t('editTanks.imageOnly') }}
                </div>
              </el-upload>
            </el-card>
            <el-card style="margin: 5px 20px;width: 400px">
              <p class="uploadTile">
                {{ $t('editTanks.uploadFile') }}
              </p>
              <el-upload
                :headers="myHeaders"
                action="https://api.tankmiles.com:9443/tank/attachment/upload"
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
                  {{ $t('editTanks.dragFileUpload') }}<br>
                  <el-button
                    type="primary"
                    size="small"
                  >
                    {{ $t('editTanks.clickUpload') }}
                  </el-button>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  {{ $t('editTanks.fileOnly') }}
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
  name: 'EditTank',
  filters: {
    longFilter: function (value) {
      if (value.length > 5) {
        return value.substring(0, 8)
      }
    },
    filter1: function (value) {
      if (value === undefined || value === null) {
        value = '-'
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
        this.$confirm(`${this.$t('editTanks.leaveWithoutSave')}`, `${this.$t('editTanks.confirmationInfo')}`, {
          closeOnClickModal: false,
          confirmButtonText: `${this.$t('editTanks.leave')}`,
          cancelButtonText: `${this.$t('editTanks.stayHere')}`,
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
      tankId: null,
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
      editTankForm: {
        id: null,
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
          message: `${this.$t('editTanks.inputTankNo')}`,
          trigger: 'blur'
        },
        { min: 13, max: 13, message: `${this.$t('editTanks.maxLength')}`, trigger: 'blur' }],
        buildAt: [{
          required: true,
          message: `${this.$t('editTanks.inputCreateDate')}`,
          trigger: 'change'
        }],
        device: [],
        classificationSociety: [],
        medium: []
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
    this.tankId = this.$route.query.id
    this.myHeaders.authtoken = sessionStorage.getItem('token')
    this.getTankDetail(this.tankId)
    this.getMedia()
    this.getDevice()
    this.getTankModel()
  },
  methods: {
    async getTankDetail (tankSn) {
      const response = await this.$http.post('/tank/detail', { id: tankSn })
      const tankDetail = response.data.data
      this.editTankForm.buildAt = tankDetail.buildAt
      this.editTankForm.classificationSociety = tankDetail.classificationSociety
      this.editTankForm.medium = tankDetail.medium
      this.editTankForm.remark = tankDetail.remark
      this.editTankForm.tankSn = tankDetail.sn
      this.editTankForm.device = tankDetail.device
      this.selectedTag = tankDetail.tankModel
      console.log(this.editTankForm, 'test')
    },
    deleteTank () {
      this.$confirm(`${this.$t('editTanks.deleteTank')}`, `${this.$t('editTanks.warning')}`, {
        confirmButtonText: `${this.$t('editTanks.yes')}`,
        cancelButtonText: `${this.$t('editTanks.leave')}`,
        type: 'warning'
      }).then(() => {
        this.$http.post('/tank/delete ', { id: this.tankId }).then(response => {
          console.log(response)
          if (response.data.code !== 0) {
            VXETable.modal.message({ message: `${this.$t('editTanks.deleteFailed')}@${response.data.message}`, status: 'error', id: '2' })
          } else {
            VXETable.modal.message({ message: `${this.$t('editTanks.deleteSuccess')}`, status: 'success', id: '2' })
            this.createTank = true
            this.backToList()
          }
        })
      }).catch(() => {
        VXETable.modal.message({ message: `${this.$t('editTanks.cancel')}`, status: 'warning', id: '2' })
      })
    },
    uploadPicture (file) {
      const isPicture = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('picture', file)
      console.log('isPicture', isPicture)
      if (!isPicture) {
        VXETable.modal.message({ message: `${this.$t('editTanks.uploadImageFormat')}`, status: 'error', id: '1' })
      }
      if (!isLt5M) {
        VXETable.modal.message({ message: `${this.$t('editTanks.maxImage5mb')}`, status: 'error', id: '1' })
      }
      return isPicture && isLt5M
    },
    uploadFile (file) {
      const isFile = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('file', file)
      console.log('isFile', isFile)
      if (!isFile) {
        VXETable.modal.message({ message: `${this.$t('editTanks.uploadFileFormat')}`, status: 'error', id: '1' })
      }
      if (!isLt5M) {
        VXETable.modal.message({ message: `${this.$t('editTanks.maxFiles5mb')}`, status: 'error', id: '1' })
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
      VXETable.modal.message({ message: `${this.$t('editTanks.uploadFailed')}`, status: 'error', id: '1' })
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
      VXETable.modal.message({ message: `${this.$t('editTanks.uploadSuccess')}`, status: 'success', id: '1' })
    },
    deletedFile (attachmentURL) {
      if (!attachmentURL) console.log('附件为空', attachmentURL)
      else {
        this.$http.post('/tank/attachment/delete', { attachment: attachmentURL }).then(response => {
          console.log('删除的响应值为', response)
          if (response.data.code === 0) {
            VXETable.modal.message({ message: `${this.$t('editTanks.attachmentDeleted')}`, status: 'success', id: '1' })
          } else {
            VXETable.modal.message({ message: `${this.$t('editTanks.deleteFailed')}`, status: 'error', id: '2' })
          }
        }).catch(error => {
          VXETable.modal.message({ message: `${this.$t('editTanks.operationFailed')}@${error}`, status: 'error', id: '2' })
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
      this.$message.info(`${this.$t('editTanks.currentSelectLimited')}${this.fileNumber} ${this.$t('editTanks.fileNum')}，${this.$t('editTanks.currentSelected')}${files.length} ${this.$t('editTanks.fileNum')}，${this.$t('editTanks.totalSelect')}${files.length + fileList.length}${this.$t('editTanks.fileNum')}`)
    },
    handleExceedPicture (files, fileList) {
      this.$message.info(`${this.$t('editTanks.currentSelectLimited')}${this.fileNumber} ${this.$t('editTanks.fileNum')}，${this.$t('editTanks.currentSelected')}${files.length} ${this.$t('editTanks.fileNum')}，${this.$t('editTanks.totalSelect')}${files.length + fileList.length}${this.$t('editTanks.fileNum')}`)
    },
    beforeRemovePicture (file, fileList) {
      const isPicture = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'].includes(file.raw.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('beforeRemove', isPicture, file)
      if (isPicture && isLt5M) {
        return this.$confirm(`${this.$t('editTanks.removeFile')} ${file.name}?`)
      }
    },
    beforeRemoveFile (file, fileList) {
      const isFile = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.raw.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log('beforeRemove', isFile, file)
      if (isFile && isLt5M) {
        return this.$confirm(`${this.$t('editTanks.removeFile')} ${file.name}?`)
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
        VXETable.modal.message({ message: `${this.$t('editTanks.tankRequireFailed')}@${error}`, status: 'warning', id: '1' })
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
        VXETable.modal.message({ message: `${this.$t('editTanks.deviceListRequireFailed')}@${error}`, status: 'warning', id: '1' })
      })
      console.log(response)
      this.deviceList = response.data.data.data.map(item => {
        return { deviceSn: item.deviceSn }
      })
      console.log('设备列表', this.deviceList)
    },
    async getMedia () {
      const response = await this.$http.post('/tank/media/list').catch(error => {
        VXETable.modal.message({ message: `${this.$t('editTanks.mediumListRequireFailed')}@${error}`, status: 'warning', id: '1' })
      })
      this.mediaList = response.data.data.data
      console.log(this.mediaList)
    },
    editTank () {
      this.$refs.editTankForm.validate(valid => {
        if (valid) {
          this.editTankForm.id = this.tankId
          this.editTankForm.tankModel = this.selectedTag
          this.editTankForm.attachment = this.attachmentArray.join(';')
          console.log(this.editTankForm)
          if (this.editTankForm.tankModel === undefined) {
            VXETable.modal.message({ message: `${this.$t('editTanks.noTankModelSelected')}`, status: 'warning' })
            this.activeName = 'second'
          } else {
            this.$http.post('/tank/edit', this.editTankForm).then(response => {
              console.log(response.data.code)
              if (response.data.code === 0) {
                VXETable.modal.message({ message: `${this.$t('editTanks.editSuccess')}`, status: 'success', id: '1' })
                this.createTank = true
                this.backToList()
              } else {
                VXETable.modal.message({ message: `${this.$t('editTanks.editFailed')}@${response.data.message}`, status: 'warning', id: '1' })
              }
            }).catch(error => {
              VXETable.modal.message({ message: `${this.$t('editTanks.editFailed')}@${error}`, status: 'warning' })
            })
          }
        } else {
          VXETable.modal.message({ message: `${this.$t('editTanks.checkRequired')}`, status: 'warning', id: '1' })
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
