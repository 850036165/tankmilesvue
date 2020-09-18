<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:0;">
      <el-breadcrumb-item :to="{ path: '/welcome' }"><i class="el-icon-s-home"></i>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/dashboard' }">看板</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="dashboardText">首页看板</h1>
    <div class="dashboardCard">
      <el-card class="card1">
        <div class="card1Content">
          <div class="Text">
            <p class="cardText">总箱量</p>
          </div>
          <div class="Number">
            <count-to class="cardNumber" :start-val='startVal' :end-val='totalTanks' :duration='4000'
                      separator=','></count-to>
          </div>
          <div class="Image">
            <img src="../assets/Image/cardChart.svg" class="cardImage">
          </div>
        </div>
      </el-card>
      <el-card class="card2">
        <div class="card2Content">
          <div class="Text">
            <p class="cardText">待机量</p>
          </div>
          <div class="Number">
            <count-to class="cardNumber" :start-val='startVal' :end-val='stayTanks' :duration='4000'
                      separator=','></count-to>
          </div>
          <div class="Image">
            <img src="../assets/Image/cardChart.svg" class="cardImage">
          </div>
        </div>
      </el-card>
      <el-card class="card3">
        <div class="card3Content">
          <div class="Text">
            <p class="cardText">项目数量</p>
          </div>
          <div class="Number">
            <count-to class="cardNumber" :start-val='startVal' :end-val='projectNumbers' :duration='3000'
                      separator=','></count-to>
          </div>
          <div class="Image">
            <img src="../assets/Image/cardChart3.svg" class="cardImage">
          </div>
        </div>
      </el-card>
      <el-card class="card4">
        <div class="card4Content">
          <div class="Text">
            <p class="cardText">报警数量</p>
          </div>
          <div class="Number">
            <count-to class="cardNumber" :start-val='startVal' :end-val='alertNumbers' :duration='2000'
                      separator=','></count-to>
          </div>
          <div class="Image">
            <img src="../assets/Image/cardChart4.svg" class="cardImage">
          </div>
        </div>
      </el-card>
    </div>
    <el-card
      class="mapCard"
      v-loading="loading1"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(1, 1, 1, 0.9)">
      <p id="map" ref='mapDiv' class="mapDiv"></p>
    </el-card>
  </div>
</template>

<script>
import {EventBus} from '@/assets/JS/eventBus'
import mapboxgl from 'mapbox-gl'
import countTo from 'vue-count-to'

export default {
  name: 'Dashbord',
  components: {
    countTo
  },
  data() {
    return {
      loading1: false,
      startVal: 0,
      totalTanks: 9999,
      stayTanks: 488,
      projectNumbers: 202,
      alertNumbers: 50,
      deviceLocation: [-77.034084, 38.909671],
      items: 0,
      stores: []
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    const that = this
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
    initData() {
      this.stores = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.034084142948, 38.909671288923]
            },
            properties: {
              phoneFormatted: '(202) 234-7336',
              phone: '2022347336',
              address: '1471 P St NW',
              city: 'Washington DC',
              country: 'United States',
              crossStreet: 'at 15th St NW',
              postalCode: '20005',
              state: 'D.C.'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.049766, 38.900772]
            },
            properties: {
              phoneFormatted: '(202) 507-8357',
              phone: '2025078357',
              address: '2221 I St NW',
              city: 'Washington DC',
              country: 'United States',
              crossStreet: 'at 22nd St NW',
              postalCode: '20037',
              state: 'D.C.'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.043929, 38.910525]
            },
            properties: {
              phoneFormatted: '(202) 387-9338',
              phone: '2023879338',
              address: '1512 Connecticut Ave NW',
              city: 'Washington DC',
              country: 'United States',
              crossStreet: 'at Dupont Circle',
              postalCode: '20036',
              state: 'D.C.'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.0672, 38.90516896]
            },
            properties: {
              phoneFormatted: '(202) 337-9338',
              phone: '2023379338',
              address: '3333 M St NW',
              city: 'Washington DC',
              country: 'United States',
              crossStreet: 'at 34th St NW',
              postalCode: '20007',
              state: 'D.C.'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.002583742142, 38.887041080933]
            },
            properties: {
              phoneFormatted: '(202) 547-9338',
              phone: '2025479338',
              address: '221 Pennsylvania Ave SE',
              city: 'Washington DC',
              country: 'United States',
              crossStreet: 'btwn 2nd & 3rd Sts. SE',
              postalCode: '20003',
              state: 'D.C.'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-76.933492720127, 38.99225245786]
            },
            properties: {
              address: '8204 Baltimore Ave',
              city: 'College Park',
              country: 'United States',
              postalCode: '20740',
              state: 'MD'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.097083330154, 38.980979]
            },
            properties: {
              phoneFormatted: '(301) 654-7336',
              phone: '3016547336',
              address: '4831 Bethesda Ave',
              cc: 'US',
              city: 'Bethesda',
              country: 'United States',
              postalCode: '20814',
              state: 'MD'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.359425054188, 38.958058116661]
            },
            properties: {
              phoneFormatted: '(571) 203-0082',
              phone: '5712030082',
              address: '11935 Democracy Dr',
              city: 'Reston',
              country: 'United States',
              crossStreet: 'btw Explorer & Library',
              postalCode: '20190',
              state: 'VA'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.10853099823, 38.880100922392]
            },
            properties: {
              phoneFormatted: '(703) 522-2016',
              phone: '7035222016',
              address: '4075 Wilson Blvd',
              city: 'Arlington',
              country: 'United States',
              crossStreet: 'at N Randolph St.',
              postalCode: '22203',
              state: 'VA'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-75.28784, 40.008008]
            },
            properties: {
              phoneFormatted: '(610) 642-9400',
              phone: '6106429400',
              address: '68 Coulter Ave',
              city: 'Ardmore',
              country: 'United States',
              postalCode: '19003',
              state: 'PA'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-75.20121216774, 39.954030175164]
            },
            properties: {
              phoneFormatted: '(215) 386-1365',
              phone: '2153861365',
              address: '3925 Walnut St',
              city: 'Philadelphia',
              country: 'United States',
              postalCode: '19104',
              state: 'PA'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.043959498405, 38.903883387232]
            },
            properties: {
              phoneFormatted: '(202) 331-3355',
              phone: '2023313355',
              address: '1901 L St. NW',
              city: 'Washington DC',
              country: 'United States',
              crossStreet: 'at 19th St',
              postalCode: '20036',
              state: 'D.C.'
            }
          }
        ]
      }
    },
    changeMap() {
      this.Mapbox.resize()
    },
    initMap() {
      const that = this
      this.loading1 = true
      mapboxgl.accessToken = 'pk.eyJ1IjoiemhlbmdnYW5nemh1IiwiYSI6ImNrZWFxMGRoOTAxYXcycnFqbjFkaXBmcHgifQ.C7gXGFGRWOuA3w5hwfuU1g' // 这里请换成自己的token
      this.Mapbox = new mapboxgl.Map({  // eslint-disable-line
        container: 'map', // container id 绑定的组件的id
        style: 'mapbox://styles/mapbox/streets-v11', // 地图样式
        center: this.deviceLocation,
        minZoom: 3,
        customAttribution: 'Tankmiles',
        zoom: 8, // starting zoom 地图初始的拉伸比例
        pitch: 60, // 地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
        bearing: 20, // 地图的初始方向，值是北的逆时针度数，默认是0，即是正北
        antialias: false // 抗锯齿，通过false关闭提升性能
      })
      const marker = new mapboxgl.Marker() // eslint-disable-line
        .setLngLat(this.deviceLocation)
        .addTo(this.Mapbox)
      this.Mapbox.addControl(new mapboxgl.FullscreenControl())
      this.Mapbox.addControl(new mapboxgl.NavigationControl())
      this.Mapbox.on('load', function () {
        // 向地图中添加数据图层
        that.Mapbox.addLayer({
          id: 'locations',
          type: 'symbol',
          // 添加包含有坐标和附加信息的GeoJSON数据源
          source: {
            type: 'geojson',
            data: that.stores
          },
          layout: {
            'icon-image': 'rocket-15',
            'icon-allow-overlap': true
          }
        })
        that.Mapbox.resize()
        that.loading1 = false
      })
    }
  }
}
</script>

<style scoped lang="less">
@import url('https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css');

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
  grid-column-gap: 30px;
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
  width: 97%;
}

.mapDiv {
  width: 100%;
  margin: 0;
  height: 300px;
}

/deep/ .mapboxgl-canvas {
  outline: none !important;
}
</style>
