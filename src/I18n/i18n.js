import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import messages from './langs'
import VXETable from 'vxe-table'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'cn', // 本地化存储
  messages
})
locale.i18n((key, value) => i18n.t(key, value))

Vue.use(VXETable, {
  // 对组件内置的提示语进行国际化翻译
  i18n: key => i18n.t(key)
})
export default i18n
