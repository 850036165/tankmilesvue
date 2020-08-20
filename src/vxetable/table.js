import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'

Vue.prototype.$modal = VXETable.modal
VXETable.use(VXETablePluginExportXLSX)
Vue.use(VXETable)
