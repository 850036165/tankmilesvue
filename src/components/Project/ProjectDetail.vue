<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('projectDetail.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/project'}">
        {{ $t('projectDetail.projectManagement') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('projectDetail.projectDetail') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <div>
            <h1 style="display:inline-block;margin: 0">
              {{ $t('projectDetail.projectDetail') }}:
            </h1>
            <h1 style="display: inline-block;color: #2A68D3;margin: 0">
              {{ this.$route.query.name }}
            </h1>
          </div>
          <el-button
            style="height: 30px;"
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            round
            @click="assignDevice"
          >
            {{ $t('projectDetail.assignedTank') }}
          </el-button>
        </div>
      </div>
      <div>
        <p
          style="width: 72px;
          margin: 0;
height: 23px;
font-size: 18px;
font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
font-weight: 700;
text-align: left;
color: #58647a;"
        >
          {{ $t('projectDetail.projectInfo') }}
        </p>
        <ul
          style="
font-size: 14px;
font-family: Microsoft YaHei UI, Microsoft YaHei UI-Regular;
font-weight: 400;
text-align: left;
color: #58647a;
line-height: 24px;"
        >
          <li>{{ $t('projectDetail.projectID') }}:{{ $route.query.id }}</li>
          <li>{{ $t('projectDetail.projectName') }}:{{ $route.query.name }}</li>
          <li>{{ $t('projectDetail.totalNumOfUser') }}:{{ contentTanks.user.length }}</li>
          <li>{{ $t('projectDetail.totalNumOfTank') }}:{{ contentTanks.tankCount }}</li>
        </ul>
        <p
          style="
font-size: 18px;
font-weight: 700;
text-align: left;
color: #58647a;"
        >
          {{ $t('projectDetail.assignedUser') }}
        </p>
        <vxe-grid
          stripe
          ref="userGrid"
          :header-cell-style="headerCellStyle"
          size="mini"
          border
          resizable
          show-overflow
          align="center"
          v-bind="gridOptions2"
        >
          <!--          取消分配模板-->
          <template v-slot:cancelAssignUser="{row}">
            <el-button
              size="mini"
              type="primary"
              @click="cancelAssignUser(row)"
            >
              {{ $t('projectDetail.deAllocation') }}
            </el-button>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <p>{{ $t('projectDetail.projectNoUser') }}</p>
          </template>
        </vxe-grid>
        <p
          style="
font-size: 18px;
font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
font-weight: 700;
text-align: left;
color: #58647a;"
        >
          {{ $t('projectDetail.assignedTanks') }}
        </p>
        <vxe-grid
          stripe
          ref="deviceGrid"
          :header-cell-style="headerCellStyle"
          size="mini"
          border
          resizable
          show-overflow
          align="center"
          v-bind="gridOptions1"
        >
          <!--          取消分配模板-->
          <template v-slot:cancelAssign="{row}">
            <el-button
              size="mini"
              type="primary"
              @click="cancelAssign(row)"
            >
              {{ $t('projectDetail.deAllocation') }}
            </el-button>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <p>{{ $t('projectDetail.projectNoTank') }}</p>
          </template>
        </vxe-grid>
      </div>
    </el-card>
    <el-dialog
      :show-close="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="$t('projectDetail.assignedTank')"
      :visible.sync="assignDeviceDialogVisible"
      width="55%"
    >
      <div
        slot="title"
        style="font-weight: bold;font-size: 20px;color: #2F74EB"
      >
        <i
          class="el-icon-tickets"
          style="margin: 3px"
        />
        <span>{{ $t('projectDetail.assignedTank') }}</span>
      </div>
      <vxe-grid
        @checkbox-change="selectChangeEvent"
        @checkbox-all="selectAllEvent"
        ref="xGrid"
        sync-resize
        height="300px"
        v-bind="gridOptions"
        highlight-hover-row
        highlight-current-row
        highlight-hover-column
        highlight-current-column
        size="mini"
      >
        <!--确定插槽-->
        <template v-slot:toolbar_buttons>
          <el-button
            size="small"
            type="primary"
            @click="assignTanks"
          >
            {{ $t('projectDetail.yes') }}
          </el-button>
          <el-button
            @click="handleCloseDialog"
            size="small"
          >
            {{ $t('projectDetail.cancel') }}
          </el-button>
        </template>
        <!--总数插槽-->
        <template v-slot:toolbar_count>
          <div>
            <span
              class="addText"
              style="color: black;"
            >{{ $t('projectDetail.selected') }}</span>
            <span
              class="addText"
              style="margin-left:10px;color: #2A68D3"
            >{{ selectedDevices.length }}</span>
          </div>
        </template>
      </vxe-grid>
      <!--      <div slot="footer">-->
      <!--        <el-button-->
      <!--          @click="closeAddGroup"-->
      <!--          size="small"-->
      <!--        >-->
      <!--          取消-->
      <!--        </el-button>-->
      <!--        <el-button-->
      <!--          size="small"-->
      <!--          type="primary"-->
      <!--          @click="confirmCreateGroup"-->
      <!--        >-->
      <!--          确定-->
      <!--        </el-button>-->
      <!--      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'ProjectDetail',
  data () {
    return {
      assignedDeviceList: [],
      selectedDevices: [],
      gridOptions2: {
        stripe: true,
        resizable: true,
        showOverflow: true,
        border: true,
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              if (this.projectId) {
                const response = await this.$http.post('/project/detail', { id: this.projectId }).catch((error) => {
                  VXETable.modal.message({ message: `${this.$t('projectDetail.requireFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique1' })
                })
                console.log('源数据', response)
                const projectData = response.data.data.user
                console.log('修改后', projectData)
                return projectData
              }
            }
          }
        },
        columns: [
          { type: 'seq', width: 50 },
          { field: 'name', title: `${this.$t('projectDetail.username')}` },
          { field: 'nickName', title: `${this.$t('projectDetail.displayName')}`, showHeaderOverflow: true },
          { title: `${this.$t('projectDetail.deAllocation')}`, width: '120px', slots: { default: 'cancelAssignUser' } }
        ]
      },
      gridOptions1: {
        stripe: true,
        resizable: true,
        showOverflow: true,
        border: true,
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              if (this.projectId) {
                const response = await this.$http.post('/project/detail', { id: this.projectId }).catch((error) => {
                  VXETable.modal.message({ message: `${this.$t('projectDetail.deAllocation')}@${error}`, status: 'error', size: 'medium', id: 'unique1' })
                })
                console.log('源数据', response)
                const projectData = response.data.data.detail
                this.assignedDeviceList = projectData
                console.log('修改后', projectData)
                return projectData
              }
            }
          }
        },
        columns: [
          { type: 'seq', width: 50 },
          { field: 'deviceSn', title: `${this.$t('projectDetail.deviceID')}` },
          { field: 'tankSn', title: `${this.$t('projectDetail.tankNo')}`, showHeaderOverflow: true },
          { title: `${this.$t('projectDetail.deAllocation')}`, width: '120px', slots: { default: 'cancelAssign' } }
        ]
      },
      gridOptions: {
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_count',
            tools: 'toolbar_buttons'
          }
        },
        checkboxConfig: {
          reserve: true,
          checkMethod: this.selectChosenDevices
        },
        stripe: true,
        resizable: true,
        showOverflow: true,
        border: true,
        rowId: 'sn',
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
        proxyConfig: {
          seq: true, // 启用动态序号代理
          sort: true, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async ({ page, sort, filters }) => {
              // 处理排序条件
              if (sort.property) {
                console.log('初始order非null1', sort.property)
                if (typeof sort.property === 'number') { console.log('当前sort为number', sort.property) } else {
                  switch (sort.property) {
                    case 'sn':
                      sort.property = 0
                      break
                    case 'deviceSn':
                      sort.property = 1
                      break
                    case 'projectNames':
                      sort.property = 2
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
              const response = await this.$http.post('tank/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `${this.$t('projectDetail.requireFailed')}@${error}`, status: 'error', size: 'medium' })
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
        columns: [
          { type: 'checkbox', width: 'auto', align: 'center' },
          {
            field: 'sn',
            align: 'center',
            title: `${this.$t('projectDetail.tankNo')}`,
            minWidth: 150,
            sortable: true
          },
          { field: 'deviceSn', align: 'center', title: `${this.$t('projectDetail.deviceID')}`, sortable: true, minWidth: 100 },
          { field: 'projectNames', title: `${this.$t('projectDetail.projectName')}`, width: 140, sortable: true },
          { title: `${this.$t('projectDetail.operation')}`, align: 'center', width: 80 }
        ]
      },
      assignDeviceDialogVisible: false,
      projectId: null,
      contentTanks: {
        tankCount: null,
        userCount: null,
        detail: [],
        user: []
      }
    }
  },
  mounted () {
    this.projectId = this.$route.query.id
    this.getProjectDetail()
  },
  methods: {
    cancelAssignUser (row) {
      console.log(row)
      this.$confirm(`${this.$t('projectDetail.deleteAssign')}`, `${this.$t('projectDetail.warning')}`, {
        confirmButtonText: `${this.$t('projectDetail.yes')}`,
        cancelButtonText: `${this.$t('projectDetail.cancel')}`,
        type: 'warning'
      }).then(() => {
        this.$http.post('/project/user/remove', { id: this.projectId, names: row.name }).then(response => {
          console.log(response)
          this.$refs.userGrid.remove(row)
          VXETable.modal.message({ message: `${this.$t('projectDetail.cancelAssignedSuccess')}`, status: 'success', size: 'medium', id: '1' })
        })
      }).catch(() => {
        VXETable.modal.message({ message: `${this.$t('projectDetail.cancelAssigned')}`, status: 'warning', id: '2' })
      })
    },
    handleCloseDialog () {
      this.assignDeviceDialogVisible = false
    },
    assignTanks () {
      const result = this.selectedDevices.map(item => item.sn)
      console.log(result)
      this.$http.post('/project/tank/add', { id: this.projectId, tanksSn: result.toString() }).then(response => {
        if (response.data.code !== 0) {
          this.$XModal.message({ message: `${this.$t('projectDetail.assignFailed')}@${response.data.message}`, status: 'error', size: 'medium' })
        } else {
          VXETable.modal.message({ message: `${this.$t('projectDetail.assignSuccess')}`, status: 'success', size: 'medium' })
          this.assignDeviceDialogVisible = false
          this.$refs.xGrid.commitProxy('reload')
          this.$refs.deviceGrid.commitProxy('reload')
          this.selectedDevices = []
        }
      }).catch(error => {
        VXETable.modal.message({ message: `${this.$t('projectDetail.assignFailed')}@${error}`, status: 'error', size: 'medium' })
      })
    },
    selectChosenDevices ({ row }) {
      const array = this.assignedDeviceList.map(item => item.tankSn)
      console.log(array)
      console.log(row.sn)
      console.log(XEUtils.includes(array, row.sn))
      if (!XEUtils.includes(array, row.sn)) { return row }
    },
    selectAllEvent () {
      this.selectedDevices = [...this.$refs.xGrid.getCheckboxRecords(), ...this.$refs.xGrid.getCheckboxReserveRecords()]
    },
    selectChangeEvent () {
      this.selectedDevices = [...this.$refs.xGrid.getCheckboxRecords(), ...this.$refs.xGrid.getCheckboxReserveRecords()]
    },
    assignDevice () {
      this.assignDeviceDialogVisible = true
      this.$refs.xGrid.commitProxy('reload')
      this.selectedDevices = []
    },
    cancelAssign (row) {
      console.log(row)
      this.$confirm(`${this.$t('projectDetail.deleteAssign')}`, `${this.$t('projectDetail.warning')}`, {
        confirmButtonText: `${this.$t('projectDetail.yes')}`,
        cancelButtonText: `${this.$t('projectDetail.cancel')}`,
        type: 'warning'
      }).then(() => {
        this.$http.post('/project/tank/remove', { id: this.projectId, tanksSn: row.tankSn }).then(response => {
          console.log(response)
          if (response.data.code !== 0) {
            VXETable.modal.message({ message: `${this.$t('projectDetail.operationFailed')}${response.data.message}`, status: 'error', size: 'medium', id: '1' })
          } else {
            this.$refs.deviceGrid.remove(row)
            VXETable.modal.message({ message: `${this.$t('projectDetail.cancelAssignedSuccess')}`, status: 'success', size: 'medium', id: '1' })
          }
        })
      }).catch(() => {
        VXETable.modal.message({ message: `${this.$t('projectDetail.cancelAssigned')}`, status: 'warning', id: '2' })
      })
    },
    async getProjectDetail () {
      const response = await this.$http.post('/project/detail', { id: this.projectId }).catch(error => {
        VXETable.modal.message({ message: `${this.$t('projectDetail.requireFailed')}@${error}`, status: 'error', size: 'medium' })
      })
      this.contentTanks = response.data.data
      console.log(this.contentTanks)
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

<style scoped>
li{list-style-type:none}
/deep/.el-dialog__body{
  padding: 10px;
}
.addText {
  color: #2F74EB;
  display: inline-block;
  font-size: 15px;
  font-weight: bold;
}
</style>
