import enLocale from 'element-ui/lib/locale/lang/en'
import enUS from 'vxe-table/lib/locale/lang/en-US'
const en = {
  login: {
    welcome: 'Sign In To Continue To Tankmiles',
    username: 'Username',
    password: 'Password',
    remember: 'Remember me',
    login: 'Log In',
    loading: 'loading..',
    reset: 'Reset',
    forget: 'Forget Password?',
    contact: 'Contact Us',
    alert1: 'Missing Username!',
    alert11: 'Length is 5 to 10 characters',
    alert2: 'Missing Password!',
    alert21: 'Length is 8 to 20 characters',
    alert3: 'Login Failed!',
    alert4: 'Login Success！',
    alert5: 'Welcome Back!',
    alert6: 'Check Username&Password'
  },
  home: {},
  table: {
    selectAll: 'Select All',
    searchOoo: 'Search...'
  },
  ...enLocale,
  ...enUS
}

export default en
