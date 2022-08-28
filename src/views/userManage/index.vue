<template>
  <section>
    <el-card shadow="hover">
      <strong
        >管理员登录方可看到后台管理页面；该基础表格包含排序，筛选，编辑功能；表格中注册时间旁按钮为排序，筛选功能；上述功能均已实现</strong
      >
      <div class="frontArea">
        <el-table
          :data="tableData.filter((data) => !search || data.user_name.toLowerCase().includes(search.toLowerCase()))"
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
          max-height="500px"
          style="width: 100%"
          border
          id="out-table"
          header-align="center"
        >
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="用户名" prop="user_name" align="center"></el-table-column>
          <el-table-column label="单击图像可以放大" align="center">
            <template #default="scope">
              <el-image
                class="table-td-thumb"
                :src="`${imgBaseURL}${scope.row.photo}`"
                :preview-src-list="[`${imgBaseURL}${scope.row.photo}`]"
                fit="cover"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="角色描述" align="center">
            <template #default="scope">
              <span
                v-html="scope.row.authority == 1 ? '管理员' : '普通用户'"
                :class="[scope.row.authority == 1 ? 'blue' : '']"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
            label="注册时间"
            prop="createTime"
            sortable
            :filters="filtersData"
            :filter-method="filterHandler"
            align="center"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <span class="btn" v-if="scope.row.authority == 1" @click="handleEdit(scope.row)">编辑</span>
              <span class="red btn" v-if="scope.row.authority != 1" @click="handleDelete(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="编辑" v-model="dialogFormVisible" custom-class="userDialog">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="pass" :label-width="formLabelWidth">
          <el-input v-model="form.pass" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeUser">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { user, deleteUser, updateUser } from '@/api/user';

export default {
  name: 'UserManage',
  inject: ['imgBaseURL'],
  setup() {
    const ruleForm = ref(null);
    const state = reactive({
      tableData: [],
      search: '',
      dialogFormVisible: false,
      form: {
        name: '',
        pass: '',
      },
      formLabelWidth: '100px',
      row: {},
      rules: {
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      filtersData: [],
    });
    const init = () => {
      user().then((res) => {
        state.tableData = res.data.data;
        state.filtersData = [];
        state.tableData.forEach((item) => {
          state.filtersData.push({
            text: item.createTime,
            value: item.createTime,
          });
        });
      });
    };
    const methods = reactive({
      handleDelete: (val) => {
        ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteUser({
              id: val,
            }).then(() => {
              ElMessage({
                message: '删除成功',
                type: 'success',
              });
              init();
            });
          })
          .catch(() => {
            ElMessage({
              message: '已取消删除',
              type: 'info',
            });
          });
      },
      handleEdit: (val) => {
        state.row = val;
        state.form.name = state.row.user_name;
        state.dialogFormVisible = true;
      },
      changeUser: () => {
        ruleForm.value.validate((valid) => {
          if (valid) {
            let params = {
              id: this.row.id,
              user_name: this.form.name,
              password: this.form.pass,
            };
            updateUser(params).then(() => {
              ElMessage({
                message: '修改成功',
                type: 'success',
              });
              state.dialogFormVisible = false;
              init();
            });
          } else {
            ElMessage({
              message: '请检查输入内容',
              type: 'error',
            });
          }
        });
      },
      filterHandler: (value, row, column) => {
        const property = column['property'];
        return row[property] === value;
      },
    });
    init();
    return { ...toRefs(state), ...toRefs(methods), init, ruleForm };
  },
  activated() {
    this.init();
  },
};
</script>

<style scoped lang="scss">
.frontArea {
  margin-top: 15px;
}
.btn {
  cursor: pointer;
}
.blue {
  color: blue;
}
.red {
  color: red;
}
.download {
  text-align: right;
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.userDialog {
  .el-dialog {
    width: 35%;
  }
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
