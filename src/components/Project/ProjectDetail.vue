<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/project'}">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-bottom: 0;padding-bottom: 0;padding-top: 0">
      <div slot="header">
        <div style="display: grid;grid-template-columns: 95fr 5fr;grid-template-rows: 30px">
          <div><h1 style="display:inline-block;margin: 0">项目详情:</h1>
            <h1 style="display: inline-block;color: #2A68D3;margin: 0">{{ this.$route.query.name }}</h1></div>
          <el-button style="height: 30px;" size="mini" type="primary" icon="el-icon-edit-outline" round>Button
          </el-button>
        </div>
      </div>
      <div>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetail'
}
</script>

<style scoped>
</style>
