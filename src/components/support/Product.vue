<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        {{ $t('documentation.dashboard') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('documentation.userSupport') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('documentation.productInfo') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0;">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <h1 style="margin: 0">
            {{ $t('documentation.productInfo') }}
          </h1>
        </div>
      </div>
      <!--      主体-->
      <div style="display: grid;grid-template-columns: repeat(auto-fill,700px);justify-content: start">
        <div style="display: flex;align-items: start;width: 700px;height: 345px;margin: 10px">
          <el-card
            shadow="hover"
            style="
width: 345px;
height: 345px;
opacity: 1;
background: #f5f7fa;
display: flex;
justify-content: center;
align-items: center"
          >
            <el-image src="https://oss.tankmiles.com/tankTrac.png" />
          </el-card>
          <table style="margin: 0 20px">
            <tr>
              <th colspan="2">
                TankTrac TTC 400
              </th>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.shellMaterial') }}
              </td><td style="width: 200px">
                PA 66 + PA6
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.size') }}
              </td><td style="width: 200px">
                {{ $t('documentation.lengthWidthHeight') }}：140×120×40 mm
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.grossWeight') }}
              </td><td style="width: 200px">
                600g
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.protectLevel') }}
              </td><td style="width: 200px">
                IP67
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.workingTemperature') }}
              </td><td style="width: 200px">
                -40°C-85°C
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.location') }}
              </td><td style="width: 200px">
                GLONASS{{ $t('documentation.locationInfo') }}、A-GPS
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.communication') }}
              </td><td style="width: 200px">
                3G, HSPA+、LTE-Cat M1
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.wirelessNetwork') }}
              </td><td style="width: 200px">
                IEEE 802.11
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.power') }}
              </td><td style="width: 200px">
                {{ $t('documentation.battery') }}
              </td>
            </tr>
            <el-button
              type="primary"
              class="downloadBtn"
              size="mini"
              @click="download"
            >
              Learn More
            </el-button>
          </table>
        </div>
        <div style="display: flex;align-items: start;width: 700px;height: 345px;margin: 10px">
          <el-card
            shadow="hover"
            style="
width: 345px;
height: 345px;
opacity: 1;
background: #f5f7fa;
display: flex;
justify-content: center;
align-items: center"
          >
            <el-image src="https://oss.tankmiles.com/smartFlak.png" />
          </el-card>
          <table style="margin: 0 20px">
            <tr>
              <th colspan="2">
                SMART FLANGE TRP 300
              </th>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.shellMaterial') }}
              </td><td style="width: 200px">
                SUS 304 / SUS 316 / SUS 316L
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.size') }}
              </td><td style="width: 200px">
                H: 80mm
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.protectLevel') }}
              </td><td style="width: 200px">
                IP67
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                {{ $t('documentation.workingTemperature') }}
              </td><td style="width: 200px">
                -40°C ≤ Tamb ≤ +80°C
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                [Level] Range
              </td><td style="width: 200px">
                0-3000mm
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                Beam angle
              </td><td style="width: 200px">
                6°
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                Accuracy
              </td><td style="width: 200px">
                ±3mm(0.1% F.S.)
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                [Pressure] Range (Optional)
              </td><td style="width: 200px">
                0-4bar / 0-10bar / 0-20bar
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                [Pressure] Accuracy (Optional)
              </td><td style="width: 200px">
                ±0.5% F.S.
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                Supply Voltage
              </td><td style="width: 200px">
                6~40VDC
              </td>
            </tr>
            <tr>
              <td style="width: 100px">
                Signal output
              </td><td style="width: 200px">
                RS-485
              </td>
            </tr>
            <tr>
              <el-button
                class="downloadBtn"
                size="mini"
                type="primary"
                @click="download1()"
              >
                Learn More
              </el-button>
            </tr>
          </table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Product',
  data () {
    return {
      tankTracLink: 'https://tankmiles-userimage.oss-cn-hangzhou.aliyuncs.com/tanktrac.pdf',
      smartFlangeLink: 'https://tankmiles-userimage.oss-cn-hangzhou.aliyuncs.com/smartflange.pdf',
      tableData: [
        {
          type: '外壳材质',
          value: 'PA 66 + PA6'
        },
        {
          type: '外观尺寸',
          value: '长/宽/高：140×120×40 mm'
        }
      ]
    }
  },
  methods: {
    download () {
      window.open(this.tankTracLink, '_blank')
    },
    download1 () {
      window.open(this.smartFlangeLink, '_blank')
    }
  }
}
</script>

<style scoped>
th{
  opacity: 1;
  font-size: 18px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Bold;
  font-weight: 700;
  text-align: left;
  color: #2f74eb;
  letter-spacing: 1px;
}
td{
  opacity: 1;
  font-size: 12px;
  font-family: Microsoft YaHei UI, Microsoft YaHei UI-Regular;
  font-weight: 400;
  text-align: left;
  color: #58647a;
}
.downloadBtn{
margin: 5px;
}
</style>
