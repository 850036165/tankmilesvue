<template>
  <div class="editBody">
    <!--    <span>{{$route.query.user}}</span>-->
    <el-card
      class="leftCard"
    >
      <avatar-cropper
        @upload-handler="uploadFunction"
        :output-quality="1"
        :upload-headers="myHeaders"
        @uploading="handleUploading"
        @uploaded="handleUploaded"
        @completed="handleCompleted"
        @error="handlerError"
        trigger="#pick-avatar"
        upload-url="https://api.tankmiles.com:9443/user/avatar/upload"
        :labels="button"
      />
      <div style="width: 200px;height: 200px;position: relative;border-radius: 50%; overflow:hidden;">
        <el-avatar
          v-loading="uploading"
          style="display: block;"
          icon="el-icon-user-solid"
          :size="200"
          :src="userData.avatarUrl"
          :key="userData.avatarUrl"
        />
        <div
          style="position:absolute;height: 30px;width: 200px;background-color: #9DA7B8;bottom: 0;opacity:0.5;display: flex;justify-content: center;align-items: center"
        >
          <i
            class="el-icon-camera cameraHover"
            id="pick-avatar"
          />
        </div>
      </div>
      <div style="display: flex; align-items: baseline;justify-content: space-between">
        <p
          style="
font-size: 20px;
font-weight: bold;
color: #58647a;"
        >
          {{ userData.nickName }}
        </p>
        <p
          v-if="!showInput"
          @click="editForm"
          style="
          user-select: none;
vertical-align:bottom;
font-size: 10px;
color: #58647a;cursor: pointer"
        >
          {{ $t('personalSetting.edit') }}
        </p>
        <p
          @click="saveEdit"
          v-if="showInput"
          style="
          user-select: none;
vertical-align:bottom;
font-size: 10px;
color: #58647a;cursor: pointer"
        >
          {{ $t('personalSetting.save') }}
        </p>
      </div>
      <el-form
        hide-required-asterisk
        inline-message
        :model="userDataTemp"
        :rules="rules"
        size="mini"
        style="width: 200px"
        label-position="top"
      >
        <el-form-item
          prop="nickName"
          style="height: 50px"
        >
          <span slot="label"><i
            class="el-icon-user"
            style="font-weight: bold"
          />{{ $t('personalSetting.displayName') }}</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.nickName }}
          </p>
          <el-input
            :disabled="!showInput"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userDataTemp.nickName"
          />
        </el-form-item>
        <el-form-item
          prop="email"
          style="height: 50px"
        >
          <span slot="label"><i
            class="el-icon-message"
            style="font-weight: bold"
          />{{ $t('personalSetting.email') }}</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.email }}
          </p>
          <el-input
            :disabled="true"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userDataTemp.email"
          />
        </el-form-item>
        <el-form-item
          prop="mobile"
          style="height: 50px"
        >
          <span slot="label"><i
            class="el-icon-mobile-phone"
            style="font-weight: bold"
          /> {{ $t('personalSetting.mobile') }}</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.mobile }}
          </p>
          <el-input
            :disabled="!showInput"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userDataTemp.mobile"
          />
        </el-form-item>
        <el-form-item
          prop="fixedPhone"
          style="height: 50px"
        >
          <span slot="label"><i
            class="el-icon-place"
            style="font-weight: bold"
          /> {{ $t('personalSetting.phone') }}</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.fixedPhone }}
          </p>
          <el-input
            :disabled="!showInput"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userDataTemp.fixedPhone"
          />
        </el-form-item>
      </el-form>
      <el-button
        circle
        icon="el-icon-key"
        type="info"
        @click="openDialog"
      />
    </el-card>
    <el-card>
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
      >
        <el-breadcrumb-item :to="{ path: '/dashboard' }">
          {{ $t('personalSetting.dashboard') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ $t('personalSetting.tankManagement') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/usermanage' }">
          {{ $t('personalSetting.userManagement') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.query.user }}</el-breadcrumb-item>
      </el-breadcrumb>
      <h1
        style="
font-size: 20px;
font-weight: 700;
text-align: left;
color: #58647a;"
      >
        {{ $t('personalSetting.accountInfo') }}
      </h1>
      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="$t('personalSetting.operationHistory')"
          name="first"
        >
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
            <!--自定义空数据模板-->
            <template v-slot:empty>
              <span style="color: #2F74EB;">
                <span>{{ $t('personalSetting.contactCIMC') }}</span>
              </span>
            </template><vxe-grid />
          </vxe-grid>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      v-bind="$attrs"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div
        slot="title"
        style="font-weight: bold;font-size: 20px;color: #2F74EB"
      >
        <i
          class="el-icon-unlock"
          style="margin: 3px"
        />
        <span>{{ $t('personalSetting.modifyPassword') }}</span>
      </div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules1"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item
          :label="$t('personalSetting.password')"
          prop="pass"
        >
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          :label="$t('personalSetting.confirmPassword')"
          prop="checkPass"
        >
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()"
          >
            {{ $t('personalSetting.submit') }}
          </el-button>
          <el-button @click="resetForm()">
            {{ $t('personalSetting.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import AvatarCropper from 'vue-avatar-cropper'
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import axios from 'axios'
import md5 from 'js-md5'
export default {
  name: 'PersonalSetting',
  components: { AvatarCropper },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`${this.$t('personalSetting.inputPassword')}`))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`${this.$t('personalSetting.inputPasswordAgain')}`))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(`${this.$t('personalSetting.passwordError')}`))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: null,
        checkPass: null
      },
      dialogVisible: false,
      lastAvatarUrl: null,
      uploading: false,
      myHeaders: { authtoken: 1 },
      rules: {
        nickName: [{
          required: true,
          message: `${this.$t('personalSetting.inputName')}`,
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: `${this.$t('personalSetting.inputEmail')}`,
          trigger: 'blur'
        },
        {
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, // eslint-disable-line
          message: `${this.$t('personalSetting.emailFormatError')}`,
          trigger: ['blur', 'change']
        }],
        fixedPhone: [],
        mobile: [
          {
            required: true,
            pattern: /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/,
            message: `${this.$t('personalSetting.mobileFormatError')}`,
            trigger: ['blur', 'change']
          }
        ]
      },
      rules1: {
        pass: [
          {
            required: true,
            message: `${this.$t('personalSetting.lengthLimit')}`,
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' },
          { min: 5, max: 20, message: `${this.$t('personalSetting.length5to20')}`, trigger: 'blur' }
        ],
        checkPass: [
          {
            required: true,
            message: `${this.$t('personalSetting.inputPasswordAgain')}`,
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' },
          { min: 5, max: 20, message: `${this.$t('personalSetting.length5to20')}`, trigger: 'blur' }
        ]
      },
      tableHeight: 0,
      activeName: 'first',
      userName: null,
      showInput: false,
      userData: {
        name: '',
        nickName: '',
        email: '',
        mobile: '',
        fixedPhone: '',
        roles: null,
        password: '',
        enabled: true,
        avatarUrl: null
      },
      userDataTemp: {
        name: '',
        nickName: '',
        email: '',
        mobile: '',
        fixedPhone: '',
        roles: null,
        password: '',
        enabled: true,
        avatarUrl: null
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
          defaultSort: {
            field: 'name',
            order: 'asc'
          },
          trigger: 'default',
          remote: true
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
                if (typeof sort.property === 'number') {
                  console.log('当前sort为number', sort.property)
                } else {
                  switch (sort.property) {
                    case 'name':
                      sort.property = 0
                      break
                    case 'nickName':
                      sort.property = 1
                      break
                    case 'email':
                      sort.property = 2
                      break
                    case 'mobile':
                      sort.property = 3
                      break
                    case 'fixedPhone':
                      sort.property = 4
                      break
                    case 'createdAt':
                      sort.property = 5
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
              queryParams.idStr = this.userName
              console.log('请求值3', queryParams)
              // 请求数据
              const response = await this.$http.post('/visit/history/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `${this.$t('personalSetting.monitorName')}``请求失败@${error}`, status: 'error', size: 'medium' })
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
          custom: true
        },
        columns: [
          { type: 'seq', width: 50, align: 'center' },
          { field: 'operation', align: 'center', title: `${this.$t('personalSetting.user')}`, sortable: true, minWidth: 180 },
          { field: 'roles', align: 'center', title: `${this.$t('personalSetting.routingPath')}`, minWidth: 150 },
          { field: 'createdAt', align: 'center', title: `${this.$t('personalSetting.operationDate')}`, sortable: true, minWidth: 150, formatter: this.formatDate2 }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        console.log(this.ruleForm)
        this.$http.post('user/edit', { name: this.userName, password: md5(this.ruleForm.checkPass) })
        VXETable.modal.message({ message: `${this.$t('personalSetting.modifySuccess')}`, status: 'success', size: 'medium', id: 'unique1' })
        this.dialogVisible = false
        this.$refs.ruleForm.resetFields()
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    openDialog () {
      this.dialogVisible = true
    },
    uploadFunction (file) {
      console.log(file)
    },
    handleUploading (form, xhr) {
      this.uploading = true
      console.log('handleUploading', form, xhr)
    },
    handleUploaded (response) {
      console.log('handleUploaded', response)
      this.$http.post('user/edit', { name: this.userName, avatarUrl: this.userData.avatarUrl })
      VXETable.modal.message({ message: `${this.$t('personalSetting.modifySuccess')}`, status: 'success', size: 'medium', id: 'unique1' })
    },
    handleCompleted (response, form, xhr) {
      console.log('handleCompleted', response.code)
      if (response.code !== 0) {
        this.uploading = false
        VXETable.modal.message({ message: `${this.$t('personalSetting.uploadFailed')}`, status: 'error', size: 'medium', id: 'unique1' })
      } else {
        // 如果上次上传过头像则删除上次头像
        if (this.lastAvatarUrl !== null) {
          this.$http.post('/user/avatar/delete', { attachment: this.lastAvatarUrl }).then((response) => {
            console.log(response)
          })
        }
        this.lastAvatarUrl = response.data
        this.userData.avatarUrl = axios.defaults.baseURL + response.data
        this.$nextTick(() => {
          this.uploading = false
        })

        console.log('头像地址', this.userData.avatarUrl)
      }
    },
    handlerError (message, type, xhr) {
      console.log('handlerError', message, type, xhr)
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    async  getUserDetail () {
      const { data: response } = await this.$http.post('/user/detail', { name: this.userName })
      this.userData = response.data
      console.log('userdata', response)
    },
    editForm () {
      this.showInput = true
      this.userDataTemp = XEUtils.clone(this.userData, true)
      console.log(this.userDataTemp)
    },
    saveEdit () {
      this.$http.post('user/edit', this.userDataTemp).then(() => {
        this.getUserDetail()
      })
      VXETable.modal.message({ message: `${this.$t('personalSetting.modifySuccess')}`, status: 'success', size: 'medium', id: 'unique1' })
      this.showInput = false
    }
  },
  mounted () {
    this.myHeaders.authtoken = sessionStorage.getItem('token')
    this.tableHeight = window.innerHeight - 220
    this.userName = sessionStorage.getItem('userName')
    console.log('用户信息', this.userData)
    this.getUserDetail()
  },
  computed: {
    button () {
      return { submit: `${this.$t('personalSetting.submit')}`, cancel: `${this.$t('personalSetting.cancel')}` }
    }
  }
}
</script>

<style scoped>
/deep/.el-dialog__body{
  padding: 10px 20px;
}
.cameraHover {
  font-weight: 200;
  color: white;
  font-size: 20px;
  cursor: pointer
}

.cameraHover:hover {
  color: #5b5b65;
}

.formText {
  margin: 0 0 0 20px;
  line-height: 28px;
  height: 28px;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

/deep/ .el-form-item__label {
  padding: 0 !important;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  color: #2f74eb;
  letter-spacing: 1px;
}

.editBody {
  padding: 0;
  display: grid;
  grid-template-columns: 300px auto;
  grid-column-gap: 10px;
}

.leftCard {
  background-color: #F5F7FA;
  display: flex;
  justify-content: center;
}

.el-form-item {
  margin-bottom: 30px !important;
}
</style>
