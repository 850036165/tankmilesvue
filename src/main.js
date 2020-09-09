import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/CSS/global.css'
import axios from 'axios'
import '../vue.config'
import i18n from './I18n/i18n'
import '../src/assets/Iconfont/iconfont.css'
import '../src/assets/Iconfont/iconfont'

import './vxetable/table.js'
import './vxetable/utils.js'

// import 'ag-grid-community/dist/styles/ag-grid.css'
// import 'ag-grid-community/dist/styles/ag-theme-balham.css'
// import { LicenseManager } from 'ag-grid-enterprise'

// LicenseManager.setLicenseKey('For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-13_September_2020_[v2]_MTU5OTk1MTYwMDAwMA==931880529fd1f843daf745e6af1c1637')

axios.defaults.baseURL = 'http://125.72.105.218:59090'
// axios.defaults.baseURL = 'http://test.tankmiles.com/apis'
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.authtoken = sessionStorage.getItem('token')
  return config
}
)
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
