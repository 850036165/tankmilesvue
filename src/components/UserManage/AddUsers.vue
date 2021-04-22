<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        资产管理
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/usermanage' }">
        账户管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>新建账户</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style="margin-right: auto;margin-left: 10px">
      新建账户
    </h1>
    <el-card>
      <div style="display: flex;justify-content: center;grid-column-gap: 30px">
        <div style="width: 50%">
          <p style="width: 72px;height: 23px;font-size: 18px;font-weight: 700;text-align: left;color: #58647a;">
            基础信息
          </p>
          <el-form
            style="width: 100%;"
            ref="addUserForm"
            :model="addUserForm"
            :rules="userRuleForm"
            size="small"
            label-width="80px"
          >
            <el-form-item
              prop="avatar"
            >
              <div
                class="avatarDiv"
                style="width: 150px;margin: auto"
                v-loading="uploading"
              >
                <el-avatar
                  :size="150"
                  :src="userAvatar"
                  :key="userAvatar"
                  class="avatarClass"
                />
                <el-button
                  id="pick-avatar"
                  type="primary"
                  class="uploadButton"
                >
                  上传
                </el-button>
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
              </div>
            </el-form-item>
            <el-row>
              <el-form-item
                label="公司"
                prop="groupId"
              >
                <el-select
                  style="width: 100%"
                  v-model="addUserForm.groupId"
                  placeholder="请选择公司"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="显示名称"
                prop="nickName"
              >
                <el-input
                  v-model="addUserForm.nickName"
                  placeholder="请输入显示名称"
                  clearable
                  show-word-limit
                  :maxlength="10"
                  prefix-icon="el-icon-user-solid"
                  :style="{width: '100%'}"
                />
              </el-form-item>
              <el-form-item
                label="邮箱"
                prop="email"
              >
                <el-input
                  v-model="addUserForm.email"
                  placeholder="请输入邮箱"
                  clearable
                  prefix-icon="el-icon-message"
                  :style="{width: '100%'}"
                />
              </el-form-item>
              <el-form-item
                label="手机号"
                prop="mobile"
              >
                <el-input
                  v-model="addUserForm.mobile"
                  placeholder="请输入手机号"
                  clearable
                  prefix-icon="el-icon-mobile-phone"
                  :style="{width: '100%'}"
                />
              </el-form-item>
              <el-form-item
                label="固定电话"
                prop="fixedPhone"
              >
                <el-input
                  v-model="addUserForm.fixedPhone"
                  placeholder="请输入固定电话"
                  clearable
                  prefix-icon="el-icon-mobile-phone"
                  :style="{width: '100%'}"
                />
              </el-form-item>
              <el-row>
                <el-col :span="16">
                  <el-form-item
                    ref="password"
                    label="密码"
                    prop="password"
                    style="height: 40px"
                  >
                    <el-input
                      ref="test"
                      oncut="return false"
                      oncopy="return false"
                      onpaste="return false"
                      id="passwordInput"
                      autocomplete="off"
                      v-model="addUserForm.password"
                      placeholder="默认密码"
                      :disabled="passwordDisable"
                      prefix-icon="el-icon-lock"
                      show-password
                      :style="{width: '100%'}"
                    />
                    <password
                      v-if="!defaultPassword"
                      v-model="addUserForm.password"
                      :strength-meter-only="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="默认密码"
                    prop="defaultPassword"
                  >
                    <el-switch
                      v-model="defaultPassword"
                      @change="changeDefaultPassword"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-form>
        </div>
        <div style="width: 50%;height: 100%">
          <p style="width: 72px;height: 23px;font-size: 18px;font-weight: 700;text-align: left;color: #58647a;">
            分配角色
          </p>
          <vxe-grid
            @checkbox-change="selectRole"
            style="padding-left:20px"
            row-id="name"
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
            <!--自定义列插槽-->
            <template v-slot:content="{row}">
              <div>
                <p style="font-weight: bold;color: #2a68d3;margin: 0 auto;width: 80px;font-size: 15px">
                  权限列表
                </p>
                <vxe-table
                  empty-text="此角色暂未分配权限"
                  stripe
                  style="width: 80%;margin: 0 auto"
                  align="center"
                  :data="row.urls"
                >
                  <vxe-table-column
                    field="id"
                    title="UrlId"
                    width="80"
                  />
                  <vxe-table-column
                    field="role"
                    title="角色"
                    width="100"
                  />
                  <vxe-table-column
                    field="url"
                    title="路由路径"
                  />
                </vxe-table>
              </div>
            </template>
            <!--自定义空数据模板-->
            <template v-slot:empty>
              <p style="color: #2F74EB;">
                暂无角色可分配
              </p>
            </template>
          </vxe-grid>
          <div style="width: 200px;margin: 50px auto">
            <el-button
              style="width: 80px; border-radius: 5%"
              size="small"
              type="primary"
              @click="submitForm"
              v-loading="addUserLoading"
            >
              提交
            </el-button>
            <el-button
              style="width: 80px; border-radius: 5%"
              @click="resetForm"
              size="small"
            >
              重置
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      custom-class="deleteDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
    >
      <div
        slot="title"
        style="font-weight: bold;font-size: 20px;color: #33B892"
      >
        <i
          class="el-icon-success"
          style="margin: 3px"
        />
        <span>新增成功</span>
      </div>
      <p
        style="
font-size: 14px;
font-weight: bold;
text-align: left;
color: #58647a;"
      >
        账户:<span style="color: #006af1">{{ addUserForm.nickName }}</span><br>
        邮箱:<span style="color: #006af1">{{ addUserForm.email }}</span>
      </p>
      <p>新建成功，是否发送邀请?</p>
      <p
        style="
font-size: 14px;
font-weight: bold;
text-align: left;
color: #006af1;"
      >
        通知预览
      </p>
      <p>
        亲爱的用户<br>
        欢迎使用罐程平台，请使用以下信息登录：
      </p>
      <p>
        网址：<a href="https://www.tankmiles.com">Tankmiles.com</a><br>
        用户名:{{ addUserForm.email }}<br>
        密码:{{ tempAddUserForm.password }}
      </p>
      <p>
        如有疑问请联系我们<br>
        tankmiles@cimc.com
      </p>
      <p>
        是否启用<br>
        <el-switch
          @change="enableUsers"
          v-model="enabledUsers"
          active-color="#33B892"
          inactive-color="#FA675C"
        />
      </p>
      <div slot="footer">
        <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 50px;border-radius:0 0 3px 3px ">
          <!--        <div style="display: flex;justify-content: center;align-items: flex-end;">-->
          <div
            @click="leavePage"
            class="deleteConfirm"
          >
            <p class="deleteText">
              稍后通知
            </p>
          </div>
          <div
            @click="sendMessage"
            class="deleteCancel"
            v-loading="mailLoading"
          >
            <p
              class="deleteText"
            >
              确认发送
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AvatarCropper from 'vue-avatar-cropper'
import Password from 'vue-password-strength-meter'
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import axios from 'axios'
import md5 from 'js-md5'
import emailContent from '@/assets/JS/emailContent'

export default {
  name: 'AddUsers',
  components: { Password, AvatarCropper },
  computed: {
    button () {
      return { submit: '提交', cancel: '取消' }
    }
  },
  data () {
    return {
      tempAddUserForm: {
        name: '',
        nickName: '',
        email: '',
        mobile: '',
        fixedPhone: '',
        roles: null,
        password: '',
        enabled: true,
        avatarUrl: null,
        groupId: null
      },
      chosenGroupId: null,
      groupList: null,
      mailLoading: false,
      enabledUsers: true,
      addUserLoading: false,
      lastAvatarUrl: null,
      uploading: false,
      myHeaders: { authtoken: 1 },
      dialogVisible: false,
      projectList: null,
      tempProjectList: [],
      userAvatar: 'https://oss.tankmiles.com/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg',
      defaultPassword: true,
      passwordDisable: true,
      addUserForm: {
        name: '',
        nickName: '',
        email: '',
        mobile: '',
        fixedPhone: '',
        roles: null,
        password: '',
        enabled: true,
        avatarUrl: null,
        groupId: null
      },
      userRuleForm: {
        groupId: [{
          required: true,
          message: '请选择所属公司',
          trigger: 'blur'
        }],
        nickName: [{
          required: true,
          message: '请输入显示名称',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        },
        {
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, // eslint-disable-line
          message: '邮箱格式不正确',
          trigger: ['blur', 'change']
        }],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change']
          }
        ],
        fixedPhone: [],
        password: [{
          required: false,
          message: '请输入密码',
          trigger: 'blur'
        },
        { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      },
      gridOptions: {
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
        filterConfig: {
          remote: false
        },
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              if (this.chosenGroupId) {
                const response = await this.$http.post('/security/role/list', { groupId: this.chosenGroupId }).catch((error) => {
                  VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
                })
                console.log('源数据', response)
                return response.data.data.data
              }
            }
          }
        },
        columns: [
          { type: 'checkbox', width: 50, align: 'center' },
          { type: 'seq', width: 50, align: 'center' },
          { field: 'displayName', title: '角色名', minWidth: 30 },
          { field: 'roleName', title: '角色', minWidth: 30 },
          { field: 'projectId', title: '管理项目', minWidth: 30, formatter: this.findProject },
          { type: 'expand', title: '#', width: 40, align: 'center', slots: { content: 'content' } }
        ]
      }
    }
  },
  created () {
    this.getProjectList()
    this.getGroupList()
  },
  mounted () {
    this.myHeaders.authtoken = sessionStorage.getItem('token')
    this.chosenGroupId = localStorage.getItem('groupId')
  },
  methods: {
    async  getGroupList () {
      const response = await this.$http.post('/project/group/list', {
        currentPage: 0,
        keywords: '',
        order: 'DESC',
        orderColumnIndex: 0,
        pageSize: 999
      })
      this.groupList = response.data.data.data
    },
    sendMessage () {
      this.mailLoading = true
      const mailData = {
        subject: '',
        toName: this.addUserForm.nickName,
        toEmail: this.addUserForm.email,
        bodyHtml: null
      }
      if (window.localStorage.getItem('lang') === 'zh') {
        mailData.subject = '罐程-新用户通知'
        mailData.bodyHtml = emailContent(this.tempAddUserForm)
      } else {
        mailData.subject = 'Tankmiles-UserNotifications'
        // 如果不是中文，则应用英文模板
        mailData.bodyHtml = emailContent(this.tempAddUserForm)
      }
      this.$http.post('mail/send', mailData).then(response => {
        console.log(response)
        if (response.data.code === 0) {
          this.dialogVisible = false
          this.mailLoading = false
          this.leavePage()
          VXETable.modal.message({
            message: '邮件发送成功',
            status: 'success',
            size: 'medium',
            id: 'unique1'
          })
        } else {
          this.mailLoading = false
          VXETable.modal.message({
            message: `发送失败@${response.data.message}`,
            status: 'error',
            size: 'medium',
            id: 'unique1'
          })
        }
      }).catch(error => {
        this.mailLoading = false
        VXETable.modal.message({
          message: `发送失败@${error}`,
          status: 'error',
          size: 'medium',
          id: 'unique1'
        })
      })
    },
    enableUsers () {
      this.$http.post('/user/edit', { name: this.addUserForm.name, enabled: this.enabledUsers })
        .then((response) => {
          console.log(response)
          if (response.data.code !== 0) {
            this.enabledUsers = !this.enabledUsers
            VXETable.modal.message({
              message: `启用失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          }
        })
        .catch((error) => {
          console.log(error)
          this.enabledUsers = !this.enabledUsers
          VXETable.modal.message({
            message: `修改失败@${error}`,
            status: 'error',
            size: 'medium',
            id: 'unique1'
          })
        })
    },
    leavePage () {
      this.$router.push('/usermanage')
    },
    openConfirmDialog () {
      this.dialogVisible = true
    },
    selectRole (value) {
      console.log(value.row)
    },
    handleData (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          if (data[i].children.length < 1) {
            data[i].children = undefined
          } else {
            this.handleData(data[i].children)
          }
        }
      }
      return data
    },
    async getProjectList () {
      const ProjectList = await this.$http.post('project/list')
      console.log('项目列表', ProjectList)
      if (ProjectList.data.code !== 0) {
        await VXETable.modal.message({
          message: `请求项目列表失败@${ProjectList.data.message}`,
          status: 'error',
          size: 'medium',
          id: 'unique1'
        })
      } else {
        this.projectList = this.handleData(ProjectList.data.data)
        console.log('项目列表级联数据', this.projectList)
        await VXETable.modal.message({
          message: '请求项目列表成功',
          status: 'success',
          size: 'medium',
          id: 'unique1'
        })
      }
    },
    findProject (value) {
      this.tempProjectList = XEUtils.toTreeArray(this.projectList)
      console.log('数组查找', this.tempProjectList)
      if (this.tempProjectList.length === 0) {
        console.log('error')
        return `项目名称解析失败${value}`
      } else {
        const finalValue = this.tempProjectList.find(item => item.id === value.cellValue)
        console.log('finalValue', finalValue)
        return finalValue.name
      }
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
    },
    handleCompleted (response, form, xhr) {
      console.log('handleCompleted', response.code)
      if (response.code !== 0) {
        this.uploading = false
        VXETable.modal.message({ message: '上传失败', status: 'error', size: 'medium', id: 'unique1' })
      } else {
        // 如果上次上传过头像则删除上次头像
        if (this.lastAvatarUrl !== null) {
          this.$http.post('/user/avatar/delete', { attachment: this.lastAvatarUrl }).then((response) => {
            console.log(response)
          })
        }
        this.lastAvatarUrl = response.data
        this.userAvatar = axios.defaults.baseURL + response.data
        this.$nextTick(() => {
          this.uploading = false
        })
        console.log('头像地址', this.userAvatar)
        VXETable.modal.message({ message: '上传成功', status: 'success', size: 'medium', id: 'unique1' })
      }
    },
    handlerError (message, type, xhr) {
      console.log('handlerError', message, type, xhr)
    },
    changeDefaultPassword (value) {
      console.log(value)
      if (value === true) {
        document.getElementById('passwordInput').setAttribute('placeholder', '默认密码')
        this.$refs.password.resetField()
        this.passwordDisable = true
        this.addUserForm.passwordCheck = ''
        this.userRuleForm.password[0].required = false
      } else {
        document.getElementById('passwordInput').setAttribute('placeholder', '请输入密码')
        this.addUserForm.password = ''
        this.passwordDisable = false
        this.userRuleForm.password[0].required = true
      }
    },
    submitForm () {
      this.$refs.addUserForm.validate(valid => {
        if (!valid) return 0
        if (this.defaultPassword === true && this.addUserForm.password === '') {
          this.addUserForm.password = 'changeMe!'
        }
        this.addUserLoading = true
        let rolesSelected = this.$refs.xGrid.getCheckboxRecords().map(item => {
          return item.roleName
        })
        console.log(rolesSelected, 'rolesSelected')
        rolesSelected = rolesSelected.join(';')
        this.addUserForm.roles = rolesSelected
        this.addUserForm.avatarUrl = this.userAvatar
        this.addUserForm.name = this.addUserForm.email
        this.tempAddUserForm = XEUtils.clone(this.addUserForm, true)
        this.addUserForm.password = md5(this.addUserForm.password)
        console.log(this.addUserForm)
        this.$http.post('/user/create', this.addUserForm).then(
          response => {
            if (response.data.code !== 0) {
              this.addUserLoading = false
              this.addUserForm.password = ''
              VXETable.modal.message({
                message: `新增失败@${response.data.message}`,
                status: 'error',
                size: 'medium',
                id: 'unique1'
              })
            } else {
              this.addUserLoading = false
              this.openConfirmDialog()
            }
          }).catch((error) => {
          this.addUserForm.password = ''
          this.addUserLoading = false
          VXETable.modal.message({ message: `新增失败@${error}`, status: 'error', size: 'medium', id: 'unique2' })
        })
      })
    },
    resetForm () {
      this.$refs.addUserForm.resetFields()
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .v-modal{
  z-index: 99!important;
}
.uploadButton {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/deep/ .el-dialog__body {
  padding-bottom: 0;
  padding-top: 0;
}

/deep/ .el-card__body {
  padding-bottom: 0;
  padding-top: 0;
}

.avatarClass {
  border: #5b5b65 1px dashed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
}

.avatarDiv:hover .uploadButton {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatarClass:hover {
  cursor: pointer;
  border: #2a68d3 1px solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.deleteConfirm {
  background-color: #16243D;
  border-radius: 0 0 0 3px;
  cursor: pointer
}

.deleteConfirm:hover {
  background-color: #292f4e;
}

.deleteCancel {
  background-color: #2F74EB;
  border-radius: 0 0 3px 0;
  cursor: pointer
}

.deleteCancel:hover {
  background-color: #6f94d5;
}

.deleteText {
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Light;
  font-weight: 300;
  text-align: center;
  color: #ffffff;
  letter-spacing: 1px;
}

/deep/ .deleteDialog {
  border-radius: 4px !important;
}

/deep/ .el-dialog__footer {
  padding: 0;
  border: none;
}

/deep/ .el-dialog__body {
  padding: 5px 30px 10px;
  border-radius: 0;
}

/deep/ .deleteDialog {
  border-radius: 5px;
}
</style>
