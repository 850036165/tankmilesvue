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
import VuePageTransition from 'vue-page-transition'
import './vxetable/utils.js'
import './vxetable/table.js'
import VueRouter from 'vue-router'
import VXETable from 'vxe-table'

Vue.use(VuePageTransition)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// import 'ag-grid-community/dist/styles/ag-grid.css'
// import 'ag-grid-community/dist/styles/ag-theme-balham.css'
// import { LicenseManager } from 'ag-grid-enterprise'

// LicenseManager.setLicenseKey('For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-13_September_2020_[v2]_MTU5OTk1MTYwMDAwMA==931880529fd1f843daf745e6af1c1637')

axios.defaults.baseURL = 'http://47.89.13.131:9090'
// axios.defaults.baseURL = 'http://test.tankmiles.com/apis'
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.authtoken = sessionStorage.getItem('token')
  return config
})

// 返回拦截器
axios.interceptors.response.use(response => {
  console.log(response.data.code, '全局拦截返回值')
  switch (response.data.code) {
    case 1:
      console.log('返回code1', response.data.code)
      VXETable.modal.message({ message: `error@${response.data.message}`, status: 'error' })
      break
    case 100:
      console.log('返回code2', response.data.code)
      Vue.prototype.$notify({
        title: '请求失败',
        message: '未检测到AuthToken,请重新登陆',
        type: 'error'
      })
      window.sessionStorage.clear()
      router.push('/login')
      break
    case 101:
      console.log('返回code3', response.data.code)
      Vue.prototype.$notify({
        title: '请求失败',
        message: 'AuthToken已失效,请重新登陆',
        type: 'error'
      })
      window.sessionStorage.clear()
      router.push('/login')
      break
    case 200:
      console.log('返回code4', response.data.code)
      Vue.prototype.$notify({
        title: '请求失败',
        message: '您没有操作权限',
        type: 'warning'
      })
      break
    case 103:
      console.log('账户已被禁用', response.data.code)
      return response
    case 102:
      console.log('密码错误', response.data.code)
      return response
    case 0:
      console.log('返回code5', response.data.code)
      return response
    default:
      console.log('未知错误', response.data.code)
      Vue.prototype.$notify({
        title: '未知错误',
        message: '未知错误，请重试',
        type: 'warning'
      })
      window.sessionStorage.clear()
      router.push('/login')
  }
})

// 防止手动修改localstorage
window.addEventListener('storage', (e) => {
  localStorage.setItem(e.key, e.oldValue) // 重新赋值修改前的值
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
