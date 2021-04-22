<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            公司管理
          </h1>
        <!--  <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
          >
            keep
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
          <!--          操作列模板-->
          <template v-slot:projectOperation="{row}">
            <div class="operationButton">
              <i
                class="el-icon-edit-outline deleteIcon"
                @click="editGroup(row)"
              />
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="`确认删除公司:${toBeDeletedGroup}？`"
                @confirm="deleteGroup() "
              >
                <i
                  slot="reference"
                  class="el-icon-delete deleteIcon"
                  @click="getGroup(row)"
                />
              </el-popconfirm>
            </div>
          </template>
          <template v-slot:tools>
            <vxe-form
              :data="formData"
              @submit="searchEvent"
              @reset="searchEvent"
              style="padding: 0;margin-right: 10px"
            >
              <vxe-form-item
                field="keywords"
                :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"
              />
              <vxe-form-item
                :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }"
              />
            </vxe-form>
          </template>
          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <div style="display: grid;grid-template-columns: 100px 120px;grid-template-rows: 40px">
              <div style="display: flex;justify-content:center;align-items:center;">
                <i
                  class="el-icon-circle-plus addButton"
                  @click="addGroup"
                />
                <span class="addText">新增公司</span>
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
    <el-dialog
      :show-close="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="添加公司"
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
        <span>添加公司</span>
      </div>
      <el-form
        ref="addGroupForm"
        :model="addGroupForm"
        :rules="GroupForm"
        size="small"
        label-width="100px"
      >
        <el-form-item
          label="公司名称"
          prop="name"
        >
          <el-input
            v-model="addGroupForm.name"
            placeholder="请输入公司名称"
            clearable
            :style="{width: '100%'}"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          @click="closeAddGroup"
          size="small"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="confirmCreateGroup"
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
  name: 'GroupList',
  data () {
    return {
      userList: [],
      addDialogVisible: false,
      addGroupForm: {
        name: undefined,
        adminUserName: undefined
      },
      GroupForm: {
        name: [{
          required: true,
          message: '请输入公司名称',
          trigger: 'blur'
        }]
      },
      toBeDeletedGroup: null,
      accountVisible: false,
      formData: {
        keywords: ''
      },
      tableHeight: 0,
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
              console.log('请求值3', queryParams)
              // 请求数据
              const response = await this.$http.post('/project/group/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium' })
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
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          }
        },
        columns: [
          { type: 'seq', width: 50, align: 'center' },
          { field: 'id', align: 'center', title: 'GroupId', minWidth: 30 },
          { field: 'name', align: 'center', title: '公司名', sortable: true, minWidth: 180 },
          { field: 'adminUserName', align: 'center', title: '管理员', minWidth: 150 },
          { field: 'createdAt', align: 'center', title: '创建时间', sortable: true, minWidth: 150, formatter: this.formatDate2 },
          { title: '操作', align: 'center', width: 80, slots: { default: 'projectOperation' } }
        ]
      }
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - 220
  },
  methods: {
    confirmCreateGroup () {
      console.log('提交', this.addGroupForm)
      this.$http.post('project/group/create', this.addGroupForm)
        .then((response) => {
          console.log(response)
          if (response.data.code !== 0) {
            this.enabledUsers = !this.enabledUsers
            VXETable.modal.message({
              message: `新建失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          } else {
            this.$refs.xGrid.commitProxy('query')
            this.addDialogVisible = false
            this.$refs.addGroupForm.resetFields()
            VXETable.modal.message({
              message: '新建成功',
              status: 'success',
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
    closeAddGroup () {
      this.addDialogVisible = false
      this.addGroupForm.name = null
      this.addGroupForm.adminUserName = null
    },
    editGroup (row) {
      console.log(row)
    },
    getGroup (row) {
      console.log(row)
      this.toBeDeletedGroup = row.name
      this.toBeDeletedGroupId = row
    },
    deleteGroup () {
      this.$http.post('/project/group/delete', { id: this.toBeDeletedGroupId.id }).then(
        response => {
          if (response.data.code !== 0) {
            VXETable.modal.message({
              message: `删除失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          } else {
            this.$refs.xGrid.remove(this.toBeDeletedGroupId)
            VXETable.modal.message({
              message: '删除成功',
              status: 'success',
              size: 'medium',
              id: 'unique1'
            })
          }
        }
      ).catch((error) => {
        VXETable.modal.message({ message: `删除失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
      })
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    addGroup () {
      this.addDialogVisible = true
      console.log('addGroup')
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__body{
  padding: 10px 20px 0;
}
/deep/ .v-modal{
  z-index: 99!important;
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
