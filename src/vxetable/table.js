import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import './variable.scss'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import 'vxe-table/styles/variable.scss'

Vue.prototype.$modal = VXETable.modal
VXETable.use(VXETablePluginExportXLSX)
Vue.use(VXETable)
