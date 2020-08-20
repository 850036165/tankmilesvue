<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tanklist' }">罐箱列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加罐箱</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <h1 style="margin: 0;display: inline-block">添加罐箱</h1>
        <el-button style="float: right;" size="mini">返回</el-button>
        <el-button style="float: right;margin: 0 5px" type="primary" size="mini">保存</el-button>
      </div>
      <el-tabs value="first">
        <el-tab-pane label="基础信息" name="first">
          <!--          顶部区域-->
          <div class="addTanksTop">
            <el-row :gutter="0">
              <el-form ref="addTankForm" :model="addTankForm" :rules="rules" label-width="100px">
                <el-col :span="10" :offset="2">
                  <el-form-item label="箱号:" prop="tankNumber">
                    <el-input v-model="addTankForm.tankNumber" placeholder="请输入箱号" clearable
                              :maxlength="10" prefix-icon='el-icon-document-copy' style="width: 200px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="认证船级社:" prop="ClassificationName">
                    <el-input v-model="addTankForm.ClassificationName" placeholder="请输入认证船级社" clearable
                              :maxlength="10" style="width: 200px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                  <el-form-item label="日期选择:" prop="buildDate">
                    <el-date-picker v-model="addTankForm.buildDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                    style="width: 200px" placeholder="请选择日期选择" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="介质:" prop="tankCargo">
                    <el-select v-model="addTankForm.tankCargo" placeholder="请选择介质" filterable clearable
                               style="width: 200px">
                      <el-option v-for="(item, index) in tankCargoOptions" :key="index" :label="item.label"
                                 :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                  <el-form-item label="关联设备:" prop="linkedDevices">
                    <el-select v-model="addTankForm.linkedDevices" placeholder="请选择关联设备" filterable clearable
                               style="width: 200px">
                      <el-option v-for="(item, index) in linkedDevicesOptions" :key="index" :label="item.label"
                                 :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注:" prop="tankText">
                    <el-input v-model="addTankForm.tankText" placeholder="请输入备注" :maxlength="20" show-word-limit
                              clearable
                              prefix-icon='el-icon-document-copy' style="width: 200px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="2">
                  <el-form-item label="罐箱模型:" prop="Tankmodel">
                    <el-select v-model="addTankForm.Tankmodel" placeholder="请选择罐箱模型" filterable clearable
                               style="width: 200px">
                      <el-option v-for="(item, index) in TankmodelOptions" :key="index" :label="item.label"
                                 :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>

          </div>
          <!--          底部区域-->
          <el-divider></el-divider>
          <div class="addTanksBottom" style="background-color: #b0c2e3">
            <!--            第一列-->
            <div class="item" style="border-left: none;border-top: none">
              <p class="title">基本信息</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <!--            第二列-->
            <div class="item" style="border-top: none">
              <p class="title">集装箱尺寸</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <!--            第三列-->
            <div class="item" style="border-top: none">
              <p class="title">重量参数</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <!--            第四列-->
            <div class="item" style="border-top: none;border-right: none">
              <p class="title">材料</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <div class="itemContent" style="border-bottom: none;border-left: none">
              <p class="content">箱号:{{ addTankForm.tankNumber }}</p>
              <p class="content">容积:{{ addTankForm.Tankmodel | capitalize }}m³</p>
              <p class="content">制造日期:{{ addTankForm.buildDate }}</p>
              <p class="content">装载介质:{{ addTankForm.tankCargo }}</p>
              <p class="content">认证船级社:{{ addTankForm.ClassificationName }}</p>
              <p class="content">备注:{{ addTankForm.tankText }}</p>
            </div>
            <div class="item6">
              <div class="itemContent" style="border-top: none;border-right: none;border-left: none;padding: 10px 0">
                <p class="content1">长&nbsp;宽&nbsp;高</p>
                <p class="content1">2333x2333x2333</p>
              </div>
              <div class="itemContent" style="border-bottom: none;border-right: none;border-left: none;padding: 10px 0">
                <p class="content1">内径 长</p>
                <p class="content1">2333x2333</p>
              </div>
            </div>
            <div class="item7">
              <div class="itemContent">
                <p class="content1">最大许可载重</p>
                <p class="content1">36000kg</p>
              </div>
              <div class="itemContent">
                <p class="content1">自重</p>
                <p class="content1">3910kg</p>
              </div>
              <div class="itemContent">
                <p class="content1">载重</p>
                <p class="content1">32360kg</p>
              </div>

            </div>
            <div class="itemContent" style="border-right: none;padding: 20px 0">
              <p class="content1">罐体材料</p>
              <p style="font-size: 20px;font-weight: bolder;text-align: center;margin: 0">
                ASMESA240 304</p>
            </div>
            <div class="item" style="border-bottom: none;border-top: none;border-left: none"></div>
            <!--            第五列-->
            <div class="item">
              <p class="title">温度参数</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <!--            第六列-->
            <div class="item">
              <p class="title">压力参数</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <!--            第七列-->
            <div class="item" style="border-right: none">
              <p class="title">保温</p>
              <el-tooltip effect="dark" content="提示" placement="right">
                <i class="el-icon-info" style="padding: 5px"></i>
              </el-tooltip>
            </div>
            <div class="item" style="border-top: none;border-left: none;border-bottom: none"></div>
            <div class="itemContent" style="border-bottom: none;padding: 25px 0">
              <p class="content1">筒体设计温度</p>
              <p style="font-size: 20px;font-weight: bolder;text-align: center;margin: 0">-40-130℃</p>
            </div>
            <div class="item15" style="border-bottom: none">
              <div class="item1" style="padding: 2px">
                <p class="content1">最大工作压力</p>
              </div>
              <div class="item1" style="padding: 2px">
                <p class="content1">实验压力</p>
              </div>
              <div class="item1" style="padding: 2px">
                <p class="content1">最大外部压力</p></div>
              <div class="item1" style="padding: 2px">
                <p class="content2">罐体2.5Bar</p>
              </div>
              <div class="item1" style="padding: 2px">
                <p class="content2">罐体4Bar</p>
              </div>
              <div class="item1" style="padding: 2px">
                <p class="content2">0.6Bar</p>
              </div>
              <div class="item1" style="border-bottom: none;padding: 2px">
                <p class="content2">加热管3.6Bar</p>
              </div>
              <div class="item1" style="border-bottom: none;padding: 2px">
                <p class="content2">加热管6Bar</p>
              </div>
              <div class="item1" style="border-bottom: none"></div>
            </div>
            <div class="item16" style="border-right: none">
              <div style="border-bottom:1px solid rgba(45, 52, 99, 0.97);padding: 10px">
                <p class="content1">保温厚度:50mm</p>
              </div>
              <div style="border-top:1px solid rgba(45, 52, 99, 0.97);padding: 10px">
                <p class="content1">保温材料:岩棉</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="附件上传" name="second">
          <!--          左侧区域-->
          <el-card class="card1">
            <p style="font-size: 20px;font-weight: bold;margin-top: 0">上传图片</p>
            <el-upload
              list-type="picture"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <!--              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-card>
          <!--            右侧区域-->
          <el-card class="card2">
            <p style="font-size: 20px;font-weight: bold;margin-top: 0;">上传附件</p>
            <el-upload
              class="upload-file"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <!--              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddTanks',
  filters: {
    capitalize: function (value) {
      switch (value) {
        case 1:
          return 24
        case 2:
          return 20
      }
    }
  },
  data() {
    return {
      addTankForm: {
        tankNumber: undefined,
        ClassificationName: '',
        buildDate: '',
        tankCargo: undefined,
        linkedDevices: undefined,
        tankText: undefined,
        Tankmodel: undefined
      },
      rules: {
        tankNumber: [{
          required: true,
          message: '请输入箱号',
          trigger: 'blur'
        }],
        ClassificationName: [{
          required: true,
          message: '请输入认证船级社',
          trigger: 'blur'
        }],
        buildDate: [{
          required: true,
          message: '请选择日期选择',
          trigger: 'change'
        }],
        tankCargo: [],
        linkedDevices: [{
          required: true,
          message: '请选择关联设备',
          trigger: 'change'
        }],
        tankText: [],
        Tankmodel: [{
          required: true,
          message: '请选择罐箱模型',
          trigger: 'change'
        }]
      },
      tankCargoOptions: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      linkedDevicesOptions: [{
        label: '23123',
        value: 2
      }, {
        label: '12312',
        value: 1
      }],
      TankmodelOptions: [{
        label: '24寸',
        value: 1
      }, {
        label: '20寸',
        value: 2
      }]
    }
  }
}
</script>

<style scoped>
.addTanksTop {
}

.addTanksBottom {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 1fr;
  grid-template-rows: 50px 150px 50px 100px;
  border: 2px solid rgba(45, 52, 99, 0.97);
}

.item {
  width: auto;
  border: 1px solid rgba(45, 52, 99, 0.97);
  display: flex;
  justify-content: center;
  align-items: center;
}

.item1 {
  border: 1px solid rgba(45, 52, 99, 0.97);
}

.item15 {
  width: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #2D3463;
}

.content {
  font-size: 15px;
  font-weight: bold;
}

.itemContent {
  padding-left: 3px;
  width: auto;
  border: 1px solid rgba(45, 52, 99, 0.97);
}

.item6 {
  display: grid;
  grid-template-rows:1fr 1fr;
  border: 1px solid rgba(45, 52, 99, 0.97);
}

.content1 {
  text-align: center;
  font-size: 15px;
  font-weight: bolder;
  margin: 0;
}

.content2 {
  text-align: center;
  font-size: 15px;
  margin: 0;
}

.item7 {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
}

.item16 {
  border: #2D3463 1px solid;
  border-right: none;
  border-bottom: none;
  display: grid;
  grid-template-rows:1fr 1fr;
}

.card1 {
  float: left;
  display: flex;
  justify-content: center;
  width: 49%;
}

.card2 {
  float: right;
  width: 49%;
  display: flex;
  justify-content: center;
}

/deep/ ::-webkit-scrollbar {
  width: 0;
}
</style>
