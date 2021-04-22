<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('contactUs.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('contactUs.userSupport') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('contactUs.contactUs') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="dashboardText">
      {{ $t('contactUs.contactUs') }}
    </h1>
    <!--      主体-->
    <el-card
      id="map"
      style="width: 100%;height: 700px;margin-bottom: 10px"
    >
      <el-card style="position: absolute;top: 10px;right:10px;width: 400px;height:680px;z-index: 999;border: none">
        <div style="width: 100%;height: 200px;box-shadow: 0 3px 6px 0 rgba(0,0,0,0.16);border-radius: 5px;margin-bottom: 50px">
          <div style="width: 100%;height: 100px;background-color: #2F74EB;display: grid;grid-template-columns: 100px auto;justify-content:start">
            <img
              src="../../../src/assets/Image/007-2@2x.png"
              alt=""
              style="width: 80px;height: 80px;margin: 10px"
            ><div>
              <p class="companyName">
                {{ $t('contactUs.CIMCname') }}
              </p>
              <p class="companyAddress">
                {{ $t('contactUs.address') }}
              </p>
              <p class="companyAddress">
                {{ $t('contactUs.postcode') }}:226003
              </p>
            </div>
          </div>
          <div style="width: 100%;height: 100px;background-color: #FFFFFF;display: grid;grid-template-columns: 100px auto;justify-content:start">
            <div style="width: 100px;height: 100px" />
            <div>
              <p class="companyPhone">
                {{ $t('contactUs.phone') }}:86-513-85066022
              </p>
              <p class="companyPhone">
                {{ $t('contactUs.fax') }}:86-513-85565155
              </p>
              <p class="companyPhone">
                {{ $t('contactUs.email') }}:tankmiles@cimc.com
              </p>
              <p class="companyContact">
                {{ $t('contactUs.contactInfo') }}
              </p>
            </div>
          </div>
        </div>
        <div style="width: 100%;height:500px;overflow: auto">
          <p class="keepInTouch">
            {{ $t('contactUs.keepTouch') }}
          </p>
          <el-form
            :hide-required-asterisk="true"
            style="margin-left: 20px;width: 90%"
            ref="systemMessage"
            :model="systemMessage"
            :rules="GroupForm"
            size="mini"
            label-width="100px"
            label-position="top"
          >
            <el-form-item
              :label="$t('contactUs.title')"
              prop="title"
            >
              <el-input
                v-model="systemMessage.title"
                :placeholder="$t('contactUs.inputTitle')"
                clearable
                :style="{width: '100%'}"
              />
            </el-form-item>
            <el-form-item
              :label="$t('contactUs.contactWay')"
              prop="email"
            >
              <el-input
                v-model="systemMessage.email"
                :placeholder="$t('contactUs.inputContactWay')"
                clearable
                prefix-icon="el-icon-message"
                :style="{width: '100%'}"
              />
            </el-form-item>
            <el-form-item
              :label="$t('contactUs.message')"
              prop="content"
            >
              <el-input
                show-word-limit
                :maxlength="100"
                v-model="systemMessage.content"
                type="textarea"
                :placeholder="$t('contactUs.messageDetail')"
                :autosize="{minRows: 4, maxRows: 4}"
                :style="{width: '100%'}"
              />
            </el-form-item>
            <el-form-item size="large">
              <el-button
                size="mini"
                type="primary"
                @click="submitLetter"
              >
                {{ $t('contactUs.submit') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import VXETable from 'vxe-table'
export default {
  name: 'Contact',
  data () {
    return {
      systemMessage: {
        title: undefined,
        email: undefined,
        content: ''
      },
      GroupForm: {
        title: [{
          required: true,
          message: `${this.$t('contactUs.inputTitle')}`,
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: `${this.$t('contactUs.inputContactWay')}`,
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: `${this.$t('contactUs.messageDetail')}`,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitLetter () {
      this.$refs.systemMessage.validate(valid => {
        if (!valid) return
        this.$http.post('/system/message/create', this.systemMessage).then(response => {
          console.log(response.data.code)
          if (response.data.code === 0) {
            VXETable.modal.message({ message: `${this.$t('contactUs.receive')}`, status: 'success', id: '1' })
            this.$refs.systemMessage.resetFields()
          } else {
            VXETable.modal.message({ message: `${this.$t('contactUs.submitFailed')}@${response.data.message}`, status: 'warning', id: '1' })
          }
        }).catch(error => {
          VXETable.modal.message({ message: `${this.$t('contactUs.submitFailed')}@${error}`, status: 'warning' })
        })
      })
    },
    createMap () {
      mapboxgl.accessToken = 'pk.eyJ1IjoiemhlbmdnYW5nemh1IiwiYSI6ImNrZWFxMGRoOTAxYXcycnFqbjFkaXBmcHgifQ.C7gXGFGRWOuA3w5hwfuU1g'

      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [120.99332682291667, 32.03134538760417],
        zoom: 10,
        interactive: false
      })

      var size = 150

      var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: function () {
          var canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },

        render: function () {
          var duration = 2000
          var t = (performance.now() % duration) / duration

          var radius = size / 2 * 0.3
          var outerRadius = size / 2 * 0.7 * t + radius
          var context = this.context

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(42,104,211,' + (1 - t) + ')'
          context.fill()

          // draw inner circle
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
          context.fillStyle = '#2A68D3'
          context.strokeStyle = 'white'
          context.lineWidth = 2 + 4 * (1 - t)
          context.fill()
          context.stroke()

          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data

          // keep the map repainting
          map.triggerRepaint()

          // return `true` to let the map know that the image was updated
          return true
        }
      }

      map.on('load', function () {
        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })

        map.addLayer({
          id: 'points',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [120.79306640625, 32.037296549479166]
                }
              }]
            }
          },
          layout: {
            'icon-image': 'pulsing-dot'
          }
        })
      })
    }
  },
  mounted () {
    this.createMap()
  }
}
</script>

<style scoped>
/deep/ .el-card__body {
  padding: 0;
}
.companyName{
  text-align: start;
  margin-bottom: 0;
  opacity: 1;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}
.companyAddress{
  margin: 0;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  line-height: 24px;
}
.companyPhone{
  margin: 0;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #58647a;
  line-height: 24px;
}
.companyContact{
  margin: 0;
  opacity: 1;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  color: #2f74eb;
  letter-spacing: 1px;
}
.dashboardText {
  margin: 20px;
  font-size: 20px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold, serif;
  font-weight: 700;
  text-align: left;
  color: #58647a;
}
.keepInTouch{
  margin-left: 20px;
  opacity: 1;
  font-size: 24px;
  font-weight: 700;
  text-align: left;
  color: #2f74eb;
  letter-spacing: 1px;
}
</style>
