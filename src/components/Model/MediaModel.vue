<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>模型管理</el-breadcrumb-item>
      <el-breadcrumb-item>介质模型</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            介质模型
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
      <!--      主体表格-->
      <div>
        <vxe-grid
          row-id="name"
          :header-cell-style="headerCellStyle"
          ref="xGrid"
          :height="tableHeight+'px'"
          v-bind="gridOptions"
          highlight-hover-row
          highlight-hover-column
          size="mini"
        >
          <!--          自定义插槽-->
          <template v-slot:mediaModelOperation="{row}">
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
                  @click="addMediaModel"
                />
                <span class="addText">新增介质</span>
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
  </div>
</template>

<script>
import VXETable from 'vxe-table'

export default {
  name: 'MediaModel',
  data () {
    return {
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
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
          filter: false, // 启用筛选代理
          ajax: {
            query: async () => {
              const response = await this.$http.post('tank/media/list').catch((error) => {
                VXETable.modal.message({ message: `请求失败@${error}`, status: 'error', size: 'medium', id: 'unique1' })
              })
              console.log('源数据', response)
              const tankModelData = response.data.data
              console.log('模型数据', tankModelData)
              return tankModelData.data
            }
          }
        },
        columns: [
          { type: 'seq', width: 50, align: 'center' },
          { field: 'name', title: '介质名称', minWidth: 60 },
          { field: 'tankNum', title: '描述', minWidth: 60 },
          { field: 'createDate', title: '创建时间', minWidth: 60 },
          { field: 'changeDate', title: '更新时间', minWidth: 60 },
          { title: '操作', align: 'center', maxWidth: 80, slots: { default: 'mediaModelOperation' } }
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
    addMediaModel () {
      console.log('add')
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
</style>
