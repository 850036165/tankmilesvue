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
import TankModel from '@/components/Model/TankModel'
import MassOperation from '../components/device/MassOperation'
import DeviceDetail from '../components/device/DeviceDetail'
import FirmwareManage from '../components/Firmware/FirmwareManage'
import TankList from '../components/tank/TankList'
import AddTanks from '../components/tank/AddTanks'
import TankDetail from '@/components/tank/TankDetail'
import ProjectList from '@/components/Project/ProjectList'
import AddProject from '@/components/Project/AddProject'
import ProjectDetail from '@/components/Project/ProjectDetail'
import Welcome from '@/components/Welcome'
import MediaModel from '@/components/Model/MediaModel'
import PermissionModel from '@/components/Model/PermissionModel'
import UserManage from '@/components/UserManage/UserManage'
import Monitoring from '@/components/monitoring/Monitoring'
import POI from '@/components/monitoring/POI'
import Product from '@/components/support/Product'
import Contact from '@/components/support/Contact'
import Bill from '@/components/Bill/Bill'
import Record from '@/components/Record'

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/message', component: Message },
      { path: '/personalSetting', component: PersonalSetting },
      { path: '/basicSetting', component: BasicSetting },
      { path: '/dashboard', component: DashBoard },
      { path: '/device', component: DeviceList },
      { path: '/device/adddevices', component: AddDevices },
      { path: '/device/massoperation', component: MassOperation },
      { path: '/device/devicedetail', component: DeviceDetail },
      { path: '/firmware', component: FirmwareManage },
      { path: '/tank', component: TankList },
      { path: '/tank/addtanks', component: AddTanks },
      { path: '/tank/tankdetail', component: TankDetail },
      { path: '/project', component: ProjectList },
      { path: '/project/addproject', component: AddProject },
      { path: '/project/projectdetail', component: ProjectDetail },
      { path: '/tankmodel', component: TankModel },
      { path: '/mediamodel', component: MediaModel },
      { path: '/permissionmodel', component: PermissionModel },
      { path: '/usermanage', component: UserManage },
      { path: '/monitoring', component: Monitoring },
      { path: '/POI', component: POI },
      { path: '/product', component: Product },
      { path: '/contact', component: Contact },
      { path: '/bill', component: Bill },
      { path: '/record', component: Record }

    ]
  }

]

const router = new VueRouter({
  mode: 'hash',
  routes: routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
