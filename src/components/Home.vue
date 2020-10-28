<template>
  <el-container class="home_container">
    <!--    侧边栏-->
    <!--        <el-aside :width="isCollapse?'64px':'208px'">-->
    <el-aside :class="isCollapse?classa:classb">
      <!--侧边菜单-->
      <el-menu
        :collapse-transition="false"
        :collapse="isCollapse"
        background-color="#2d3463"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        :default-active="$route.path"
        router
        style="border-right-width: 0;"
        class="sideBarMenu"
      >
        <div
          class="homeLogo"
          :style="isCollapse?'background: #2F74EB':'background: #242A4F'"
        >
          <!--          logo图标-->
          <el-image
            v-show="!isCollapse"
            style="width: 121px;height: 55px"
            :src="logoUrl"
            fit="fit"
          />
          <i
            v-show="isCollapse"
            class="el-icon-cpu"
            style="font-size: 35px;color: white"
          />
        </div>
        <!--        首页看板一级菜单-->
        <el-menu-item index="/dashboard">
          <i
            class="el-icon-odometer"
            style="font-size: 25px"
          />
          <span
            slot="title"
            style="padding: 0 20px 0 30px"
          >首页看板</span>
        </el-menu-item>
        <!--          资产管理一级菜单-->
        <el-submenu
          index="/property"
        >
          <template slot="title">
            <i
              class="el-icon-monitor"
              style="font-size: 25px"
            />
            <span style="padding: 0 20px 0 30px">资产管理</span>
          </template>
          <!--          资产管理二级菜单-->
          <!--        罐箱列表一级菜单-->
          <el-menu-item index="/tank">
            <i
              class="el-icon-receiving"
              style="font-size: 25px"
            />
            <span
              slot="title"
              style="padding: 0 20px 0 30px"
            >罐箱列表</span>
          </el-menu-item>
          <!--        项目管理一级菜单-->
          <el-menu-item index="/project">
            <i
              class="el-icon-document"
              style="font-size: 25px"
            />
            <span
              slot="title"
              style="padding: 0 20px 0 30px"
            >项目管理</span>
          </el-menu-item>
          <!--        账户管理一级菜单-->
          <el-menu-item index="/usermanage">
            <i
              class="el-icon-user"
              style="font-size: 25px"
            />
            <span
              slot="title"
              style="padding: 0 20px 0 30px"
            >账户管理</span>
          </el-menu-item>
        </el-submenu>
        <!--        监控设置一级菜单-->
        <el-submenu
          index="/monitor"
        >
          <template slot="title">
            <i
              class="el-icon-alarm-clock"
              style="font-size: 25px"
            />
            <span style="padding: 0 20px 0 30px">监控设置</span>
          </template>
          <!--          监控二级菜单-->
          <el-menu-item index="/monitoring">
            <i class="el-icon-notebook-2" /><span style="padding: 0 20px 0 20px">监控列表</span>
          </el-menu-item>
          <el-menu-item index="/poi">
            <i class="el-icon-location-information" /><span style="padding: 0 20px 0 20px">关注点设置</span>
          </el-menu-item>
        </el-submenu>
<!--        模型管理一级菜单-->
        <el-submenu
          index="/model"
        >
          <template slot="title">
            <i
              class="el-icon-files"
              style="font-size: 25px"
            />
            <span style="padding: 0 20px 0 30px">模型管理</span>
          </template>
          <!--          模型管理二级菜单-->
          <el-menu-item index="/tankmodel">
            <i class="el-icon-truck" /><span style="padding: 0 20px 0 20px">罐箱模型</span>
          </el-menu-item>
          <el-menu-item index="/mediamodel">
            <i class="el-icon-goblet-full" /><span style="padding: 0 20px 0 20px">介质模型</span>
          </el-menu-item>
          <el-menu-item index="/permissionmodel">
            <i class="el-icon-thumb" /><span style="padding: 0 20px 0 20px">权限模型</span>
          </el-menu-item>
        </el-submenu>
<!--        用户支持一级菜单-->
        <el-submenu
          index="/support"
        >
          <template slot="title">
            <i
              class="el-icon-service"
              style="font-size: 25px"
            />
            <span style="padding: 0 20px 0 30px">用户支持</span>
          </template>
          <!--          用户支持二级菜单-->
          <el-menu-item index="/product">
            <i class="el-icon-document-copy" /><span style="padding: 0 20px 0 20px">产品资料</span>
          </el-menu-item>
          <el-menu-item index="/contact">
            <i class="el-icon-message" /><span style="padding: 0 20px 0 20px">联系我们</span>
          </el-menu-item>
        </el-submenu>
        <!--        后台管理一级菜单-->
        <el-submenu index="/manage">
          <template slot="title">
            <i
              class="el-icon-set-up"
              style="font-size: 25px"
            />
            <span style="padding: 0 20px 0 30px">后台管理</span>
          </template>
          <!--          二级菜单-->
          <el-menu-item index="/device">
            <i class="el-icon-mobile-phone" /><span style="padding: 0 20px 0 20px">设备管理</span>
          </el-menu-item>
          <el-menu-item index="/firmware">
            <i class="el-icon-box" /><span style="padding: 0 20px 0 20px">固件管理</span>
          </el-menu-item>
          <el-menu-item index="/bill">
            <i class="el-icon-wallet" /><span style="padding: 0 20px 0 20px">账单管理</span>
          </el-menu-item>
          <el-menu-item index="/record">
            <i class="el-icon-mouse" /><span style="padding: 0 20px 0 20px">登录统计</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!--      版权信息-->
      <div
        class="homeBottomText hidden-md-and-down"
        v-show="!isCollapse"
      >
        <p style="margin-left: 10px">
          Copyright © 2019-2020 <br>Nantong CIMC Tank Equipment Co., Ltd.
        </p>
      </div>
    </el-aside>

    <el-container>
      <!--      页头-->
      <el-header class="home-header">
        <!--        顶部菜单栏-->
        <!--        收起按钮-->
        <i
          :class="[isCollapse?'el-icon-s-unfold open1':'el-icon-s-unfold close1','hidden-md-and-down']"
          @click="foldMenu"
          style="font-size: 25px;color: #2d3463;padding: 10px;cursor:pointer;display: inline-block;margin-right: auto;"
        />
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
          :unique-opened="true"
          style="-webkit-user-select: none;"
        >
          <!-- 消息-->
          <el-menu-item index="/message">
            <i
              class="el-icon-message"
              style="color: #6c6e6f;font-size: 20px;margin: 0"
            >
              <el-badge
                :hidden="false"
                is-dot
                style="position: absolute"
              />
            </i>
          </el-menu-item>
          <!-- 基础设置-->
          <el-menu-item index="/basicsetting">
            <i
              class="el-icon-s-tools"
              style="color: #6c6e6f;font-size: 20px;margin: 0"
            />
          </el-menu-item>
        </el-menu>
        <!--                语言切换-->
        <el-dropdown
          @command="changeLang"
          trigger="click"
          size="medium"
          placement="bottom"
        >
          <div class="lang_change">
            <p class="home_lang">
              {{ currentLang }}
            </p>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="zh"
              style="display: flex;justify-content: center;padding-left: 10px;-webkit-user-select: none;"
            >
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-weibiaoti-" />
              </svg>
              <span style="font-size: 15px;width: 10px">CN</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="en"
              style="display: flex;justify-content: center;padding-left: 10px;-webkit-user-select: none;"
            >
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-meiguoqi" />
              </svg>
              <span style="font-size: 15px;width: 10px">EN</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="jp"
              style="display: flex;justify-content: center;padding-left: 10px;-webkit-user-select: none;"
              disabled
            >
              <svg
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-jp" />
              </svg>
              <span style="font-size: 15px;width: 10px">JP</span>
            </el-dropdown-item>
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
          :unique-opened="true"
          style="-webkit-user-select: none;"
        >
          <!--  分隔符 -->
          <div style="float:left;width: 1px;height: 40px; background: grey;margin: 0 10px 0 10px" />
          <!-- 头像及个人设置-->
          <el-submenu
            index=""
            style="border-bottom: none"
          >
            <template slot="title">
              <div style="height: 100%;display: inline-block;margin-right: 10px">
                <p style="margin: 0;color: #2F74EB;font-weight: bolder;padding: 0; height: 10px;line-height: 50px">
                  Hello!
                </p>
                <span style="margin:0;padding: 0;line-height: 10px">{{ username }}</span>
              </div>
              <el-avatar
                size="large"
                :src="path"
                alt="fail"
              />
            </template>
            <el-menu-item index="/personalsetting">
              个人设置
            </el-menu-item>
            <el-menu-item index="about">
              关于
            </el-menu-item>
            <el-menu-item index="logout">
              退出登录
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <!--      主体区域-->
      <el-main>
        <router-view />
        <!--        抽屉-->
        <el-drawer
          title="关于"
          :with-header="false"
          :visible.sync="drawer"
          direction="rtl"
          size="20%"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {EventBus} from '@/assets/JS/eventBus'

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
    if (this.$i18n.locale === 'zh') {
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
        case 'zh':
          this.currentLang = 'CN'
          menuLang = 'zh'
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
      EventBus.$emit('demo', this.isCollapse)
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
