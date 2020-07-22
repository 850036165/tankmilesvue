import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import DashBoard from '../components/DashBoard'
import Message from '../components/Bar/Message'
import PersonalSetting from '../components/Bar/PersonalSetting'
import BasicSetting from '../components/Bar/BasicSetting'
import DeviceManage from '../components/device/DeviceManage'
import AddDevices from '../components/device/AddDevices'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/dashboard',
    children: [
      { path: '/message', component: Message },
      { path: '/personalsetting', component: PersonalSetting },
      { path: '/basicsetting', component: BasicSetting },
      { path: '/dashboard', component: DashBoard },
      { path: '/devicemanage', component: DeviceManage },
      { path: '/adddevices', component: AddDevices }
    ]
  }

]

const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
