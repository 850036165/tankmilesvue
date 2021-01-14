<template>
  <div class="editBody">
    <!--    <span>{{$route.query.user}}</span>-->
    <el-card
      class="leftCard"
    >
      <div style="width: 200px;height: 200px;position: relative;border-radius: 50%; overflow:hidden;">
        <el-avatar
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
          编辑
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
          保存
        </p>
      </div>
      <el-form
        size="mini"
        style="width: 200px"
        label-position="top"
      >
        <el-form-item
          style="height: 50px"
        >
          <span slot="label"><i
            class="el-icon-message"
            style="font-weight: bold"
          /> 邮箱</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.name }}
          </p>
          <el-input
            :disabled="!showInput"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userData.name"
          />
        </el-form-item>
        <el-form-item
          style="height: 50px"
          label="电话"
        >
          <span slot="label"><i
            class="el-icon-mobile-phone"
            style="font-weight: bold"
          /> 电话</span>
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
            v-model="userData.name"
          />
        </el-form-item>
        <el-form-item
          style="height: 50px"
          label="固话"
        >
          <span slot="label"><i
            class="el-icon-place"
            style="font-weight: bold"
          /> 国家</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.name }}
          </p>
          <el-input
            :disabled="!showInput"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userData.name"
          />
        </el-form-item>
        <el-form-item
          style="height: 50px"
          label="公司"
        >
          <span slot="label"><i
            class="el-icon-office-building"
            style="font-weight: bold"
          /> 公司</span>
          <p
            v-if="!showInput"
            class="formText"
          >
            {{ userData.name }}
          </p>
          <el-input
            :disabled="!showInput"
            style="height: 28px;margin: 0"
            v-if="showInput"
            v-model="userData.name"
          />
        </el-form-item>
        <el-form-item
          style="height: 50px"
          label="地址"
        >
          <span slot="label"><i
            class="el-icon-location-outline"
            style="font-weight: bold"
          /> 地址</span>
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
            v-model="userData.name"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
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
          用户管理
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
        账户信息
      </h1>
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="操作历史"
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
            <!--将表单放在工具栏中-->
            <template v-slot:toolbar_buttons>
              <el-date-picker
                :clearable="false"
                size="mini"
                align="center"
                style="width: 200px"
                v-model="timeRange"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </template>
            <!--自定义空数据模板-->
            <template v-slot:empty>
              <span style="color: #2F74EB;">
                <span>请联系CIMC后台咨询</span>
              </span>
            </template><vxe-grid />
          </vxe-grid>
        </el-tab-pane>
        <el-tab-pane
          label="账户权限"
          name="second"
        >
          账户权限
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  name: 'UserEdit',
  data () {
    return {
      timeRange: [],
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
  methods: {
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
    },
    saveEdit () {
      this.showInput = false
    }
  },
  mounted () {
    this.tableHeight = window.innerHeight - 220
    this.userName = this.$route.query.user
    console.log('用户信息', this.userData)
    this.getUserDetail()
  }
}
</script>

<style scoped>
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

/deep/ .el-form-item .el-form-item--mini {
  margin: 0
}

.el-form-item {
  margin: 5px !important;
}
</style>
