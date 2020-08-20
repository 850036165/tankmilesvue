<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>罐箱列表</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style="margin-bottom: 15px;margin-top: 15px">罐箱列表</h1>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="6">
            <div style="display: flex;align-content: center; padding-top: 5px">
              <i class="el-icon-circle-plus addButton" @click="addTanks"></i>
              <p class="addText">新建罐箱</p>
            </div>
          </el-col>
          <el-col :span="3" :push="15">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="massChange">批量操作</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <vxe-grid
          :header-cell-style="headerCellStyle"
          ref="xGrid"
          :height="tableHeight+'px'"
          v-bind="gridOptions"
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          highlight-current-column
          size="mini">
          <!--自定义列插槽-->
          <template v-slot:name_default="{ row }">
            <span>
              <button class="deviceDetail" @click="goDetail(row)">{{ row.name }}</button>
            </span>
          </template>

          <!--将表单放在工具栏中-->
          <template v-slot:toolbar_buttons>
            <vxe-form :data="formData" @submit="searchEvent" @reset="searchEvent">
              <vxe-form-item field="name" :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"></vxe-form-item>
              <vxe-form-item
                :item-render="{ name: '$buttons', children: [{ props: { type: 'submit', content: '搜索', status: 'primary' } }, { props: { type: 'reset', content: '重置' } }] }"></vxe-form-item>
            </vxe-form>
          </template>
          <!--自定义空数据模板-->
          <template v-slot:empty>
            <span style="color: black;">
              <p>没有更多数据了！</p>
            </span>
          </template>
        </vxe-grid>
      </div>
    </el-card>

  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'

export default {
  name: 'TankList',
  data() {
    return {
      massChangeShow: true,
      checkedDevices: [],
      tableHeight: 0,
      inputValue: '',
      formData: {
        name: ''
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
          trigger: 'default',
          defaultSort: {
            field: 'name',
            order: 'desc'
          }
        },
        filterConfig: {
          remote: true
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
          filter: true, // 启用筛选代理
          ajax: {
            query: async ({page, sort, filters}) => {
              // 处理排序条件
              const queryParams = Object.assign({
                sort: sort.property,
                order: sort.order
              }, this.formData)
              // 处理筛选条件
              filters.forEach(({field, values}) => {
                queryParams[field] = values.join(',')
              })
              // const queryParamsJson = JSON.stringify(queryParams)
              // console.log(queryParamsJson)
              console.log(queryParams)
              const response = await this.$http.get(`https://api.xuliangzhan.com:10443/api/pub/page/list/${page.pageSize}/${page.currentPage}`, {params: queryParams}).catch((error) => {
                VXETable.modal.message({message: `请求失败@${error}`, status: 'error', size: 'medium'})
              })
              console.log(response.data)
              return response.data
            }
          }
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
        columns: [
          {type: 'seq', width: 60},
          {
            field: 'name',
            title: 'Name',
            align: 'center',
            minWidth: 200,
            remoteSort: true,
            slots: {
              default: 'name_default'
            }
          },
          {field: 'nickname', title: 'Nickname', remoteSort: true, minWidth: 200},
          {field: 'age', title: 'Age', remoteSort: true, width: 100},
          {
            field: 'role',
            title: 'Role',
            remoteSort: true,
            minWidth: 200,
            filters: [
              {label: '前端开发', value: '前端'},
              {label: '后端开发', value: '后端'},
              {label: '测试', value: '测试'},
              {label: '程序员鼓励师', value: '程序员鼓励师'}
            ],
            filterMultiple: false
          },
          {field: 'amount', title: 'Amount', width: 100, formatter: this.formatAmount},
          {field: 'updateDate', title: 'Update Date', width: 160, remoteSort: true, formatter: this.formatDate},
          {field: 'createDate', title: 'Create Date', width: 160, remoteSort: true, formatter: this.formatDate}
        ]
      }
    }
  },
  created() {
  },
  mounted() {
    this.tableHeight = window.innerHeight - 230
    window.onresize = () => {
      return (() => {
        this.tableHeight = window.innerHeight - 230
      })()
    }
  },
  methods: {
    massChange() {
      this.$router.push('/devicemanage/massoperation')
    },
    headerCellStyle() {
      return {
        backgroundColor: '#2A68D3',
        color: '#ffffff'
      }
    },
    goDetail(row) {
      console.log(row)
      // 传递列参数至组件
      this.$router.push({
        path: '/tanklist/tankdetail',
        query: {
          id: row.id
        }
      })
    },
    addTanks() {
      this.$router.push('/tanklist/addtanks')
    },
    searchEvent() {
      this.$refs.xGrid.commitProxy('reload')
    },
    formatAmount({cellValue}) {
      return cellValue ? `$${XEUtils.commafy(XEUtils.toFixedString(cellValue, 2))}` : ''
    },
    formatDate({cellValue}) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-card__body {
  padding-top: 0;
  padding-bottom: 0;
}

.deviceDetail {
  width: 100px;
  background-color: grey;
  border-radius: 2px;
  border: none;
}

.deviceDetail:hover {
  background-color: #2F74EB;
  border-radius: 2px;
  cursor: pointer;
}

.addButton {
  font-size: 25px;
  color: #2D3463;
  cursor: pointer;
}

.addButton:hover {
  font-size: 25px;
  color: #2F74EB;
}

.addText {
  text-align: center;
  white-space: nowrap;
  margin: 0 0 0 5px;
  font-weight: bold;
  line-height: 25px
}
</style>
