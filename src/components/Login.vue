<template>
  <div class="worldMap">
    <!--    切换语言按钮-->
    <div class="switchLang">
      <el-dropdown trigger="click" @command="handleCommand" size="mini">
        <svg class="iconchange" aria-hidden="true">
          <use xlink:href="#icon-fanyix"></use>
        </svg>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
          <el-dropdown-item disabled>こんにちは</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--      登录框-->
    <div class="loginBox">
      <div>
        <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" class="form_group"
                 hide-required-asterisk>
          <el-image :src="url" fit="contain" class="homeLogo hidden-md-and-down" @click="goHomePage"></el-image>
          <p class="welcomeText hidden-md-and-down">欢迎回来！请登录您的罐程账户。</p>
          <p class="welcomeText1 hidden-md-and-down">如需帮助请联系
            <a href="mailto:tankmiles@cimc.com?subject=Question%20For%20Tankmiles"
               class="welcomeText1 hidden-md-and-down">tankmiles@cimc.com</a> 或
            <a href="mailto:info@savvy-telematics.com"
               class="welcomeText1 hidden-md-and-down">info@savvy-telematics.com</a></p>
          <!--<label>用户名</label>-->
          <el-form-item class="form_input" prop="name"><!--用户名-->
            <el-input id="input1" v-model="loginForm.name" prefix-icon="el-icon-user"
                      :placeholder="$t('login.username')"></el-input>
          </el-form-item>
          <!--<label>密码</label>-->
          <el-form-item class="form_input" prop="password"><!--密码-->
            <el-input id="input" type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"
                      :placeholder="$t('login.password')"></el-input>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-checkbox class="form_checkbox">{{ $t('login.remember') }}</el-checkbox>&lt;!&ndash;记住密码&ndash;&gt;-->
          <!--          </el-form-item>-->
          <el-form-item><!--登录按钮-->
            <div style="margin-top: 30px">
              <el-button :loading="loadingStatus"
                         @click="login()" type="primary" size="small" style="width: 100px">
                {{ loadingText1.loadingText }}
              </el-button>
              <span class="forgetPassword hidden-sm-and-down">忘记密码</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <p class="bottom_text hidden-md-and-down">Copyright © 2019-2020 <br>Nantong CIMC Tank Equipment Co., Ltd.</p>
    </div>
    <!--    轮播背景-->
    <el-carousel :interval=30000 id="el-carousel" height="100%" arrow="never" trigger="click"
                 style="width: 70%;height: 100%;position: absolute;  -webkit-user-select: none;">
      <el-carousel-item v-for="(item,index) in imageBox" :key="index">
        <img :src="item.path" alt="未加载" style="object-fit: cover;width: 100%;height: 100%">
      </el-carousel-item>
    </el-carousel>
    <!--    遮罩背景-->
    <div
      style="position:absolute;height: 100%;width: 100%;z-index: 2; background: linear-gradient(to  right,rgba(0, 0, 0, 0.05) 10%,rgba(0, 0, 0, 0.1) 15%,rgba(0, 0, 0, 0.1) 20%,rgba(0, 0, 0, 0.2) 25%,rgba(0, 0, 0, 0.3) 30%,rgba(0, 0, 0, 0.4) 35%,rgba(0, 0, 0, 0.5) 40%,rgba(0, 0, 0, 0.6) 45%,rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.85) 55%,rgba(0, 0, 0, 0.88) 58%,rgba(0, 0, 0, 0.9) 60%,black 65%);"></div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'Login',
  data() {
    return {
      welcomeLoading: true,
      loadingStatus: false,
      loginForm: {
        name: 'zoya',
        password: '111111'
      },
      imageBox: [
        {path: require('../assets/Image/Imagebox/1.jpg')},
        {path: require('../assets/Image/Imagebox/2.jpg')},
        {path: require('../assets/Image/Imagebox/3.jpg')},
        {path: require('../assets/Image/Imagebox/4.jpg')}
      ],
      url: require('../assets/Image/Login_logo.png'),
      href: 'https://www.baidu.com'
    }
  },
  computed: {
    loadingText1() {
      return {
        loadingStatus: false,
        loadingText: `${this.$t('login.login')}`
      }
    },
    loginFormRules() {
      // 验证规则
      return {
        name: [
          {required: true, message: `${this.$t('login.alert1')}`, trigger: 'blur'},
          {min: 4, max: 10, message: `${this.$t('login.alert11')}`, trigger: 'blur'}
        ],
        password: [
          {required: true, message: `${this.$t('login.alert2')}`, trigger: 'blur'},
          {min: 6, max: 20, message: `${this.$t('login.alert21')}`, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    goHomePage() {
      window.open('https://www.baidu.com', '_blank')
    },
    // 登录请求
    login() {
      this.loadingStatus = true
      this.loadingText1.loadingText = `${this.$t('login.loading')}`
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          this.loadingText1.loadingText = `${this.$t('login.login')}`
          this.loadingStatus = false
          return
        }
        // start
        await this.$http.post('/user/login', this.loginForm).then(async (response) => {
          // console.log(response.data.code)
          if (response.data.code !== 0) {
            this.$notify({
              title: `${this.$t('login.alert3')}`,
              message: `${this.$t('login.alert6')}`,
              type: 'warning'
            })
            this.loadingText1.loadingText = `${this.$t('login.login')}`
            this.loadingStatus = false
          } else {
            this.$notify({
              title: `${this.$t('login.alert4')}`,
              message: `${this.loginForm.name}!${this.$t('login.alert5')}`,
              type: 'success'
            })
            this.loadingText1.loadingText = `${this.$t('login.login')}`
            this.loadingStatus = false
            window.sessionStorage.setItem('token', response.data.message)
            await this.$router.push('/dashboard')
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
    handleCommand(command) {
      this.$i18n.locale = command
      // console.log(command)
      localStorage.setItem('lang', command)
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
  width: 100%;
  -webkit-user-select: none;
  font-weight: lighter;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  color: #6c6e6f;
  font-family: "Helvetica Neue", sans-serif;
  text-align: center;
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
