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

axios.defaults.baseURL = 'http://125.72.105.218:59090'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
