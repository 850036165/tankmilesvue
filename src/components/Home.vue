<template>
  <el-container class="home_container">
    <!--    侧边栏-->
    <!--    <el-aside :width="isCollapse?'64px':'208px'">-->
    <el-aside :class="isCollapse?classa:classb">
      <!--侧边菜单-->
      <el-menu
        :collapse-transition="false"
        :collapse="isCollapse"
        background-color="#2d3463"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened=true
        :default-active="$route.path"
        router
        style="border-right-width: 0;"
        class="sideBarMenu">
        <div class="homeLogo" :style="isCollapse?'background: #2F74EB':'background: #242A4F'">
          <!--          logo图标-->
          <el-image
            v-show="!isCollapse"
            style="width: 121px;height: 55px"
            :src="logoUrl"
            fit="fit"
          ></el-image>
          <i v-show="isCollapse" class="el-icon-cpu" style="font-size: 35px;color: white"></i>
        </div>
        <!--        首页看板一级菜单-->
        <el-menu-item index="/dashboard">
          <i class="el-icon-odometer" style="font-size: 25px"></i>
          <span slot="title" style="padding: 0 20px 0 30px">首页看板</span>
        </el-menu-item>
        <!--        项目管理一级菜单-->
        <el-menu-item index="/projectmanage">
          <i class="el-icon-document" style="font-size: 25px"></i>
          <span slot="title" style="padding: 0 20px 0 30px">项目管理</span>
        </el-menu-item>
        <!--        罐箱列表一级菜单-->
        <el-menu-item index="/tanklist">
          <i class="el-icon-s-marketing" style="font-size: 25px"></i>
          <span slot="title" style="padding: 0 20px 0 30px">罐箱列表</span>
        </el-menu-item>
        <!--        监控设置一级菜单-->
        <el-submenu index="/w">
          <template slot="title">
            <i class="el-icon-alarm-clock" style="font-size: 25px"></i>
            <span style="padding: 0 20px 0 30px">监控设置</span>
          </template>
          <!--          监控二级菜单-->
          <el-menu-item index="/devicemanage">
            <i class="el-icon-notebook-2"></i><span style="padding: 0 20px 0 20px">监控列表</span>
          </el-menu-item>
          <el-menu-item index="/firmwaremanage">
            <i class="el-icon-location-information"></i><span style="padding: 0 20px 0 20px">关注点设置</span>
          </el-menu-item>
        </el-submenu>
        <!--        后台管理一级菜单-->
        <el-submenu index="/manage">
          <template slot="title">
            <i class="el-icon-set-up" style="font-size: 25px"></i>
            <span style="padding: 0 20px 0 30px">后台管理</span>
          </template>
          <!--          二级菜单-->
          <el-menu-item index="/devicemanage">
            <i class="el-icon-receiving"></i><span style="padding: 0 20px 0 20px">设备管理</span>
          </el-menu-item>
          <el-menu-item index="/firmwaremanage">
            <i class="el-icon-box"></i><span style="padding: 0 20px 0 20px">固件管理</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!--      版权信息-->
      <div class="homeBottomText" v-show="!isCollapse">
        <p style="margin-left: 10px">Copyright © 2019-2020 <br>Nantong CIMC Tank Equipment Co., Ltd.</p>
      </div>
    </el-aside>

    <el-container>
      <!--      页头-->
      <el-header class="home-header">
        <!--        顶部菜单栏-->
        <!--        收起按钮-->
        <i :class="isCollapse?'el-icon-s-unfold open1':'el-icon-s-unfold close1'" @click="foldMenu"
           style="font-size: 25px;color: #2d3463;padding: 10px;cursor:pointer;display: inline-block;margin-right: auto;"></i>
        <!--        顶部菜单1-->
        <el-menu
          :default-active="$route.path"
          router
          class="menuNaive"
          mode="horizontal"
          menu-trigger="hover"
          background-color="white"
          text-color="grey"
          active-text-color="#2d3463"
          :unique-opened=true
          style="-webkit-user-select: none;">
          <!-- 消息-->
          <el-menu-item index="/message">
            <i class="el-icon-message" style="color: #6c6e6f;font-size: 20px;margin: 0">
              <el-badge :hidden="false" is-dot style="position: absolute"/>
            </i>
          </el-menu-item>
          <!-- 基础设置-->
          <el-menu-item index="/basicsetting">
            <i class="el-icon-s-tools" style="color: #6c6e6f;font-size: 20px;margin: 0"></i>
          </el-menu-item>
        </el-menu>
        <!--                语言切换-->
        <el-dropdown @command="changeLang" trigger="click" size="medium" placement="bottom">
          <div class="lang_change">
            <p class="home_lang">{{currentLang}}</p>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="cn"
                              style="display: flex;justify-content: center;padding-left: 10px;-webkit-user-select: none;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-weibiaoti-"></use>
              </svg>
              <span style="font-size: 15px;width: 10px">CN</span></el-dropdown-item>
            <el-dropdown-item command="en"
                              style="display: flex;justify-content: center;padding-left: 10px;-webkit-user-select: none;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-meiguoqi"></use>
              </svg>
              <span style="font-size: 15px;width: 10px">EN</span></el-dropdown-item>
            <el-dropdown-item command="jp"
                              style="display: flex;justify-content: center;padding-left: 10px;-webkit-user-select: none;"
                              disabled>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jp"></use>
              </svg>
              <span style="font-size: 15px;width: 10px">JP</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--        个人信息菜单栏-->
        <el-menu
          :default-active="$route.path"
          @select="handleSelect"
          class="menuNaive"
          mode="horizontal"
          menu-trigger="hover"
          background-color="white"
          text-color="grey"
          active-text-color="#2d3463"
          :unique-opened=true
          style="-webkit-user-select: none;">
          <!--  分隔符 -->
          <div style="float:left;width: 1px;height: 40px; background: grey;margin: 0 10px 0 10px"></div>
          <!-- 头像及个人设置-->
          <el-submenu index="" style="border-bottom: none">
            <template slot="title">
              <div style="height: 100%;display: inline-block;margin-right: 10px">
                <p style="margin: 0;color: #2F74EB;font-weight: bolder;padding: 0; height: 10px;line-height: 50px">
                  Hello!</p>
                <span style="margin:0;padding: 0;line-height: 10px">{{username}}</span></div>
              <el-avatar size="large" :src="path" alt="fail"></el-avatar>
            </template>
            <el-menu-item index="/personalsetting">个人设置</el-menu-item>
            <el-menu-item index="about">关于</el-menu-item>
            <el-menu-item index="logout">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <!--      主体区域-->
      <el-main>
        <router-view></router-view>
        <!--        抽屉-->
        <el-drawer
          title="关于"
          :withHeader="false"
          :visible.sync="drawer"
          direction="rtl"
          size="20%">
        </el-drawer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // created () {
  //   this.getMenuList()
  // },
  name: 'Home',
  data () {
    return {
      username: '朱正刚',
      currentLang: 'CN',
      classa: 'classa',
      classb: 'classb',
      drawer: false,
      isCollapse: false,
      path: 'http://tankmiles-userimage.oss-cn-hangzhou.aliyuncs.com/默认头像.jpg',
      // path: require('../assets/Image/user.jpg'),
      logoUrl: require('../assets/Image/homelogo.png')
    }
  },
  // 渲染页面时判断当前语言
  mounted () {
    // 判断菜单的折叠状态
    this.isCollapse = localStorage.getItem('isCollapse')
    this.isCollapse = this.isCollapse === 'true'
    if (this.$i18n.locale === 'cn') {
      this.currentLang = 'CN'
    } else if (this.$i18n.locale === 'en') {
      this.currentLang = 'EN'
    } else {
      this.currentLang = 'JP'
    }
  },
  methods: {
    handleSelect (index) {
      switch (index) {
        case '/personalsetting':
          this.$router.push('/personalsetting')
          console.log(index)
          return
        case 'about':
          this.drawer = true
          console.log(index)
          return
        case 'logout':
          this.logout()
      }
    },
    // 登出功能
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 切换语言功能
    changeLang (index) {
      let menuLang = ''
      switch (index) {
        case 'cn':
          this.currentLang = 'CN'
          menuLang = 'cn'
          break
        case 'en':
          this.currentLang = 'EN'
          menuLang = 'en'
          break
        case 'jp':
          this.currentLang = 'JP'
          menuLang = 'jp'
      }
      this.$i18n.locale = menuLang
      localStorage.setItem('lang', menuLang)
    },
    // 收起菜单
    foldMenu () {
      this.isCollapse = !this.isCollapse
      localStorage.setItem('isCollapse', this.isCollapse)
    }
  }
}
</script>

<style lang="less">
.el-aside.classa {
  width: 64px !important;
  transition: width 110ms;
}

.el-aside.classb {
  width: 208px !important;
  transition: width 110ms;
}

.home_container {
  height: 100%;
  width: 100%;
}

.el-main {
  padding-bottom: 0 !important;
}

  .el-aside {
    overflow-x: hidden !important;
    background: #2d3463;
  }

  .home-header {
    background: #ffffff;
    padding: 0 !important;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1) !important;

    .lang_change {
      width: 69px;
      height: 60px;
      cursor: pointer;
      -webkit-user-select: none;

      .home_lang {
        font-family: "Microsoft YaHei", serif;
        font-size: 20px;
        color: #6c6e6f;
        // font-weight:lighter;
        margin: 0;
        padding: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .lang_change:hover {
      display: flex;
      width: 69px;
      height: 60px;
      background-color: rgba(204, 204, 204, 1);

    }
  }

  .sideBarMenu {
    -webkit-user-select: none;
    /*!*菜单关闭*!*/
    /*.el-submenu > .el-submenu__title .el-submenu__icon-arrow {*/
    /*  -webkit-transform: rotateZ(-90deg);*/
    /*  -ms-transform: rotate(-90deg);*/
    /*  transform: rotateZ(-90deg);*/
    /*}*/

    /*!*菜单展开*!*/
    /*.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {*/
    /*  -webkit-transform: rotateZ(0deg);*/
    /*  -ms-transform: rotate(0deg);*/
    /*  transform: rotateZ(0deg);*/
    /*}*/
  }

  .homeLogo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-menu--collapse .el-menu .el-submenu, .el-menu--popup {
    min-width: 85px !important;
  }

  .menuNaive {
    border-bottom: none !important;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1)
  }

  .homeBottomText {
    background-color: #0000005e;
    width: 207px;
    -webkit-user-select: none;
    font-weight: lighter;
    font-size: 10px;
    position: absolute;
    bottom: 0;
    margin: 0 0 10px 0;
    color: #ffffff;
    font-family: "Helvetica Neue", sans-serif;
  }

  .open1 {
    transition: all 0.5s;
  }

  .close1 {
    transform: rotate(-180deg);
    transition: all 0.5s;
  }
</style>
