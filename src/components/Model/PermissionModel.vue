<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        模型管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限模型</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            权限模型
          </h1>
          <!-- <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
          >
            Button
          </el-button>-->
        </div>
      </div>
      <div>
        <vxe-grid
          row-id="name"
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
          <!--自定义列插槽-->
          <template v-slot:content="{row}">
            <div>
              <p style="font-weight: bold;color: #2a68d3;margin: 0 auto;width: 80px;font-size: 15px">
                权限列表
              </p>
              <vxe-table
                empty-text="此角色暂未分配权限"
                :header-cell-style="headerCellStyle1"
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
          <template v-slot:projectOperation="{row}">
            <div class="operationButton">
              <i
                class="el-icon-edit-outline deleteIcon"
                @click="openCreateDialog(row)"
              />
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除此角色吗？"
                @confirm="deleteRole(row)"
              >
                <i
                  slot="reference"
                  class="el-icon-delete deleteIcon"
                  title="删除"
                  @click="getRole(row)"
                />
              </el-popconfirm>
            </div>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div style="display: grid;grid-template-columns: 100px 120px;grid-template-rows: 40px">
              <div style="display: flex;justify-content:center;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="openAddDialog"
                />
                <span class="addText">新增角色</span>
              </div>
            </div>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: #2F74EB;">
              <span>暂无角色</span>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="编辑权限路由"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div
        slot="title"
        style="font-weight: bold;font-size: 20px;color: #2F74EB"
      >
        <i
          class="el-icon-document-checked"
          style="margin: 3px"
        />
        <span>编辑权限路由</span>
      </div>
      <el-checkbox
        style="width: 200px;margin:0 auto;height: 100%;display: flex;justify-content: start;align-items: center;flex-wrap: wrap"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
      <el-checkbox-group
        style="width: 200px;margin:0 auto;height: 100%;display: flex;justify-content: start;align-items: center;flex-wrap: wrap"
        v-model="checkList"
      >
        <el-checkbox
          @change="pushURL(routerList)"
          style="width: 100%;height: 20px"
          :key="item"
          v-for="item in routerList"
          :label="item"
        >
          {{ item }}
        </el-checkbox>
      </el-checkbox-group>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false;$refs.xGrid.commitProxy('query')"
          size="small"
        >取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addNewRules"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :show-close="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <div
        slot="title"
        style="font-weight: bold;font-size: 20px;color: #2F74EB"
      >
        <i
          class="el-icon-user"
          style="margin: 3px"
        />
        <span>添加角色</span>
      </div>
      <el-form
        style="margin: 20px 0;width: 300px"
        ref="addRoleForm"
        :model="addRoleForm"
        :rules="ruleForm"
        size="small"
        label-width="100px"
      >
        <el-form-item
          label="角色"
          prop="roleName"
        >
          <el-input
            v-model="addRoleForm.roleName"
            placeholder="请输入角色"
            :maxlength="20"
            show-word-limit
            clearable
            prefix-icon="el-icon-user"
            :style="{width: '100%'}"
          />
        </el-form-item>
        <el-form-item
          label="角色名称"
          prop="displayName"
        >
          <el-input
            v-model="addRoleForm.displayName"
            placeholder="请输入角色名称"
            clearable
            prefix-icon="el-icon-user"
            :style="{width: '100%'}"
          />
        </el-form-item>
        <el-form-item
          label="对应项目"
          prop="projectId"
        >
          <el-select
            @change="selectProject"
            v-model="addRoleForm.projectId"
            filterable
            placeholder="请选择项目"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          @click="cancelAddRole"
          size="small"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="addRole"
          size="small"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'PermissionModel',
  data () {
    return {
      checkAll: true,
      isIndeterminate: false,
      tempProjectList: [],
      projectIdNode: 0,
      projectListProps: {
        multiple: false,
        label: 'name',
        value: 'id',
        children: 'children',
        checkStrictly: true
      },
      projectList: null,
      addDialogVisible: false,
      addRoleForm: {
        roleName: null,
        displayName: null,
        projectId: null,
        groupId: null
      },
      ruleForm: {
        roleName: [{
          required: true,
          message: '请输入角色',
          trigger: 'blur'
        }],
        displayName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }],
        projectId: [{
          required: true,
          message: '请选择项目',
          trigger: 'blur'
        }]
      },
      tempRole: null,
      tempPermissionArray: null,
      checkList: [],
      routerList: [],
      dialogVisible: false,
      tableHeight: 0,
      gridOptions: {
        align: 'center',
        resizable: true,
        showOverflow: true,
        exportConfig: {
          types: ['xlsx', 'csv', 'html', 'xml', 'txt']
        },
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
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              if (this.chosenGroupId !== null) {
                const response = await this.$http.post('/security/role/list', { groupId: this.currentGroupId }).catch((error) => {
                  VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
                })
                console.log('源数据', response)
                const projectData = response.data.data.data
                console.log('修改后', projectData)
                return projectData
              }
            }
          }
        },
        columns: [
          { type: 'seq', width: 50, align: 'center' },
          { field: 'displayName', title: '角色名', minWidth: 30 },
          { field: 'roleName', title: '角色', minWidth: 30 },
          { field: 'projectId', title: '管理项目', minWidth: 30, formatter: this.findProject },
          { field: 'createdAt', title: '创建时间', minWidth: 100, formatter: this.formatDate2 },
          { title: '操作', align: 'center', maxWidth: 80, slots: { default: 'projectOperation' } },
          { type: 'expand', title: '#', width: 50, align: 'center', slots: { content: 'content' } }
        ]
      }
    }
  },
  mounted () {
    this.currentGroupId = window.localStorage.getItem('groupId')
    this.getProjectList()
    this.tableHeight = window.innerHeight - 200
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkList = val ? this.routerList : []
      this.isIndeterminate = false
    },
    selectProject (value) {
      console.log(value)
      const result = this.projectList.find(item => item.id === value)
      this.addRoleForm.groupId = result.projectGroup.id
      console.log(this.addRoleForm.groupId)
    },
    findProject (value) {
      if (this.projectList.length === 0) {
        console.log('error')
        return `项目名称解析失败${value}`
      } else {
        const finalValue = this.projectList.find(item => item.id === value.cellValue)
        console.log(finalValue, 'test1')
        console.log(this.projectList, 'test2')
        if (finalValue) {
          return `${finalValue.name}@${finalValue.projectGroup.name}`
        } else {
          return value
        }
      }
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
        this.projectList = ProjectList.data.data
        console.log('项目列表级联数据', this.projectList)
        await VXETable.modal.message({
          message: '请求项目列表成功',
          status: 'success',
          size: 'medium',
          id: 'unique1'
        })
      }
    },
    addRole () {
      this.$refs.addRoleForm.validate(valid => {
        if (!valid) return
        console.log(this.addRoleForm, '用户信息')
        this.$http.post('/security/role/create', {
          displayName: this.addRoleForm.displayName,
          roleName: this.addRoleForm.roleName,
          projectId: this.addRoleForm.projectId,
          groupId: this.addRoleForm.groupId
        }).then(
          response => {
            if (response.data.code !== 0) {
              VXETable.modal.message({
                message: `添加失败@${response.data.message}`,
                status: 'error',
                size: 'medium',
                id: 'unique1'
              })
            } else {
              this.addRoleForm.projectId = null
              this.$refs.addRoleForm.resetFields()
              this.addDialogVisible = false
              this.$refs.xGrid.commitProxy('query')
              VXETable.modal.message({
                message: '添加成功',
                status: 'success',
                size: 'medium',
                id: 'unique1'
              })
            }
          }
        ).catch((error) => {
          VXETable.modal.message({ message: `添加失败@${error}`, status: 'error', size: 'medium', id: 'unique2' })
        })
      })
    },
    cancelAddRole () {
      this.addRoleForm.projectId = null
      this.$refs.addRoleForm.resetFields()
      this.addDialogVisible = false
    },
    getRole (row) {
      console.log(row)
      this.tempRole = row
    },
    deleteRole () {
      console.log('确认删除', this.tempRole)
      this.$http.post('/security/role/delete', { roleName: this.tempRole.roleName }).then(
        response => {
          if (response.data.code !== 0) {
            VXETable.modal.message({
              message: `角色删除失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          } else {
            this.$refs.xGrid.remove(this.tempRole)
            VXETable.modal.message({
              message: '角色删除成功',
              status: 'success',
              size: 'medium',
              id: 'unique1'
            })
          }
        }
      ).catch((error) => {
        VXETable.modal.message({ message: `角色删除失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
      })
    },
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    compareRouterList (oldArray, newArray) {
      const result = []
      for (let i = 0; i < oldArray.length; i++) {
        if (newArray.indexOf(oldArray[i]) === -1) {
          console.log('差异值为', oldArray[i])
          result.push(oldArray[i])
        } else {
          console.log('无差异值')
        }
      }
      return result
    },
    addNewRules () {
      console.log('待提交的路由列表', this.checkList)
      console.log('保存的缓存路由列表', this.tempPermissionArray)
      // 旧数组与新数组相比没有的部分，即为增加的部分路由
      const addedRouters = this.compareRouterList(this.checkList, this.tempPermissionArray)
      // 新数组与旧数组相比没有的部分，即为减少的部分路由
      const deletedRouters = this.compareRouterList(this.tempPermissionArray, this.checkList)
      console.log(`减少的路径为${deletedRouters},增加的路径为${addedRouters}`)
      if (deletedRouters.length === 0 && addedRouters.length === 0) {
        this.dialogVisible = false
        this.$refs.xGrid.commitProxy('query')
        VXETable.modal.message({ message: '未检测到任何修改', status: 'success', size: 'medium', id: 'unique1' })
      } else {
        if (addedRouters.length !== 0) {
          this.$http.post('/security/url/create', { groupId: this.roleGroupId, role: this.tempRole, url: addedRouters.toString() }).then(
            response => {
              if (response.data.code !== 0) {
                VXETable.modal.message({
                  message: `权限添加失败@${response.data.message}`,
                  status: 'error',
                  size: 'medium',
                  id: 'unique3'
                })
              } else {
                this.$refs.xGrid.commitProxy('query')
                VXETable.modal.message({
                  message: `已添加${addedRouters.length}条权限`,
                  status: 'success',
                  size: 'medium',
                  id: 'unique4'
                })
              }
            }
          ).catch((error) => {
            VXETable.modal.message({ message: `权限添加失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
          })
        } else {
          console.log('未增加任何权限')
        }
        if (deletedRouters.length !== 0) {
          this.$http.post('/security/url/delete', { groupId: this.roleGroupId, role: this.tempRole, url: deletedRouters.toString() }).then(
            response => {
              if (response.data.code !== 0) {
                VXETable.modal.message({
                  message: `权限取消失败@${response.data.message}`,
                  status: 'error',
                  size: 'medium',
                  id: 'unique5'
                })
              } else {
                this.$refs.xGrid.commitProxy('query')
                VXETable.modal.message({
                  message: `已取消${deletedRouters.length}条权限`,
                  status: 'success',
                  size: 'medium',
                  id: 'unique6'
                })
              }
            }
          ).catch((error) => {
            VXETable.modal.message({ message: `权限取消失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
          })
        } else {
          console.log('未取消任何权限')
        }
      }
      this.dialogVisible = false
    },
    pushURL (value) {
      console.log(this.checkList, 'test')
      console.log(value)
      const checkedCount = this.checkList.length
      this.checkAll = checkedCount === this.routerList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routerList.length
      console.log(this.isIndeterminate, this.routerList, this.checkList.length, 'this.isIndeterminate')
    },
    async getRouterList () {
      const response = await this.$http.post('/security/routes/list').catch((error) => {
        VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
      })
      console.log('路由列表', response)
      this.routerList = response.data.data.data
    },
    openCreateDialog (value) {
      // 查找当前role所在group
      const test = this.projectList.find(item => item.id === value.projectId)
      this.roleGroupId = test.projectGroup.id
      console.log('test', this.roleGroupId)
      // 请求所有路由列表
      this.getRouterList().then(() => {
        // 判断全选是否勾选
        const checkedCount = this.checkList.length
        this.checkAll = checkedCount === this.routerList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.routerList.length
        console.log(this.isIndeterminate, this.routerList, this.checkList.length, 'this.isIndeterminate')
      })
      console.log(this.routerList, '当前路由列表为')
      console.log(value, '当前row列表为')
      // 将已勾选项填充至勾选的数组
      const newArray = value.urls.map(item => item.url)
      console.log(newArray, 'printArray')
      this.checkList = newArray
      // 将现有的权限保存至缓存数组中,待确认时与更改后的数组比较
      this.tempPermissionArray = newArray
      this.tempRole = value.roleName
      console.log(this.tempRole, '当前角色')
      this.dialogVisible = true
    },
    openAddDialog  () {
      console.log('addRole')
      // 请求项目列表
      if (this.projectList === null) {
        this.getProjectList().catch(error => {
          VXETable.modal.message({ message: `请求项目列表失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
        })
      }
      this.addDialogVisible = true
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    headerCellStyle1 () {
      return {
        backgroundColor: '#52627d',
        color: '#ffffff'
      }
    }
  },
  filters: {
    routerName (value) {
      switch (value) {
        case '/':
          return '/'
        case '/user/login':
          return '登录'
        case '/device/create':
          return '创建设备'
        case '/device/edit':
          return '编辑设备'
        case '/device/category/list':
          return '请求设备种类'
        case '/device/list':
          return '请求设备列表'
        case '/device/detail':
          return '请求设备详情'
        case '/device/operation/history/list':
          return '请求设备操作历史'
        case '/device/message/latest':
          return '请求罐箱最新数据'
        case '/device/message/list':
          return '请求罐箱历史数据及图表'
        case '/project/create':
          return '创建项目'
        case '/project/delete':
          return '删除项目'
        case '/project/list':
          return '请求设备列表'
        case '/tank/create':
          return '创建罐箱'
        case '/tank/list':
          return '请求罐箱列表'
        case '/tank/list/message':
          return '请求罐箱消息列表'
        case '/tank/media/list':
          return '请求罐箱介质列表'
        case '/tank/model/list':
          return '请求罐箱模型列表'
        case '/tank/model/create':
          return '创建模型'
        case '/tank/model/delete':
          return '删除罐箱模型'
        case '/tank/attachment/upload':
          return '上传附件'
        case '/tank/attachment/delete':
          return '删除附件'
        case '/user/create':
          return '创建用户'
        case '/user/edit':
          return '编辑用户'
        case '/user/delete':
          return '删除用户'
        case '/user/list':
          return '请求用户列表'
        case '/security/routes/list':
          return '请求路由列表'
        case '/security/url/create':
          return '创建路由规则'
        case '/security/url/delete':
          return '删除路由规则'
        case '/security/url/list':
          return '请求路由规则列表'
        case '/security/role/create':
          return '创建角色'
        case '/security/role/delete':
          return '删除角色'
        case '/security/role/list':
          return '请求角色列表'
        case '/security/permission/create':
          return '创建权限'
        case '/security/permission/delete':
          return '删除权限'
        case '/security/permission/list':
          return '请求权限列表'
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .v-modal{
  z-index: 99!important;
}
/deep/ .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.deleteIcon {
  font-weight: bold;
  margin-left: 5px;
  font-size: 15px;
  color: #58647A;
  cursor: pointer;
}

.deleteIcon:hover {
  color: black;
}

.addButton {
  margin-right: 3px;
  font-size: 20px;
  color: #2F74EB;
  cursor: pointer;
}

.addButton:hover {
  color: #b1bed5;
}

.addText {
  color: #2F74EB;
  display: inline-block;
  font-size: 15px;
  font-weight: bold;
}

/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 5px;
}
</style>
