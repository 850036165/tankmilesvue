<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:0;">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tanklist' }">罐箱列表</el-breadcrumb-item>
      <el-breadcrumb-item>TCDU 100007-9{{ this.$route.query.id }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h2 style="display: inline-block">罐箱详情</h2>
    <h4 style="display: inline-block;margin-left: 10px">TCDU 100007-9{{ this.$route.query.id }}</h4>
    <el-tabs value="first">
      <el-tab-pane label="数据监控" name="first">
        <!--        设备总览栏-->
        <el-card style="margin:5px">
          <h3 style="margin-top: 0;margin-bottom: 10px;font-weight:normal">监控信息总览</h3>
          <div class="dataCard">
            <div class="cardItem1">
              <span><i class="el-icon-connection cardIcon"></i>设备号</span>
              <span>7172712</span>
              <span><i class="el-icon-mobile cardIcon"></i>设备型号</span>
              <span>tanktrac</span>
              <span><i class="el-icon-set-up cardIcon"></i>固件版本</span>
              <span>v1.0</span>
              <span><i class="el-icon-time cardIcon"></i>更新日期</span>
              <span>20200819</span>
              <span><i class="el-icon-time cardIcon"></i>激活日期</span>
              <span>20200819</span>
            </div>
            <div class="cardItem2">
              <span><i class="el-icon-cpu cardIcon"></i>电池电量</span>
              <span style="font-weight: bold">20<span style="padding-left: 2px;font-weight: normal">%</span></span>
              <span><i class="el-icon-cpu cardIcon"></i>电池型号</span>
              <span>SL100+SP100</span>
              <span><i class="el-icon-cpu cardIcon"></i>温度传感器</span>
              <span>PT-1000*2</span>
              <span><i class="el-icon-cpu cardIcon"></i>压力传感器</span>
              <span>CS80-2C40000</span>
              <span><i class="el-icon-cpu cardIcon"></i>雷达液位计</span>
              <span>Radar-1000</span>
            </div>
            <div class="cardItem3">
              <span><i class="el-icon-monitor cardIcon"></i>时间</span>
              <span style="font-weight: bold">2020.08.25 16:01</span>
              <i class="el-icon-alarm-clock"></i>
              <span><i class="el-icon-odometer cardIcon"></i>温度</span>
              <span style="font-weight: bold">30<span style="padding-left: 2px;font-weight: normal">F°</span></span>
              <i class="el-icon-alarm-clock"></i>
              <span><i class="el-icon-stopwatch cardIcon"></i>压力</span>
              <span style="font-weight: bold">20<span style="padding-left: 2px;font-weight: normal">Bar</span></span>
              <i class="el-icon-alarm-clock"></i>
              <span><i class="el-icon-goblet-full cardIcon"></i>液位</span>
              <span style="font-weight: bold">31<span style="padding-left: 2px;font-weight: normal">mm</span></span>
              <i class="el-icon-alarm-clock"></i>
              <span><i class="el-icon-map-location cardIcon"></i>位置</span>
              <span style="font-size: 13px">CN, 杨溪桥乡, 桃源县,G56<span></span></span>
              <i class="el-icon-alarm-clock"></i>
            </div>
          </div>
        </el-card>
        <!--        设备地图-->
        <el-card style="margin:10px 5px">1</el-card>
      </el-tab-pane>
      <el-tab-pane label="数据图表" name="second">
        <el-card></el-card>
      </el-tab-pane>
      <el-tab-pane label="历史数据" name="third">
        <el-card></el-card>
      </el-tab-pane>
      <el-tab-pane label="罐箱资料" name="fourth">
        <el-card></el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'TankDetail'
}
</script>

<style scoped>
.dataCard {
  font: 15px Tahoma, Helvetica, Arial, '微软雅黑', sans-serif;
  display: grid;
  grid-template-columns: 0.8fr 0.8fr 1fr;
  grid-template-rows: 160px
}

.cardItem1 {
  border-right: 2px solid #EBEEF5;
  display: grid;
  grid-template-columns:repeat(2, 1fr);
  grid-template-rows:repeat(5, 1fr);
  justify-items: start;
  align-items: center;
}

.cardItem2 {
  padding-left: 10px;
  border-right: 2px solid #EBEEF5;
  display: grid;
  grid-template-columns:repeat(2, 1fr);
  grid-template-rows:repeat(5, 1fr);
  justify-items: start;
  align-items: center;
}

.cardItem3 {
  padding-left: 10px;
  display: grid;
  grid-template-columns:1fr 2fr 20px;
  grid-template-rows:repeat(5, 1fr);
  justify-items: start;
  align-items: center;
}

.cardIcon {
  margin-right: 5px;
  font-size: 18px;
  color: #006af1;
}
</style>
