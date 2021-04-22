<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('Message.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('Message.messageCenter') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            {{ $t('Message.messageCenter') }}
          </h1>
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
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: #2F74EB;">
              <span>{{ $t('Message.noRecord') }}</span>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>
// import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
export default {
  name: 'Message',
  data () {
    return {
      tableHeight: 0,
      loginHistory: null,
      formData: {
        keywords: ''
      },
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
            field: 'at',
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
          custom: true
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
        proxyConfig: {
          seq: false, // 启用动态序号代理
          sort: false, // 启用排序代理
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
                    case 'userName':
                      sort.property = 0
                      break
                    case 'at':
                      sort.property = 1
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
              const response = await this.$http.post('/log/history/list', queryParams).catch((error) => {
                VXETable.modal.message({ message: `${this.$t('Message.requestFailed')}@${error}`, status: 'error', size: 'medium' })
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
          { type: 'seq', minWidth: 50, align: 'center' },
          { field: 'userName', title: `${this.$t('Message.notice')}`, minWidth: 100, align: 'center' },
          { field: 'ip', title: `${this.$t('Message.content')}`, minWidth: 100, align: 'center' },
          { field: 'at', title: `${this.$t('Message.time')}`, minWidth: 100, formatter: this.formatDate2 }
        ]
      }
    }
  },
  methods: {
    formatDate2 ({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    },
    headerCellStyle () {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
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
/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 5px;
}

</style>
