<template>
  <div class="worldMap">
    <!--    切换语言按钮-->
    <div class="switchLang">
      <el-dropdown
        trigger="click"
        @command="handleCommand"
        size="mini"
      >
        <svg
          class="iconchange"
          aria-hidden="true"
        >
          <use xlink:href="#icon-fanyix" />
        </svg>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">
            中文
          </el-dropdown-item>
          <el-dropdown-item command="en">
            English
          </el-dropdown-item>
          <el-dropdown-item disabled>
            こんにちは
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--      登录框-->
    <div class="loginBox">
      <div>
        <el-form
          :model="loginForm"
          ref="loginFormRef"
          :rules="loginFormRules"
          class="form_group"
          hide-required-asterisk
        >
          <el-image
            :src="url"
            fit="contain"
            class="homeLogo hidden-md-and-down"
            @click="goHomePage"
          />
          <p class="welcomeText hidden-md-and-down">
            欢迎回来！请登录您的罐程账户。
          </p>
          <p class="welcomeText1 hidden-md-and-down">
            如需帮助请联系
            <a
              href="mailto:tankmiles@cimc.com?subject=Question%20For%20Tankmiles"
              class="welcomeText1 hidden-md-and-down"
            >tankmiles@cimc.com</a> 或
            <a
              href="mailto:info@savvy-telematics.com"
              class="welcomeText1 hidden-md-and-down"
            >info@savvy-telematics.com</a>
          </p>
          <!--<label>用户名</label>-->
          <el-form-item
            class="form_input"
            prop="name"
            style="width: 21vw"
          >
            <!--用户名-->
            <el-input
              id="input1"
              v-model="loginForm.name"
              prefix-icon="el-icon-user"
              :placeholder="$t('login.username')"
            />
          </el-form-item>
          <!--<label>密码</label>-->
          <el-form-item
            style="width: 21vw"
            class="form_input"
            prop="password"
          >
            <!--密码-->
            <el-input
              @keyup.enter.native="login()"
              id="input"
              type="password"
              show-password
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              :placeholder="$t('login.password')"
            />
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-checkbox class="form_checkbox">{{ $t('login.remember') }}</el-checkbox>&lt;!&ndash;记住密码&ndash;&gt;-->
          <!--          </el-form-item>-->
          <el-form-item
            style="width: 21vw"
          >
            <!--登录按钮-->
            <div style="margin-top: 30px">
              <el-button
                :loading="loadingStatus"
                @click="login()"
                type="primary"
                size="small"
                style="width: 100px"
              >
                {{ loadingText1.loadingText }}
              </el-button>
              <span class="forgetPassword hidden-sm-and-down">忘记密码</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <p class="bottom_text hidden-md-and-down">
        Copyright © 2019-2020 Nantong CIMC Tank Equipment Co., Ltd.
      </p>
    </div>
    <!--    轮播背景-->
    <el-carousel
      :interval="10000"
      id="el-carousel"
      height="100%"
      arrow="never"
      trigger="click"
      style="width: 70%;height: 100%;position: absolute;  -webkit-user-select: none;"
    >
      <el-carousel-item
        v-for="(item,index) in imageBox"
        :key="index"
      >
        <img
          id="img"
          :src="item.path"
          alt="未加载"
          style="object-fit: cover;width: 100%;height: 100%"
        >
      </el-carousel-item>
    </el-carousel>
    <!--    遮罩背景-->
    <div
      style="position:absolute;height: 100%;width: 100%;z-index: 2; background: linear-gradient(to  right,rgba(0, 0, 0, 0.05) 10%,rgba(0, 0, 0, 0.1) 15%,rgba(0, 0, 0, 0.1) 20%,rgba(0, 0, 0, 0.2) 25%,rgba(0, 0, 0, 0.3) 30%,rgba(0, 0, 0, 0.4) 35%,rgba(0, 0, 0, 0.5) 40%,rgba(0, 0, 0, 0.6) 45%,rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.85) 55%,rgba(0, 0, 0, 0.88) 58%,rgba(0, 0, 0, 0.9) 60%,black 65%);"
    />
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import md5 from 'js-md5'

export default {
  name: 'Login',
  data () {
    return {
      welcomeLoading: true,
      loadingStatus: false,
      loginForm: {
        name: 'zoya',
        password: '111111'
      },
      imageBox: [
        { path: 'https://oss.tankmiles.com/1.jpg' },
        { path: 'https://oss.tankmiles.com/2.jpg' },
        { path: 'https://oss.tankmiles.com/3.jpg' },
        { path: 'https://oss.tankmiles.com/4.jpg' }
      ],
      url: 'https://oss.tankmiles.com/Login_logo.png',
      href: 'https://www.baidu.com'
    }
  },
  computed: {
    loadingText1 () {
      return {
        loadingStatus: false,
        loadingText: `${this.$t('login.login')}`
      }
    },
    loginFormRules () {
      // 验证规则
      return {
        name: [
          { required: true, message: `${this.$t('login.alert1')}`, trigger: 'blur' }
        ],
        password: [
          { required: true, message: `${this.$t('login.alert2')}`, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goHomePage () {
      window.open(this.href, '_blank')
    },
    // 登录请求
    login () {
      this.loadingStatus = true
      this.loadingText1.loadingText = `${this.$t('login.loading')}`
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          this.loadingText1.loadingText = `${this.$t('login.login')}`
          this.loadingStatus = false
          return
        }
        // md5加密
        await this.$http.post('/user/login', {
          name: this.loginForm.name,
          password: md5(this.loginForm.password)
        }).then(async (response) => {
          // console.log(response.data.code)
          if (response.data.code === 102) {
            this.$notify({
              title: `${this.$t('login.alert3')}`,
              message: `${this.$t('login.alert6')}`,
              type: 'warning'
            })
            this.loadingText1.loadingText = `${this.$t('login.login')}`
            this.loadingStatus = false
          } else if (response.data.code === 103) {
            this.$notify({
              title: '登录失败',
              message: '您的账户已被禁用',
              type: 'warning'
            })
            this.loadingText1.loadingText = `${this.$t('login.login')}`
            this.loadingStatus = false
          } else if (response.data.code === 0) {
            let text = ''
            const time = new Date().getHours()
            if ((time >= 0) && (time < 7)) {
              text = '夜猫子，要注意身体哦！ '
            }
            if ((time >= 7) && (time < 12)) {
              text = '上午好'
            }
            if ((time >= 12) && (time < 14)) {
              text = '午休时间。您要保持睡眠哦！'
            }
            if ((time >= 14) && (time < 18)) {
              text = '下午好！'
            }
            if ((time >= 18) && (time <= 22)) {
              text = '还在加班吗？'
            }
            if ((time >= 22) && (time < 24)) {
              text = '您应该休息了！'
            }
            console.log(text)
            this.$notify({
              title: `${this.$t('login.alert4')}`,
              message: `${response.data.data.nickName}!${text}`,
              type: 'success'
            })
            this.loadingText1.loadingText = `${this.$t('login.login')}`
            this.loadingStatus = false
            window.sessionStorage.setItem('token', response.data.data.sessionId)
            window.localStorage.setItem('avatarUrl', response.data.data.avatarUrl)
            window.localStorage.setItem('nickName', response.data.data.nickName)
            window.localStorage.setItem('groupId', response.data.data.groupId)
            window.localStorage.setItem('admin', response.data.data.admin)
            await this.$router.push('/dashboard')
          } else {
            this.$notify({
              title: '未知错误',
              message: '未知错误',
              type: 'error'
            })
            this.loadingText1.loadingText = `${this.$t('login.login')}`
            this.loadingStatus = false
          }
          // end
        }).catch((error) => {
          this.$notify({
            title: `${this.$t('login.alert3')}`,
            message: `${error}!`,
            type: 'error'
          })
          this.loadingText1.loadingText = `${this.$t('login.login')}`
          this.loadingStatus = false
          console.log(error)
        })
      })
    },
    // 切换语言
    handleCommand (command) {
      this.$i18n.locale = command
      // console.log(command)
      localStorage.setItem('lang', command)
    }

  },
  mounted () {
    const userAgent = navigator.userAgent
    const isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera // 判断是否IE浏览器
    const isEdge = userAgent.indexOf('Edge') > -1 // 判断是否IE的Edge浏览器
    const isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
    const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1 // 判断是否Safari浏览器
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 // 判断Chrome浏览器
    if (isOpera === true || isIE === true || isEdge === true || isFF === true || isSafari === true) {
      alert('检测到非Chrome浏览器,可能会导致兼容性问题!\r\n是否继续?')
    } else {
      console.log(isChrome)
    }
  }
}

</script>

<style lang="less" scoped>
.worldMap {
  width: 100%;
  height: 100%;
  background: black;
  z-index: -1;
  min-height: 380px
}

.loginBox {
  border: none;
  z-index: 999;
  height: 100%;
  width: 25vw;
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translate(0, -50%);
}

.switchLang {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 999;
  cursor: pointer
}

.form_group {
  width: 99%;
  position: absolute;
  left: 50%;
  top: 15%;
  transform: translate(-50%);
}

/*只显示下边框*/
/deep/ .form_input .el-input__inner {
  border-radius: 0;
  //border: none;
  border-top: none;
  border-right: none;
  border-left: none;
  background: transparent;
  color: white;
}

/*去除谷歌浏览器自动填充*/
/deep/ #input {
  background-color: rgba(255, 255, 255, 0);
}

/deep/ #input1 {
  background-color: rgba(255, 255, 255, 0);
}

/deep/ input:-webkit-autofill {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: #ffffff
}

/deep/ input:-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff
}

.bottom_text {
  -webkit-user-select: none;
  font-weight: lighter;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  color: #6c6e6f;
  font-family: "Helvetica Neue", sans-serif;
  text-align: left;
  margin: 5px 0;
}

.welcomeText {
  user-select: none;
  z-index: auto;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  color: #ffffff;
  letter-spacing: 1px;
}

.welcomeText1 {
  user-select: none;
  width: 200px;
  z-index: auto;
  opacity: 0.5;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  color: #ffffff;
  letter-spacing: 1px;
}

.homeLogo {
  user-select: none;
  z-index: 999;
  transform: translate(-20%);
  height: 80px;
  cursor: pointer;
}

.forgetPassword {
  user-select: none;
  z-index: auto;
  float: right;
  opacity: 0.5;
  font-size: 10px;
  font-weight: 400;
  text-align: right;
  color: #9da7b8;
  cursor: pointer
}

a:link {
  color: white
}

a:visited {
  color: #9da7b8
}

a:hover {
  color: #9da7b8;
}

a:active {
  color: #9da7b8
}
</style>
