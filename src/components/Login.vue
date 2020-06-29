<template>
  <div class="login_container">
    <!--    语言切换-->
    <div class="switchLang">
      <el-dropdown trigger="click" @command="handleCommand" size="mini">
        <span class="iconfont icon-fanyix"></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="cn">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
          <el-dropdown-item disabled>こんにちは</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
<!--    轮播组件-->
    <el-carousel :interval=5000  class="el-carousel" :height="carouselHeight+'px'" >
      <el-carousel-item v-for="(item,index) in imageBox" :key="index">
        <img :src="item.path" alt="未加载" :width="carouselHeight*2+'px'" :height="carouselHeight+'px'">
      </el-carousel-item>
    </el-carousel>
    <!--    登录块-->
    <div class="login_box" >
      <div class="login_logo">
        <img src="../assets/Image/Login_logo.png" alt="未加载"/>
        <p class="text_left">{{$t('login.welcome')}}</p>
      </div>
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" class="form_group" hide-required-asterisk>
        <!--<label>用户名</label>-->
        <el-form-item class="form_input" prop="name"><!--用户名-->
          <el-input v-model="loginForm.name" prefix-icon="el-icon-user"
                    :placeholder="$t('login.username')"></el-input>
        </el-form-item>
        <!--<label>密码</label>-->
        <el-form-item class="form_input" prop="password"><!--密码-->
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"
                    :placeholder="$t('login.password')"></el-input>
        </el-form-item>
        <el-checkbox class="form_checkbox">{{$t('login.remember')}}</el-checkbox><!--记住密码-->
        <el-form-item class="form_button"><!--登录按钮-->
          <el-button :loading="loadingStatus" type="primary" icon="el-icon-s-promotion" class="form_login"
                     @click="login()">
            {{loadingText1.loadingText}}
          </el-button>
          <el-button type="info" icon="el-icon-refresh-right" class="form_login" @click="resetForm()">
            {{$t('login.reset')}}
          </el-button>
        </el-form-item>
        <div class="form_link1">
          <el-link type="info" class="el-icon-lock" :underline="false">|{{$t('login.forget')}}</el-link>
        </div>
        <div class="form_link2">
          <el-link type="info" class="el-icon-message" :underline="false">|{{$t('login.contact')}}</el-link>
        </div>
      </el-form>
      <p class="bottom_text">Copyright ©Tankmiles</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      carouselHeight: window.innerHeight,
      carouselWidth: window.innerWidth,
      loadingStatus: false,
      loginForm: {
        name: 'zoya',
        password: '111111'
      },
      imageBox: [
        { path: require('../assets/Image/Imagebox/1.jpg') },
        { path: require('../assets/Image/Imagebox/2.jpg') },
        { path: require('../assets/Image/Imagebox/3.jpg') },
        { path: require('../assets/Image/Imagebox/4.jpg') }
      ]
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
          { required: true, message: `${this.$t('login.alert1')}`, trigger: 'blur' },
          { min: 4, max: 10, message: `${this.$t('login.alert11')}`, trigger: 'blur' }
        ],
        password: [
          { required: true, message: `${this.$t('login.alert2')}`, trigger: 'blur' },
          { min: 6, max: 20, message: `${this.$t('login.alert21')}`, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
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
        const { data: res } = await this.$http.post('/user/login', this.loginForm)
        // console.log(res)
        if (res.code !== 0) {
          this.$notify({
            title: `${this.$t('login.alert3')}`,
            message: `${this.$t('login.alert6')}`,
            type: 'error'
          })
          this.loadingText1.loadingText = `${this.$t('login.login')}`
          this.loadingStatus = false
        } else {
          this.loadingText1.loadingText = `${this.$t('login.login')}`
          this.loadingStatus = false
          window.sessionStorage.setItem('token', res.message)
          await this.$router.push('/home')
          this.$notify({
            title: `${this.$t('login.alert4')}`,
            message: `${this.loginForm.name}!${this.$t('login.alert5')}`,
            type: 'success'
          })
        }
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
    // const that = this
    window.onresize = () => {
      return (() => {
        this.carouselHeight = window.innerHeight
        // this.carouselWidth = window.innerWidth
      })()
    }
  }

}

</script>

<style lang="less">
  .login_container {
    background-size: 100% 100%;
    background: #6c6e6f no-repeat;
    height: 100%;
  }

  .login_box {
    width: 37.5%;
    height: 100%;
    background: rgb(0, 9, 23);
    border-radius: 0px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);

    .login_logo {
      position: absolute;
      left: 15%;
      top: 10%;
      //transform: translate(-50%, 100%);
      margin-bottom: 0;

      img {
        width: 180px;
        height: 80px;

      }

      p {
        width: 200px;
        text-align: left;
        font-size: 20px;
        color: #ffffff;
        margin: 15px;
      }
    }

    .form_group {
      width: 300px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -35%);
      margin-bottom: 0;
      box-sizing: border-box;
    }
  }

  .form_input .el-input__inner {
    border-radius: 0;
    //border: none;
    border-top: none;
    border-right: none;
    border-left: none;
    background: rgb(32, 40, 49);
    color: white;
  }

  .form_input {
    // margin-bottom: 0 !important;
  }

  .form_checkbox {
    padding: 0 15px 22px 0;
  }

  .form_input .el-form-item__label {
    color: black;
    padding: 0 0 0 0 !important;
  }

  .form_button {
    left: 50%;
    width: 300px;
    // display: flex;
    justify-content: center;

    .form_login {
      width: 120px;
    }
  }

  .form_link1 {
    position: absolute;
    bottom: -10px;
    margin: 15px 0 0 0;
  }

  .form_link2 {
    position: absolute;
    right: 0;
    bottom: -10px;
    margin: 15px 0 0 0;
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

  /*谷歌浏览器自动填充*/
  input {
    background-color: rgba(255, 255, 255, 0) !important;
  }

  input:-webkit-autofill {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #ffffff !important;
  }

  input:-webkit-autofill:focus {
    -webkit-text-fill-color: #ffffff !important;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .bottom_text {
    font-size: 12px;
    position: absolute;
    bottom: 0;
    margin: 3px;
    color: #6c6e6f;
    left: 50%;
    transform: translate(-50%);
  }

  .el-carousel {
width: 62.5%;
  }
</style>
