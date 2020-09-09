import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

const zh = {
  login: {
    welcome: '欢迎使用罐程平台',
    username: '用户名',
    password: '密码',
    remember: '记住我',
    login: '登录',
    loading: '登陆中..',
    reset: '重置',
    forget: '忘记密码',
    contact: '联系我们',
    alert1: '账号不能为空!',
    alert11: '长度在 5 到 10 个字符',
    alert2: '密码不能为空!',
    alert21: '长度在 6 到 20 个字符',
    alert3: '登录失败!',
    alert4: '登录成功！',
    alert5: '欢迎使用罐程平台',
    alert6: '账号或密码错误!'

  },
  home: {},
  table: {
    selectAll: '全选',
    searchOoo: '搜索...'
  },
  ...zhLocale,
  ...zhCN
}

export default zh
