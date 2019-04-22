<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="goOut()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isShow?'65px':'200px'">
        <div id="isShow" :style="{whidth:isShow?'65px':'200px'}" @click="isShow=!isShow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isShow"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu v-for="(item,v) in listData" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="'iconfont icon-'+icons[v]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group v-for="item2 in item.children" :key="item2.id">
              <el-menu-item :index="item2.path">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      listData: '',
      icons: ['usergroup', 'quanxian', 'shangpingouwudai2', 'dingdan', 'shuju']
    }
  },
  methods: {
    async getDate() {
      const { data: dt } = await this.$http.get('/menus')
      this.listData = dt.data
      console.log(this.listData)
    },
    goOut() {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  },
  created() {
    this.getDate()
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 50px;
      height: 50px;
      vertical-align: middle;
      margin-right: 10px;
    }
    span {
      font-size: 22px;
      color: #fff;
      vertical-align: middle;
    }
  }
  .el-aside {
    background-color: #333744;
    ul {
      border: 0;
    }
    #isShow {
      text-align: center;
      color: #eaedf1;
      font-size: 12px;
      line-height: 25px;
      background-color: #4a5064;
      letter-spacing: 1px;
      cursor: pointer;
    }
    .el-submenu__title span {
      font-size: 13px;
    }
    ul .el-menu-item {
      font-size: 13px;
    }
    .iconfont {
      margin-right: 10px;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
