<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-dialog title="添加用户" :visible.sync="isShow" width="30%" modal>
        <el-form ref="addform" :model="addForm" label-width="80px" :rules="addRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
      </el-dialog>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              placeholder="请输入内容"
              v-model="usersInfo.query"
              class="input-with-select"
              clearable
              @clear="search()"
              @keyup.enter.native="search()"
            >
              <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="isShow=true">添加按钮</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <el-row slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(info.row.id)"></el-button>
            <!-- 修改对话框 -->
            <el-dialog title="修改用户" :visible.sync="editShow" width="50%">
              <el-form ref="editData" :model="editForm" label-width="80px" :rules="editRules">
                <el-form-item label="用户名">
                  <el-input v-model="editForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="aditTrue()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改对话框 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </el-row>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 9]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersList()
  },
  methods: {
    /* 删除 */
    async delUser(id) {
      const { data: dt } = await this.$http.delete('users/' + id)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      if (this.tableData.length === 1 && this.usersInfo.pagenum > 1) {
        this.usersInfo.pagenum--
      }
      this.getUsersList()
    },
    /* 修改 */
    async edit(id) {
      this.editShow = true
      const { data: dt } = await this.$http.get('users/' + id)
      this.editForm.name = dt.data.username
      this.editForm.email = dt.data.email
      this.editForm.mobile = dt.data.mobile
      this.id = dt.data.id
    },
    async aditTrue() {
      var id = this.id
      const { data: dt } = await this.$http.put('users/' + id, this.editForm)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$refs.editData.resetFields()
      this.editShow = false
      this.$message.success(dt.meta.msg)
      this.getUsersList()
    },
    /* 添加 */
    addUser() {
      this.$refs.addform.validate(async v => {
        if (v) {
          const { data: dt } = await this.$http.post('/users', this.addForm)
          console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$refs.addform.resetFields()
          this.isShow = false
          this.$message.success(dt.meta.msg)
          this.getUsersList()
        }
      })
    },
    /* 查找 */
    search() {
      this.getUsersList()
    },
    handleCurrentChange(v) {
      this.usersInfo.pagenum = v
      this.getUsersList()
    },

    handleSizeChange(v) {
      this.usersInfo.pagesize = v
      this.getUsersList()
    },
    async getUsersList() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.usersInfo
      })
      this.total = dt.data.total
      this.tableData = dt.data.users
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功，继续执行
      callback()
    }
    return {
      tableData: [],
      usersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 1,
      isShow: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [{ required: true, message: '必填项', trigger: 'blur' }],
        password: [{ required: true, message: '必填项', trigger: 'blur' }],
        email: [{ required: true, message: '必填项', trigger: 'blur' }],
        mobile: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editShow: false,
      editRules: {
        email: [{ required: true, message: '必填项', trigger: 'blur' }],
        mobile: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      editForm: {
        name: '',
        email: '',
        mobile: ''
      },
      id: ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
