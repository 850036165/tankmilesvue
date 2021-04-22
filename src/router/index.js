import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "login" */ '../components/Login')
// import Home from '../components/Home'
// import DashBoard from '../components/DashBoard'
// import Message from '../components/Bar/Message'
// import PersonalSetting from '../components/Bar/PersonalSetting'
// import BasicSetting from '../components/Bar/BasicSetting'
const Home = () => import(/* webpackChunkName: "main" */ '../components/Home')
const DashBoard = () => import(/* webpackChunkName: "main" */ '../components/DashBoard')
const Message = () => import(/* webpackChunkName: "main" */ '../components/Bar/Message')
const PersonalSetting = () => import(/* webpackChunkName: "main" */ '../components/Bar/PersonalSetting')
const BasicSetting = () => import(/* webpackChunkName: "main" */ '../components/Bar/BasicSetting')
// import DeviceList from '../components/device/DeviceList'
// import AddDevices from '../components/device/AddDevices'
// import DeviceDetail from '../components/device/DeviceDetail'
const DeviceList = () => import(/* webpackChunkName: "device" */ '../components/device/DeviceList')
const AddDevices = () => import(/* webpackChunkName: "device" */ '../components/device/AddDevices')
const DeviceDetail = () => import(/* webpackChunkName: "device" */ '../components/device/DeviceDetail')
// import TankModel from '@/components/Model/TankModel'
const TankModel = () => import(/* webpackChunkName: "tank" */ '@/components/Model/TankModel')
// import MassOperation from '../components/device/MassOperation'
const MassOperation = () => import(/* webpackChunkName: "tank" */ '../components/device/MassOperation')
// import FirmwareManage from '../components/Firmware/FirmwareManage'
const FirmwareManage = () => import(/* webpackChunkName: "firmware" */ '../components/Firmware/FirmwareManage')
// import TankList from '../components/tank/TankList'
const TankList = () => import(/* webpackChunkName: "tank" */ '../components/tank/TankList')
// import AddTanks from '../components/tank/AddTanks'
const AddTanks = () => import(/* webpackChunkName: "tank" */ '../components/tank/AddTanks')
// import TankDetail from '@/components/tank/TankDetail'
const TankDetail = () => import(/* webpackChunkName: "tank" */ '@/components/tank/TankDetail')
// import ProjectList from '@/components/Project/ProjectList'
const ProjectList = () => import(/* webpackChunkName: "project" */ '@/components/Project/ProjectList')
// import AddProject from '@/components/Project/AddProject'
const AddProject = () => import(/* webpackChunkName: "project" */ '@/components/Project/AddProject')
// import ProjectDetail from '@/components/Project/ProjectDetail'
const ProjectDetail = () => import(/* webpackChunkName: "project" */ '@/components/Project/ProjectDetail')
// import MediaModel from '@/components/Model/MediaModel'
const MediaModel = () => import(/* webpackChunkName: "model" */ '@/components/Model/MediaModel')
// import PermissionModel from '@/components/Model/PermissionModel'
const PermissionModel = () => import(/* webpackChunkName: "model" */ '@/components/Model/PermissionModel')
// import UserManage from '@/components/UserManage/UserManage'
const UserManage = () => import(/* webpackChunkName: "user" */ '@/components/UserManage/UserManage')
// import Monitoring from '@/components/monitoring/Monitoring'
const Monitoring = () => import(/* webpackChunkName: "monitor" */ '@/components/monitoring/Monitoring')
// import POI from '@/components/monitoring/POI'
const POI = () => import(/* webpackChunkName: "monitor" */ '@/components/monitoring/POI')
// import Product from '@/components/support/Product'
const Product = () => import(/* webpackChunkName: "support" */ '@/components/support/Product')
// import Contact from '@/components/support/Contact'
const Contact = () => import(/* webpackChunkName: "support" */ '@/components/support/Contact')
// import Bill from '@/components/Bill/Bill'
const Bill = () => import(/* webpackChunkName: "bill" */ '@/components/Bill/Bill')
// import Record from '@/components/Record'
const Record = () => import(/* webpackChunkName: "record" */ '@/components/Record')
// import AddUsers from '@/components/UserManage/AddUsers'
const AddUsers = () => import(/* webpackChunkName: "user" */ '@/components/UserManage/AddUsers')
// import UserEdit from '@/components/UserManage/UserEdit'
const UserEdit = () => import(/* webpackChunkName: "user" */ '@/components/UserManage/UserEdit')
// import NoAccessPage from '@/components/NoAccessPage'
const NoAccessPage = () => import(/* webpackChunkName: "access" */ '@/components/NoAccessPage')
// import GroupList from '@/components/Group/GroupList'
const GroupList = () => import(/* webpackChunkName: "group" */ '@/components/Group/GroupList')
// import createMonitor from '@/components/monitoring/createMonitor'
const createMonitor = () => import(/* webpackChunkName: "monitor" */ '@/components/monitoring/createMonitor')
// import EditTank from '@/components/tank/EditTank'
const EditTank = () => import(/* webpackChunkName: "tank" */ '@/components/tank/EditTank')
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // redirect: '/welcome',
    children: [
      { path: '/message', component: Message },
      { path: '/personalSetting', component: PersonalSetting },
      { path: '/basicSetting', component: BasicSetting },
      {
        path: '/dashboard',
        component: DashBoard,
        meta: {
          transition: 'fade'
        }
      },
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
      { path: '/record', component: Record },
      { path: '/addusers', component: AddUsers },
      { path: '/useredit', component: UserEdit },
      { path: '/403', component: NoAccessPage },
      { path: '/grouplist', component: GroupList },
      { path: '/createmonitor', component: createMonitor },
      { path: '/edittank', component: EditTank }

    ]
  }

]

const router = new VueRouter({
  mode: 'hash',
  routes: routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login') {
    if (tokenStr) {
      return next('/dashboard')
    } else return next()
  } else {
    if (!tokenStr) {
      Vue.prototype.$notify({
        title: '请求失败',
        message: '未检测到Authtoken,请先登陆',
        type: 'error'
      })
      return next('/login')
    } else next()
  }
})
/* router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
}) */
export default router
