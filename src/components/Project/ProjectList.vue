<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('projectList.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('projectList.tankManagement') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('projectList.projectManagement') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            {{ $t('projectList.projectManagement') }}
          </h1>
          <!--<el-button
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
          <template v-slot:projectGroup="{row}">
            <span>{{ row.projectGroup.name }}</span>
          </template>
          <!--          操作列模板-->
          <template v-slot:projectOperation="{row}">
            <div class="operationButton">
              <i
                class="el-icon-edit-outline deleteIcon"
                @click="goProjectDetail(row)"
              />
              <i
                class="el-icon-circle-plus-outline deleteIcon"
                @click="openCreateDialog(row)"
              />
              <i
                class="el-icon-delete deleteIcon"
                @click="openDeleteDialog(row)"
                :title="$t('projectList.deleteProject')"
              />
            </div>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div>
              <div style="display: flex;justify-content:start;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="projectList"
                />
                <p class="addText">
                  {{ $t('projectList.addProject') }}
                </p>
              </div>
            </div>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: #2F74EB;">
              <span>{{ $t('projectList.contactCIMC') }}</span>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>
    <!--    删除对话框-->
    <el-dialog
      top="40vh"
      custom-class="deleteDialog"
      :visible.sync="deleteDialogVisible"
      width="20%"
    >
      <div slot="title">
        <span class="deleteTitle">{{ $t('projectList.aboutToDelete') }}</span>
        <p
          class="deleteTitle"
          style="color: #2f74eb;display: inline-block"
        >
          {{ toBeDeletedProject.name }}
        </p>
      </div>
      <span class="deleteContent">{{ $t('projectList.accountCancellation') }}</span>
      <div slot="footer">
        <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 50px;border-radius:0 0 3px 3px ">
          <!--        <div style="display: flex;justify-content: center;align-items: flex-end;">-->
          <div
            @click="deleteDialogVisible = false"
            class="deleteConfirm"
          >
            <p class="deleteText">
              {{ $t('projectList.cancel') }}
            </p>
          </div>
          <div
            @click="deleteProject ()"
            class="deleteCancel"
          >
            <p class="deleteText">
              {{ $t('projectList.confirm') }}
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--    快速创建创建对话框-->
    <el-dialog
      :show-close="false"
      top="40vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="deleteDialog"
      :visible.sync="createDialogVisible"
      width="30%"
    >
      <div slot="title">
        <span class="deleteTitle">{{ $t('projectList.assignUser') }}</span>
      </div>
      <span
        class="deleteContent"
      >{{ $t('projectList.assignUserToProject') }}</span>
      <el-select
        style="width: 100%;margin: 10px 0"
        v-model="assignUserName"
        collapse-tags
        multiple
        :placeholder="$t('projectList.select')"
      >
        <el-option
          v-for="item in userList"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <div slot="footer">
        <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 50px;border-radius:0 0 3px 3px ">
          <!--        <div style="display: flex;justify-content: center;align-items: flex-end;">-->
          <div
            @click="createDialogVisible = false;assignUserName = []"
            class="deleteConfirm"
          >
            <p class="deleteText">
              {{ $t('projectList.cancel') }}
            </p>
          </div>
          <div
            @click="assignUsers"
            class="deleteCancel"
          >
            <p class="deleteText">
              {{ $t('projectList.confirm') }}
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'ProjectList',
  data () {
    return {
      assignProject: null,
      userList: [],
      assignUserName: [],
      toBeDeletedProject: {},
      deleteDialogVisible: false,
      createDialogVisible: false,
      tableHeight: 0,
      gridOptions: {
        stripe: true,
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
              const response = await this.$http.post('project/list').catch((error) => {
                VXETable.modal.message({ message: `${this.$t('projectList.requestFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique1' })
              })
              console.log('源数据', response)
              const projectData = response.data.data
              console.log('修改后', projectData)
              return projectData
            }
          }
        },
        columns: [
          { field: 'id', title: 'Id', width: 50, align: 'center' },
          { field: 'name', title: `${this.$t('projectList.projectName')}`, minWidth: 100, align: 'center' },
          // { field: 'tankNum', title: '箱量', minWidth: 60 },
          // { field: 'accountNum', title: '账户数量', minWidth: 60 },
          { field: 'createDate', title: `${this.$t('projectList.createDate')}`, minWidth: 60, formatter: this.formatDate2 },
          { field: 'editAt', title: `${this.$t('projectList.lastCreateDate')}`, minWidth: 60, formatter: this.formatDate2 },
          { field: 'projectGroup', title: `${this.$t('projectList.company')}`, minWidth: 60, align: 'center', slots: { default: 'projectGroup' } },
          { title: `${this.$t('projectList.operation')}`, align: 'center', maxWidth: 80, slots: { default: 'projectOperation' } }
        ]
      }
    }
  },
  methods: {
    assignUsers () {
      const assignProjectId = this.assignProject.id
      this.$http.post('project/user/add', { id: assignProjectId, names: this.assignUserName.toString() }).then(response => {
        if (response.data.code !== 0) {
          this.$XModal.message({ message: `${this.$t('projectList.assignFailed')}@${response.data.message}`, status: 'error', size: 'medium' })
        } else {
          this.$XModal.message({ message: `${this.$t('projectList.assignSuccess')}`, status: 'success', size: 'medium' })
          this.createDialogVisible = false
          this.assignUserName = []
        }
      }).catch(error => {
        this.$XModal.message({ message: `${this.$t('projectList.assignFailed')}@${error}`, status: 'error', size: 'medium' })
      })
    },
    async getUserList () {
      const response = await this.$http.post('/user/list', {
        currentPage: 0,
        keywords: '',
        order: 'DESC',
        orderColumnIndex: 7,
        pageSize: 999
      }).catch(error => {
        VXETable.modal.message({
          message: `${this.$t('projectList.requestFailed')}@${error}`,
          status: 'error',
          size: 'medium',
          id: 'unique1'
        })
      })
      this.userList = response.data.data.data
      console.log(this.userList)
    },
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    goProjectDetail (row) {
      this.$router.push({
        path: 'project/projectdetail',
        query: {
          name: row.name,
          id: row.id
        }
      })
      console.log(row)
    },
    openCreateDialog (row) {
      this.getUserList()
      this.createDialogVisible = true
      this.assignProject = row
    },
    openDeleteDialog (row) {
      this.deleteDialogVisible = true
      this.toBeDeletedProject = row
    },
    async deleteProject () {
      console.log('删除行数据', this.toBeDeletedProject.id)
      const deleteData = { id: this.toBeDeletedProject.id }
      await this.$http.post('project/delete', deleteData).then(
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.$refs.xGrid.remove(this.toBeDeletedProject)
            VXETable.modal.message({ message: `${this.$t('projectList.deleteSuccess')}`, status: 'success', size: 'medium', id: 'unique1' })
          } else {
            VXETable.modal.message({
              message: `${this.$t('projectList.deleteFailed')}@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          }
        }
      ).catch(error => {
        VXETable.modal.message({ message: `${this.$t('projectList.requestFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique1' })
      })
      this.deleteDialogVisible = false
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    projectList () {
      this.$router.push('/project/addproject')
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - 185
    window.onresize = () => {
      return (() => {
        this.tableHeight = window.innerHeight - 185
      })()
    }
  }
}
</script>

<style scoped>
.deleteText {
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Light;
  font-weight: 300;
  text-align: center;
  color: #ffffff;
  letter-spacing: 1px;
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

/deep/ .deleteDialog {
  border-radius: 5px;
}

/deep/ .el-dialog__footer {
  padding: 0;
  border: none;
}

/deep/ .el-dialog__body {
  padding: 10px 30px 10px;
}

.deleteContent {
  opacity: 0.5;
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Regular;
  font-weight: 400;
  text-align: left;
  color: #58647a;
  line-height: 24px;
}

.deleteTitle {
  margin: 0;
  font-size: 18px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: left;
  color: #58647a;
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

/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 5px;
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

.projectName {
  font-size: 14px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: left;
  color: #2f74eb;
  letter-spacing: 1px;
}
</style>
