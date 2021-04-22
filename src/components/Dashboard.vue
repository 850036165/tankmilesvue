<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom:0;"
    >
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        <i class="el-icon-s-home" />{{ $t('dashboard.mainPage') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('dashboard.dashboard') }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="dashboardText">
      {{ $t('dashboard.dashboard') }}
    </h1>
    <div class="dashboardCard">
      <el-card class="card1">
        <div class="card1Content">
          <div class="Text">
            <p class="cardText">
              {{ $t('dashboard.totalTanks') }}
            </p>
          </div>
          <div class="Number">
            <count-to
              class="cardNumber"
              :start-val="startVal"
              :end-val="totalTanks"
              :duration="1000"
              separator=","
            />
          </div>
          <div class="Image">
            <img
              src="../assets/Image/cardChart.svg"
              class="cardImage"
            >
          </div>
        </div>
      </el-card>
      <el-card class="card2">
        <div class="card2Content">
          <div class="Text">
            <p class="cardText">
              {{ $t('dashboard.availableTanks') }}
            </p>
          </div>
          <div class="Number">
            <count-to
              class="cardNumber"
              :start-val="startVal"
              :end-val="stayTanks"
              :duration="1000"
              separator=","
            />
          </div>
          <div class="Image">
            <img
              src="../assets/Image/cardChart.svg"
              class="cardImage"
            >
          </div>
        </div>
      </el-card>
      <el-card class="card3">
        <div class="card3Content">
          <div class="Text">
            <p class="cardText">
              {{ $t('dashboard.projectNumber') }}
            </p>
          </div>
          <div class="Number">
            <count-to
              class="cardNumber"
              :start-val="startVal"
              :end-val="projectNumbers"
              :duration="1000"
              separator=","
            />
          </div>
          <div class="Image">
            <img
              src="../assets/Image/cardChart3.svg"
              class="cardImage"
            >
          </div>
        </div>
      </el-card>
      <el-card class="card4">
        <div class="card4Content">
          <div class="Text">
            <p class="cardText">
              {{ $t('dashboard.alertNumber') }}
            </p>
          </div>
          <div class="Number">
            <count-to
              class="cardNumber"
              :start-val="startVal"
              :end-val="alertNumbers"
              :duration="1000"
              separator=","
            />
          </div>
          <div class="Image">
            <img
              src="../assets/Image/cardChart4.svg"
              class="cardImage"
            >
          </div>
        </div>
      </el-card>
    </div>
    <el-card
      class="mapCard"
      v-loading="loading1"
    >
      <div
        id="map"
        ref="mapDiv"
        :style="{height:mapHeight}"
        class="mapDiv"
      />
    </el-card>
  </div>
</template>

<script>
import { EventBus } from '@/assets/JS/eventBus'
import mapboxgl from 'mapbox-gl'
import countTo from 'vue-count-to'
import VXETable from 'vxe-table'

export default {
  name: 'DashBord',
  components: {
    countTo
  },
  data () {
    return {
      loading1: false,
      startVal: 0,
      totalTanks: 0,
      stayTanks: 0,
      projectNumbers: 0,
      alertNumbers: 0,
      deviceLocation: [120.79332682291667, 32.03734537760417]
    }
  },
  mounted () {
    const that = this
    this.getProfile()
    this.initMap()
    EventBus.$on('demo', function (isCollapse) {
      if (isCollapse === true) {
        that.loading1 = true
        setTimeout(function () {
          console.log(isCollapse)
          that.changeMap()
          that.loading1 = false
        }, 1000)
      }
    })
  },
  methods: {
    translatePosition (x, y) {
      const lon = Math.floor(x / 100) + (x % 100) / 60
      const lat = Math.floor(y / 100) + (y % 100) / 60
      console.log([lon, lat])
      return [lon, lat]
    },
    async  getProfile () {
      const data = await this.$http.post('/user/profile').catch(error => {
        VXETable.modal.message({ message: `${this.$t('dashboard.requestFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique' })
      }
      )
      this.profile = data.data.data
      this.totalTanks = this.profile.tank_all_count
      this.stayTanks = this.profile.tank_standby_count
      this.projectNumbers = this.profile.project_count
      this.alertNumbers = this.profile.alarm_count
      console.log(this.profile)
    },
    changeMap () {
      this.Mapbox.resize()
    },
    initMap () {
      const that = this
      this.loading1 = true
      mapboxgl.accessToken = 'pk.eyJ1IjoiemhlbmdnYW5nemh1IiwiYSI6ImNrZWFxMGRoOTAxYXcycnFqbjFkaXBmcHgifQ.C7gXGFGRWOuA3w5hwfuU1g' //
      this.Mapbox = new mapboxgl.Map({  // eslint-disable-line
        container: 'map', // container id 绑定的组件的id
        style: 'mapbox://styles/mapbox/streets-v11', // 地图样式
        center: this.deviceLocation,
        minZoom: 0,
        customAttribution: 'Tankmiles',
        zoom: 10, // starting zoom 地图初始的拉伸比例
        pitch: 0, // 地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
        bearing: 0, // 地图的初始方向，值是北的逆时针度数，默认是0，即是正北
        antialias: false // 抗锯齿，通过false关闭提升性能
      })
      this.Mapbox.addControl(new mapboxgl.FullscreenControl())
      this.Mapbox.addControl(new mapboxgl.NavigationControl())
      this.$http.post('/tank/all/latest/track ').then(response => {
        console.log(response)
        response.data.data.forEach(item => {
          const GPSPosition = this.translatePosition(item.lon, item.lat)
          console.log('GPSPosition', GPSPosition)
          // this.Mapbox.setCenter(GPSPosition)
          const el = document.createElement('div')
          el.innerHTML = `<div style="background-color: white"><P>${item.tankSn}</p></div>`
          const marker1 = new mapboxgl.Marker({element:el,anchor:'top'}) //eslint-disable-line
            .setLngLat(GPSPosition)
            .addTo(that.Mapbox)
          const marker = new mapboxgl.Marker({ color: '#2A68D3' })
            .setLngLat(GPSPosition)
            .addTo(that.Mapbox)
          // create the popup
          if (item.tankPressure < 0)item.tankPressure = 0
          if (item.tankLevel < 0)item.tankLevel = 0
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<p style="margin: 0">${this.$t('dashboard.tankNo')}：${item.tankSn}</p>
<p style="margin: 0">${this.$t('dashboard.time')}：${item.sampledAt}</p>
<p style="margin: 0">${this.$t('dashboard.temperature')}：${item.tankTemperature}℃</p>
<p style="margin: 0">${this.$t('dashboard.pressure')}：${item.tankPressure}Bar</p>
<p style="margin: 0">${this.$t('dashboard.tankLevel')}：${item.tankLevel}mm</p>`)
          marker.setPopup(popup)
        })
        if (response.data.data[0]) {
          const firstPoint = response.data.data[0]
          const flyPoint = this.translatePosition(firstPoint.lon, firstPoint.lat)
          this.Mapbox.flyTo({
            center: flyPoint,
            zoom: 3,
            curve: 1.42
          })
        }
      }).catch(error => {
        VXETable.modal.message({ message: `${this.$t('dashboard.requestFailed')}@${error}`, status: 'error', size: 'medium', id: 'unique' })
        that.loading1 = false
      }
      )
      this.Mapbox.on('load', function () {
        that.Mapbox.resize()
        that.loading1 = false
      })
    }
  },
  computed: {
    mapHeight: function () {
      return (window.innerHeight - 330) + 'px'
    }
  }
}
</script>

<style scoped lang="less">
/deep/:focus{
  outline: none;
}
/deep/ .el-loading-spinner .el-loading-text {
  color: white;
}

/deep/ .el-card__body {
  padding: 0;
}

.dashboardText {
  margin: 20px;
  font-size: 20px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold, serif;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}

.dashboardCard {
  user-select: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows:18vh;
  grid-column-gap: 32px;
}

.card1 {
  background: linear-gradient(-133deg, #46adff 3%, #4467ff 98%);
  border-radius: 6px;
}

.card2 {
  background: linear-gradient(-133deg, #50e1fe 3%, #2da9e8 98%);
  border-radius: 6px;
}

.card3 {
  background: linear-gradient(-133deg, #4ddf63 3%, #46cea3 98%);
  border-radius: 6px;
}

.card4 {
  background: linear-gradient(-133deg, #f8b61c 3%, #ff6c3a 98%);
  border-radius: 6px;
}

.Number {
  cursor: pointer;
  display: grid;
  grid-area: number;
  justify-content: end;
  align-items: center;
  padding-right: 10px;

}

.Text {
  display: grid;
  grid-area: text;
  justify-items: center;
  align-items: center;
}

.Image {
  display: grid;
  grid-area: image;
  justify-items: center;
  align-items: center;
}

.card1Content {
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(2, 9vh);
  grid-template-areas:
                      "text number"
                      "image number ";
  background-image: url("../assets/Image/line1.svg");
  background-size: cover;
}

.card2Content {
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(2, 9vh);
  grid-template-areas:
                      "text number"
                      "image number";
  background-image: url("../assets/Image/line2.svg");
  background-size: cover;
}

.card3Content {
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(2, 9vh);
  grid-template-areas:
                      "text number"
                      "image number";
  background-image: url("../assets/Image/line3.svg");
  background-size: cover;
}

.card4Content {
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: repeat(2, 9vh);
  grid-template-areas:
                      "text number"
                      "image number";
  background-image: url("../assets/Image/line1.svg");
  background-size: cover;
}

.cardNumber {
  font-size: 5vh;
  font-family: DIN, DIN-Black, sans-serif;
  font-weight: bolder;
  text-align: left;
  color: #ffffff;
  display: inline-block;
}

.cardText {
  font-size: 2vh;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Light, sans-serif;
  font-weight: bold;
  text-align: left;
  color: #ffffff;
  letter-spacing: 1px;
}

.cardImage {
  width: 80%;
  height: 100%;
}

.mapCard {
  outline: none;
  margin: 30px auto 0;
  width: 100%;
}

.mapDiv {
  width: 100%;
  margin: 0;
  height: 300px;
}

</style>
