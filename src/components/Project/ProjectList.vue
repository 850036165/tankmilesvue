<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            项目管理
          </h1>
          <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
          >
            Button
          </el-button>
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
          <template v-slot:projectName="{row}">
            <span :class="row.level===0?'projectName':''">{{ row.name }}</span>
          </template>
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
                title="删除"
              />
            </div>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div style="display: grid;grid-template-columns: 100px 120px;grid-template-rows: 40px">
              <div style="display: flex;justify-content:center;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="addProject"
                />
                <span class="addText">新增项目</span>
              </div>
            </div>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: #2F74EB;">
              <span>请联系CIMC后台咨询</span>
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
        <span class="deleteTitle">即将删除</span>
        <p
          class="deleteTitle"
          style="color: #2f74eb;display: inline-block"
        >
          {{ toBeDeletedProject.name }}
        </p>
      </div>
      <span class="deleteContent">项目删除后，此项目下的管理账户将自动注销，是否确认删除该项目?</span>
      <div slot="footer">
        <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 50px;border-radius:0 0 3px 3px ">
          <!--        <div style="display: flex;justify-content: center;align-items: flex-end;">-->
          <div
            @click="deleteDialogVisible = false"
            class="deleteConfirm"
          >
            <p class="deleteText">
              取消
            </p>
          </div>
          <div
            @click="deleteProject ()"
            class="deleteCancel"
          >
            <p class="deleteText">
              确认
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--    快速创建创建对话框-->
    <el-dialog
      top="40vh"
      custom-class="deleteDialog"
      :visible.sync="createDialogVisible"
      width="30%"
    >
      <div slot="title">
        <span class="deleteTitle">快速创建项目于</span>
        <p
          class="deleteTitle"
          style="color: #2f74eb;display: inline-block"
        >
          {{ toBeCreateProject.name }}
        </p>
      </div>
      <el-input
        v-model="toBeCreateProjectName"
        style="margin: 20px 5px"
        placeholder="输入项目名称"
        required
      >
        <template slot="prepend">
          {{ toBeCreateProject.name }}->
        </template>
      </el-input>
      <div slot="footer">
        <div style="display: grid;grid-template-columns: 1fr 1fr;grid-template-rows: 50px;border-radius:0 0 3px 3px ">
          <!--        <div style="display: flex;justify-content: center;align-items: flex-end;">-->
          <div
            @click="createDialogVisible = false"
            class="deleteConfirm"
          >
            <p class="deleteText">
              取消
            </p>
          </div>
          <div
            @click="quickCreateProject ()"
            class="deleteCancel"
          >
            <p class="deleteText">
              确认
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  data() {
    return {
      toBeCreateProjectName: '',
      toBeDeletedProject: {},
      toBeCreateProject: {},
      deleteDialogVisible: false,
      createDialogVisible: false,
      tableHeight: 0,
      gridOptions: {
        resizable: true,
        showOverflow: true,
        exportConfig: {
          types: ['xlsx', 'csv', 'html', 'xml', 'txt']
        },
        border: true,
        sortConfig: {
          trigger: 'default',
          defaultSort: {
            field: 'deviceSn',
            order: 'desc'
          }
        },
        filterConfig: {
          remote: false
        },
        toolbar: {
          refresh: true,
          zoom: true,
          export: true,
          print: true,
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          }
        },
        treeConfig: {
          reserve: true,
          // line: true,
          children: 'children'
          // iconOpen: 'el-icon-folder-remove',
          // iconClose: 'el-icon-folder-add'
        },
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              const response = await this.$http.post('project/list').catch((error) => {
                VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1'})
              })
              console.log('源数据', response)
              const projectData = response.data.data
              this.addLevel(projectData)
              console.log('修改后', projectData)
              return projectData
            }
          }
        },
        columns: [
          {field: 'name', title: '项目名称', minWidth: 150, treeNode: true, slots: {default: 'projectName'}},
          {field: 'tankNum', title: '箱量', minWidth: 60},
          {field: 'accountNum', title: '账户数量', minWidth: 60},
          {field: 'createDate', title: '创建时间', minWidth: 60},
          {field: 'changeDate', title: '最近修改时间', minWidth: 60},
          {title: '操作', align: 'center', maxWidth: 80, slots: {default: 'projectOperation'}}
        ]
      }
    }
  },
  methods: {
    goProjectDetail(row) {
      this.$router.push({
        path: 'project/projectdetail',
        query: {
          name: row.name
        }
      })
      console.log(row)
    },
    openCreateDialog(row) {
      this.toBeCreateProjectName = ''
      this.createDialogVisible = true
      this.toBeCreateProject = row
    },
    async quickCreateProject() {
      const data = {
        isRoot: false,
        parentProjectId: this.toBeCreateProject.id,
        name: this.toBeCreateProjectName
      }
      await this.$http.post('project/create', data).then(
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.$refs.xGrid.commitProxy('query')
            VXETable.modal.message({message: '创建成功', status: 'success', size: 'medium', id: 'unique1'})
          } else {
            VXETable.modal.message({
              message: `创建失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          }
        }
      ).catch(error => {
        VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1'})
      })
      this.createDialogVisible = false
      this.toBeCreateProjectName = ''
    },
    openDeleteDialog(row) {
      this.deleteDialogVisible = true
      this.toBeDeletedProject = row
    },
    async deleteProject() {
      console.log('删除行数据', this.toBeDeletedProject.id)
      const deleteData = {id: this.toBeDeletedProject.id}
      await this.$http.post('project/delete', deleteData).then(
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.$refs.xGrid.commitProxy('query')
            VXETable.modal.message({message: '删除成功', status: 'success', size: 'medium', id: 'unique1'})
          } else {
            VXETable.modal.message({
              message: `删除失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          }
        }
      ).catch(error => {
        VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1'})
      })
      this.deleteDialogVisible = false
    },
    addLevel(array) {
      if (array.length) {
        for (let i = 0; i < array.length; i++) {
          array[i].level = 0
        }
      }
    },
    headerCellStyle() {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    addProject() {
      this.$router.push('/project/addproject')
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight - 185
    window.onresize = () => {
      return (() => {
        this.tableHeight = window.innerHeight - 185
      })()
    }
  },
  name: 'ProjectList'
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
  padding: 5px 30px 10px;
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
  padding-bottom: 0;
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
