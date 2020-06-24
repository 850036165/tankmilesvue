<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/Image/Login_logo.png" alt="未加载"/>
        <p class="text_center">欢迎使用罐程系统</p>
      </div>
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" class="form_group" label-position="top"
               hide-required-asterisk>
        <!--<label>用户名</label>-->
        <el-form-item label="用户名:" class="form_input" prop="username"><!--用户名-->
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!--<label>密码</label>-->
        <el-form-item label="密码:" class="form_input" prop="password"><!--密码-->
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-checkbox class="form_checkbox">记住密码</el-checkbox><!--记住密码-->
        <el-form-item class="form_button"><!--按钮-->
          <el-button type="primary" icon="el-icon-s-promotion" class="form_login" @click="login()">登录</el-button>
          <el-button type="info" icon="el-icon-refresh-right" class="form_login" @click="resetForm()">重置</el-button>
        </el-form-item>
        <div class="form_link1">
          <el-link type="primary" class="el-icon-lock" :underline="false">忘记密码</el-link>
        </div>
        <div class="form_link2">
          <el-link type="success" class="el-icon-message" :underline="false">联系我们</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '12112',
        password: '12121'
      },
      loginFormRules: {
        // 验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    resetForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$notify({
            title: '登录失败！',
            message: `${res.meta.msg}!`,
            type: 'error',
            center: 'true'
          })
        } else {
          this.$notify({
            title: '登录成功！',
            message: '欢迎使用罐程平台',
            type: 'success'
          })
        }
      })
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
    width: 400px;
    height: 450px;
    background: rgba(255, 255, 255);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .login_logo {
      width: 170px;
      height: 50px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 50%);
      margin-bottom: 0;

      img {
        width: 100%;
        height: 100%;

      }
    }

    .form_group {
      width: 350px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -35%);
      margin-bottom: 0;
      box-sizing: border-box;
    }
  }

  .text_center {
    text-align: center;
    font-size: 17px;
    color: #5c5b5b;
    margin: 15px;
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
    display: flex;
    justify-content: center;
  }

  .form_login {
    width: 120px;
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
</style>
