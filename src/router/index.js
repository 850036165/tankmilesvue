import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import DashBoard from '../components/DashBoard'
import Message from '../components/Bar/Message'
import PersonalSetting from '../components/Bar/PersonalSetting'
import BasicSetting from '../components/Bar/BasicSetting'
import DeviceList from '../components/device/DeviceList'
import AddDevices from '../components/device/AddDevices'
// import Welcome from '../components/Welcome'
import MassOperation from '../components/device/MassOperation'
import DevicesInfo from '../components/device/DevicesInfo'
import FirmwareManage from '../components/Firmware/FirmwareManage'
import TankList from '../components/tank/TankList'
import AddTanks from '../components/tank/AddTanks'
import TankDetail from '@/components/tank/TankDetail'
import Loginbackup from '@/components/Loginbackup'
import ProjectList from '@/components/Project/ProjectList'
import AddProject from '@/components/Project/AddProject'
import ProjectDetail from '@/components/Project/ProjectDetail'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Loginbackup },
  {
    path: '/home',
    component: Home,
    // redirect: '/welcome',
    children: [
      { path: '/welcome', component: Login },
      { path: '/message', component: Message },
      { path: '/personalSetting', component: PersonalSetting },
      { path: '/basicSetting', component: BasicSetting },
      { path: '/dashboard', component: DashBoard },
      { path: '/device', component: DeviceList },
      { path: '/device/adddevices', component: AddDevices },
      { path: '/device/massoperation', component: MassOperation },
      { path: '/device/devicesinfo', component: DevicesInfo },
      { path: '/firmware', component: FirmwareManage },
      { path: '/tank', component: TankList },
      { path: '/tank/addtanks', component: AddTanks },
      { path: '/tank/tankdetail', component: TankDetail },
      { path: '/project', component: ProjectList },
      { path: '/project/addproject', component: AddProject },
      { path: '/project/projectdetail', component: ProjectDetail }
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
