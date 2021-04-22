<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            账户管理
          </h1>
          <!--<el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            @click="openAccountVisible"
            round
          >
            余额查看
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
          <template v-slot:userName="{row}">
            <div
              style="display: flex;margin-left:30px;align-items: center;"
            >
              <el-avatar
                icon="el-icon-user-solid"
                size="small"
                :src="row.avatarUrl"
              /><span
                @click="editUser(row)"
                style="margin-left: 10px;cursor: pointer"
                :class="row.enabled?'enabled':'disabled'"
              >{{ row.nickName }}</span>
            </div>
          </template>
          <!--          是否启用账户-->
          <template v-slot:enableUsers="{row}">
            <el-switch
              @change="enableUsers(row)"
              v-model="row.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
          <!--          操作列模板-->
          <template v-slot:projectOperation="{row}">
            <div class="operationButton">
              <i
                class="el-icon-edit-outline deleteIcon"
                @click="editUser(row)"
              />
              <el-popconfirm
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="'确认删除此用户吗？'"
                @confirm="deleteUser() "
              >
                <i
                  slot="reference"
                  class="el-icon-delete deleteIcon"
                  @click="getUser(row)"
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
                  @click="addAccount"
                />
                <span class="addText">新增账户</span>
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
    <!--    侧边抽屉-->
    <!-- <el-drawer
      class="drawerStyle"
      :visible.sync="accountVisible"
      direction="ltr"
    >
      <span>TEST</span>
    </el-drawer>-->
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'UserManage',
  data () {
    return {
      accountVisible: false,
      enabled: 'enabled',
      disabled: 'disabled',
      toBeDeletedUser: null,
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
              const response = await this.$http.post('/user/list', queryParams).catch((error) => {
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
          { align: 'center', title: '显示名称', minWidth: 180, slots: { default: 'userName' } },
          { field: 'name', align: 'center', title: '用户名', sortable: true, minWidth: 180 },
          { field: 'roles', align: 'center', title: '角色', minWidth: 150 },
          { field: 'email', align: 'center', title: '邮箱', sortable: true, minWidth: 180 },
          { field: 'mobile', align: 'center', title: '手机号', sortable: true, minWidth: 100 },
          { field: 'fixedPhone', align: 'center', title: '固话', sortable: true, minWidth: 100 },
          { field: 'createdAt', align: 'center', title: '创建时间', sortable: true, minWidth: 150, formatter: this.formatDate2 },
          { field: 'enabled', align: 'center', title: '启用中', minWidth: 100, slots: { default: 'enableUsers' } },
          { title: '操作', align: 'center', width: 80, slots: { default: 'projectOperation' } }
        ]
      }
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - 220
  },
  methods: {
    enableUsers (row) {
      console.log(row)
      this.$http.post('/user/edit', { name: row.name, enabled: row.enabled })
        .then((response) => {
          console.log(response)
          if (response.data.code !== 0) {
            row.enabled = !row.enabled
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
          row.enabled = !row.enabled
          VXETable.modal.message({
            message: `修改失败@${error}`,
            status: 'error',
            size: 'medium',
            id: 'unique1'
          })
        })
    },
    editUser (row) {
      console.log(row)
      this.$router.push({
        path: '/useredit',
        query: {
          user: row.name
        }
      })
    },
    getUser (row) {
      console.log(row)
      this.toBeDeletedUser = row
    },
    deleteUser () {
      this.$http.post('/user/delete', { name: this.toBeDeletedUser.name }).then(
        response => {
          if (response.data.code !== 0) {
            VXETable.modal.message({
              message: `用户删除失败@${response.data.message}`,
              status: 'error',
              size: 'medium',
              id: 'unique1'
            })
          } else {
            this.$refs.xGrid.remove(this.toBeDeletedUser)
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
    openAccountVisible () {
      this.accountVisible = true
    },
    searchEvent () {
      this.$refs.xGrid.commitProxy('query')
    },
    addAccount () {
      this.$router.push('/addusers')
      console.log('addAccount')
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
/deep/ :focus{outline:0;}
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
.enabled{
  color: #33B892;
  font-weight: bold;
}
.disabled{
  color: #FA675C;
  font-weight: bold;
}
</style>
