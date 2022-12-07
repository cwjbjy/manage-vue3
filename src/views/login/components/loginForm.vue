<template>
  <el-form :model="ruleForm" :rules="rules" ref="formRef" class="demo-ruleForm">
    <el-form-item prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入用户名/手机号">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input v-model="ruleForm.pass" placeholder="请输入密码" show-password>
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label>
      <el-button type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ElMessage } from 'element-plus';
import { reactive, ref, getCurrentInstance, toRefs } from 'vue';
import { useRouter } from 'vue-router';

import { login } from '@/api/user';
import { useUserStore } from '@/store/user';
export default {
  name: 'LoginForm',
  setup() {
    const { proxy } = getCurrentInstance();
    const userStore = useUserStore();
    const router = useRouter();
    const formRef = ref(null);
    let moreClick = false;

    const state = reactive({
      ruleForm: {
        name: '一叶扁舟',
        pass: '123456zx',
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    });

    const methods = reactive({
      handleLogin: () => {
        formRef.value.validate((valid) => {
          if (valid) {
            if (moreClick) return;
            moreClick = true;
            let fd = new FormData();
            fd.append('userName', state.ruleForm.name);
            fd.append('passWord', state.ruleForm.pass);
            login(fd)
              .then((res) => {
                proxy.$cookies.set('authMenus', res.data.auth);
                proxy.$cookies.set('token', res.data.value);
                userStore.updateUserName(state.ruleForm.name);
                localStorage.setItem('user_name', state.ruleForm.name);
                router.push('/firstItem');
              })
              .catch((err) => {
                console.log('err', err);
                if (err.response.status === 400) {
                  ElMessage({
                    message: '密码错误',
                    type: 'error',
                  });
                } else if (err.response.status === 401) {
                  ElMessage({
                    message: '用户名错误',
                    type: 'error',
                  });
                }
              })
              .finally(() => {
                moreClick = false;
              });
          } else {
            ElMessage({
              message: '请检查输入内容',
              type: 'error',
            });
          }
        });
      },
      onRegister: (name, pass) => {
        state.ruleForm.name = name;
        state.ruleForm.pass = pass;
      },
    });

    return { formRef, ...toRefs(state), ...toRefs(methods) };
  },
};
</script>

<style scoped>
.demo-ruleForm {
  margin-top: 30px;
}
</style>
