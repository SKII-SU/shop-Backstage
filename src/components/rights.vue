<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rights" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="80"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level ==0">一级权限</el-tag>
            <el-tag v-else-if="info.row.level ==1" type="success">二级权限</el-tag>
            <el-tag v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const { data: dt } = await this.$http.get('/rights/list')
      console.log(dt)
      this.rights = dt.data
    }
  },

  data() {
    return {
      rights: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
