<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style="margin-bottom: 10px">设备管理</h1>
    <el-card>
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="6">
            <div style="display: flex;align-content: center; padding-top: 9px">
              <i class="el-icon-circle-plus addButton" @click="addDevices"></i>
              <p class="addText">新建设备</p>
            </div>
          </el-col>
          <el-col :span="5" :push="14">
            <div
              style="display: flex;align-content: center; padding-top: 9px;border-bottom: 1px grey solid;width: 150px">
              <i class="el-icon-search" style="margin-top: 5px"></i>
              <input style="height: 25px;width:130px;border: none;outline:none;" v-model="inputValue"
                     spellcheck="false" type="search" placeholder="筛选.." @input="onQuickFilterChanged">
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <div style="margin-left: 95%;white-space:nowrap;">
          <i class="el-icon-refresh icon1" @click="update"></i>
          <i class="el-icon-download icon2" @click="onBtnExportDataAsExcel"></i>
        </div>
        <ag-grid-vue style="width:100%;height:405px"
                     class="ag-theme-balham"
                     :gridOptions="gridOptions"
                     :columnDefs="gridOptions.columnDefs"
                     :rowData="gridOptions.rowData"
                     @grid-ready="onGridReady">
        </ag-grid-vue>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="800">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
// import tableLang from '../../I18n/langs/tableLang'
import BtnCellRenderer from '../../assets/JS/btn-cell-renderer'
export default {
  name: 'DeviceManage',
  components: {
    AgGridVue
  },
  data () {
    return {
      inputValue: '',
      gridOptions: {
        rowModelType: 'serverSide',
        defaultColDef: {
          resizable: true,
          filter: true,
          sortable: true,
          enableCellChangeFlash: true,
          editable: true
        },
        pagination: true,
        paginationAutoPageSize: true,
        animateRows: true,
        enableRangeSelection: true,
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'right' },
            { statusPanel: 'agTotalRowCountComponent', align: 'right' },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
            { statusPanel: 'agAggregationComponent' }
          ]
        },
        sideBar: {
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
                suppressSideButtons: true
              }
            },
            {
              id: 'filters',
              labelDefault: 'Filters',
              labelKey: 'filters',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel'
            }
          ]
        },
        //  defaultToolPanel: 'columns',
        columnDefs: null,
        rowData: null,
        localeText: null,
        context: null,
        frameworkComponents: {
          btnCellRenderer: BtnCellRenderer
        }
      }
    }
  },
  beforeMount () {
    // 初始化表格列
    this.gridOptions.columnDefs = [
      {
        headerName: '箱号',
        field: 'deviceSN',
        sort: 'asc',
        valueParser: 'Number(newValue)',
        cellStyle: params => params.value > 80 ? { color: 'red' } : { color: 'black' }
      },
      { headerName: '设备号1', field: 'name' },
      { headerName: '设备号2', field: 'price', valueParser: 'Number(newValue)' },
      { headerName: '汇总', valueGetter: 'data.deviceSN+data.price' },
      {
        editable: false,
        headerName: '设备号',
        field: 'deviceSN',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          clicked: function (params) {
            alert(`${params} $router.push`)
          }
        }
      },
      {
        headerName: '设备号1',
        field: 'name',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          clicked: function (params) {
            alert(`${params} was clicked`)
          }
        }
      }
    ]
    // 初始化表格数据
    this.gridOptions.rowData = this.getRowData()
  },
  computed: {},
  methods: {
    addDevices () {
      this.$router.push('/adddevices')
    },
    onGridReady(params) {
      // 表格初始化后自适应
      this.gridOptions.api.sizeColumnsToFit()
      // const updateData = data => {
      //   var fakeServer = createFakeServer(data)
      //   var datasource = createServerSideDatasource(fakeServer)
      //   params.api.setServerSideDatasource(datasource)
      // }
    },
    getRowData () {
      const rowData = [
        { deviceSN: 121, name: 'Celica', price: 200 },
        { deviceSN: 22212, name: 'Mondeo', price: 32000 },
        { deviceSN: 3, name: 'Boxter', price: 72000 },
        { deviceSN: 4, name: 'Boxter', price: 72000 },
        { deviceSN: 5, name: 'Boxter', price: 72000 },
        { deviceSN: 6, name: 'Boxter', price: 72000 },
        { deviceSN: 7, name: 'Boxter', price: 72000 },
        { deviceSN: 8, name: 'Boxter', price: 72000 },
        { deviceSN: 9, name: 'Boxter', price: 72000 },
        { deviceSN: 10, name: 'Boxter', price: 72000 },
        { deviceSN: 11, name: 'Boxter', price: 72000 },
        { deviceSN: 12, name: 'Celica', price: 35000 },
        { deviceSN: 13, name: 'Mondeo', price: 32000 },
        { deviceSN: 14, name: 'Boxter', price: 72000 },
        { deviceSN: 15, name: 'Celica', price: 35000 },
        { deviceSN: 16, name: 'Mondeo', price: 32000 },
        { deviceSN: 17, name: 'Boxter', price: 72000 },
        { deviceSN: 18, name: 'Celica', price: 35000 },
        { deviceSN: 19, name: 'Mondeo', price: 32000 },
        { deviceSN: 201111, name: 'Boxter', price: 72000 }
      ]
      return rowData
    },
    update () {
      //   this.gridOptions.api.setRowData(this.newData)
      var rowNode = this.gridOptions.api.getRowNode('3')
      rowNode.setDataValue('deviceSN', 9999)
      this.gridOptions.api.setSortModel([{ colId: 'deviceSN', sort: 'desc' }])
      // rowNode.setData({ deviceSN: 33, name: 'Box3ter', price: 720300 })
      //  console.log(this.gridOptions.api.getRowNodeId('deviceSN'))
      console.log(this.gridOptions.api.getRowNode(0).data.deviceSN)
    },
    // 导出按钮
    onBtnExportDataAsExcel () {
      this.gridOptions.api.exportDataAsExcel()
    },
    // 搜索栏
    onQuickFilterChanged () {
      this.gridOptions.api.setQuickFilter(this.inputValue)
    }
  }
}
</script>

<style scoped lang="less">
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

  .icon1 {
    font-size: 20px;
    right: 0;
    cursor: pointer;
  }

  .icon1:hover {
    color: #2F74EB;
  }

  .icon2:hover {
    color: #2F74EB;
  }

  .icon2 {
    cursor: pointer;
    font-size: 20px;
    right: 0;
  }
  .rag-red {
    background-color: lightcoral;
  }
  .rag-green {
    background-color: lightgreen;
  }
  .rag-amber {
    background-color: lightsalmon;
  }
</style>
