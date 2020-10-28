<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>固件管理</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 style="margin-bottom: 15px;margin-top: 15px">
      固件管理
    </h1>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="6">
            <div style="display: flex;align-content: center; padding-top: 5px;">
              <i
                class="el-icon-upload uploadButton"
                @click="uploadButton"
              />
              <p class="uploadText">
                上传固件
              </p>
            </div>
          </el-col>
          <el-col
            :span="3"
            :push="15"
          >
            <div>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit-outline"
                @click="massChange"
              >
                批量操作
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table />
      </div>
    </el-card>
    <el-dialog
      title="添加固件"
      :visible.sync="uploadDialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <div
        slot="title"
        style="font-weight: bold;font-size: 20px;color: #2F74EB"
      >
        <i
          class="el-icon-s-promotion"
          style="margin: 3px"
        />
        <span>添加固件</span>
      </div>
      <el-form
        ref="addTankForm"
        :model="addTankForm"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item
          label="固件名称:"
          prop="field101"
        >
          <el-input
            v-model="addTankForm.field101"
            placeholder="请输入固件名称"
            clearable
            :style="{width: '80%'}"
          />
        </el-form-item>
        <el-form-item
          label="固件版本号:"
          prop="field105"
        >
          <el-input
            v-model="addTankForm.field105"
            placeholder="请输入固件版本号"
            clearable
            :style="{width: '80%'}"
          />
        </el-form-item>
        <el-form-item
          label="所属设备:"
          prop="field103"
        >
          <el-select
            v-model="addTankForm.field103"
            placeholder="请选择所属设备"
            clearable
            :style="{width: '80%'}"
          >
            <el-option
              v-for="(item, index) in field103Options"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="固件模块:"
          prop="field104"
        >
          <el-select
            v-model="addTankForm.field104"
            placeholder="请选择固件模块"
            clearable
            :style="{width: '80%'}"
          >
            <el-option
              v-for="(item, index) in field104Options"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="签名算法:"
          prop="field107"
        >
          <el-select
            v-model="addTankForm.field107"
            placeholder="请选择签名算法"
            clearable
            :style="{width: '80%'}"
          >
            <el-option
              v-for="(item, index) in field107Options"
              :key="index"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="field109"
        >
          <el-input
            v-model="addTankForm.field109"
            placeholder="请输入备注"
            :maxlength="20"
            show-word-limit
            clearable
            prefix-icon="el-icon-document-copy"
            :style="{width: '80%'}"
          />
        </el-form-item>
        <el-form-item
          label="选择固件:"
          prop="field108"
          required
        >
          <el-upload
            ref="field108"
            style="height: 50px"
            :file-list="field108fileList"
            :action="field108Action"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :limit="1"
            accept="application/zip"
          >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload"
            >
              点击上传
            </el-button>
            <el-tooltip
              effect="dark"
              content="请上传zip格式且文件小于1MB"
              placement="right"
            >
              <i
                class="el-icon-question"
                style="font-weight:normal;color: rgba(0,0,0,0.7);font-size: small;margin:0 10px"
              />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="display:flex;justify-content: center"
      >
        <el-button
          style="width: 100px"
          type="primary"
          @click="$refs.upload.submit()"
        >确 定</el-button>
        <el-button
          style="width: 100px"
          @click="uploadDialogVisible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FirmwareManage',
  data () {
    return {
      uploadDialogVisible: false,
      addTankForm: {
        field101: '111',
        field105: undefined,
        field103: undefined,
        field104: undefined,
        field107: undefined,
        field109: undefined,
        field108: ''
      },
      rules: {
        field101: [{
          required: true,
          message: '请输入固件名称',
          trigger: 'blur'
        }],
        field105: [{
          required: true,
          message: '请输入固件版本号',
          trigger: 'blur'
        }],
        field103: [{
          required: true,
          message: '请选择所属设备',
          trigger: 'change'
        }],
        field104: [{
          required: true,
          message: '请选择固件模块',
          trigger: 'change'
        }],
        field107: [{
          required: true,
          message: '请选择签名算法',
          trigger: 'change'
        }],
        field109: [{
          required: true,
          message: '请输入备注',
          trigger: 'blur'
        }]
      },
      field108Action: 'https://jsonplaceholder.typicode.com/posts/',
      field108fileList: [],
      field103Options: [{
        label: 'Tanktrac',
        value: 1
      }, {
        label: 'Smartflank',
        value: 2
      }],
      field104Options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }],
      field107Options: [{
        label: 'MD5',
        value: 1
      }, {
        label: 'HAS26',
        value: 2
      }]
    }
  },
  methods: {
    uploadButton () {
      this.uploadDialogVisible = true
    },
    massChange () {
      this.$router.push('/devicemanage/massoperation')
    },
    beforeUpload (file) {
      const isZip = file.name.endsWith('.zip')
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isZip) {
        this.$message.error('上传头像图片只能是 rar 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isZip && isLt1M
    }
  }
}
</script>

<style scoped>
.uploadButton {
  font-size: 25px;
  color: #2D3463;
  cursor: pointer;
}

.uploadButton:hover {
  font-size: 25px;
  color: #2F74EB;
}

.uploadText {
  text-align: center;
  white-space: nowrap;
  margin: 0 0 0 5px;
  font-weight: bold;
  line-height: 25px
}

/deep/ .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
