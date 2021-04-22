import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/CSS/global.css'
import axios from 'axios'
import '../vue.config'
import i18n from './I18n/i18n'
import '../src/assets/Iconfont/iconfont.js'
import '../src/assets/Iconfont/iconfont1.js'
import '../src/assets/Iconfont/iconfont3.js'
import VuePageTransition from 'vue-page-transition'
import './vxetable/utils.js'
import './vxetable/table.js'
import VueRouter from 'vue-router'
import VXETable from 'vxe-table'
import { VueJsonp } from 'vue-jsonp'
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VuePageTransition)
Vue.use(VueJsonp)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// import 'ag-grid-community/dist/styles/ag-grid.css'
// import 'ag-grid-community/dist/styles/ag-theme-balham.css'
// import { LicenseManager } from 'ag-grid-enterprise'

// LicenseManager.setLicenseKey('For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-13_September_2020_[v2]_MTU5OTk1MTYwMDAwMA==931880529fd1f843daf745e6af1c1637')

axios.defaults.baseURL = 'https://api.tankmiles.com:9443'
// axios.defaults.baseURL = 'http://test.tankmiles.com/apis'

// 请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.authtoken = sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 返回拦截器
axios.interceptors.response.use(response => {
  if (Object.prototype.hasOwnProperty.call(response.data, 'code')) {
    console.log(response.data.code, '全局拦截返回值')
    switch (response.data.code) {
      case 1:
        console.log('返回code1', response.data.code)
        return response
      case 100:
        console.log('返回code2', response.data.code)
        Vue.prototype.$notify({
          title: i18n.t('main.requestFailed'),
          message: i18n.t('main.noAuthToken'),
          type: 'error'
        })
        window.sessionStorage.clear()
        router.push('/login')
        break
      case 101:
        console.log('返回code3', response.data.code)
        Vue.prototype.$notify({
          title: i18n.t('main.requestFailed'),
          message: i18n.t('main.AuthTokenValid'),
          type: 'error'
        })
        window.sessionStorage.clear()
        router.push('/login')
        break
      case 200:
        console.log('返回code4', response.data.code)
        Vue.prototype.$notify({
          title: i18n.t('main.requestFailed'),
          message: i18n.t('main.noAuth'),
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
        console.log('ok', response.data.code)
        return response
      default:
        console.log('未知错误', response.data.code)
        Vue.prototype.$notify({
          title: i18n.t('main.unknownError'),
          message: i18n.t('main.unknownError2'),
          type: 'warning'
        })
        window.sessionStorage.clear()
        router.push('/login')
    }
  } else {
    return response
  }
}, error => {
  VXETable.modal.message({ message: `${i18n.t('main.requestFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique' })
})

// 防止手动修改localstorage
window.addEventListener('storage', (e) => {
  localStorage.setItem(e.key, e.oldValue) // 重新赋值修改前的值
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
