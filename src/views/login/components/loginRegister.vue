<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" class="demo-ruleForm">
      <el-form-item prop="reg_name">
        <el-input v-model.trim="ruleForm.reg_name" placeholder="请输入用户名">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="rge_pass">
        <el-input v-model="ruleForm.rge_pass" placeholder="请输入8-16位由数字与字母组成的密码" show-password>
          <template #prefix>
            <el-icon><Lock /></el-icon> </template
        ></el-input>
      </el-form-item>
      <el-form-item prop="rge_passAgain">
        <el-input v-model="ruleForm.rge_passAgain" placeholder="请再次输入密码" show-password>
          <template #prefix>
            <el-icon><Lock /></el-icon> </template
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="verification_class">
      <el-input v-model="authCode" placeholder="验证码区分大小写"></el-input>
      <div id="v_container" style="width: 200px; height: 40px"></div>
    </div>
    <el-button type="primary" style="width: 100%; margin-top: 18px" @click="handleRegister">注册</el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref, toRefs } from 'vue';

import { register } from '@/api/user';
import { getTime } from '@/utils/comFunc';
import { isValidPass } from '@/utils/rules';

export default {
  emits: ['update:register'],
  // eslint-disable-next-line no-unused-vars
  setup(_, { emit }) {
    let verifyCode = null;
    let moreClick = false;
    const ruleFormRef = ref(null);
    const state = reactive({
      authCode: '',
      ruleForm: {
        reg_name: '',
        verification: '',
        rge_pass: '',
        rge_passAgain: '',
      },
    });

    const validatePass = (_, value, callback) => {
      if (!isValidPass(value)) {
        callback(new Error('请输入8-16位由数字与字母组成的密码'));
      } else {
        callback();
      }
    };

    const validatePass2 = (_, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== state.ruleForm.rge_pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    const rules = reactive({
      reg_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      rge_pass: [{ validator: validatePass, trigger: 'blur' }],
      rge_passAgain: [{ validator: validatePass2, trigger: 'blur' }],
    });

    const handleRegister = async () => {
      await ruleFormRef.value.validate((valid) => {
        if (valid) {
          if (moreClick) return;
          moreClick = true;
          const res = verifyCode.validate(state.authCode);
          if (res) {
            const params = {
              userName: state.ruleForm.reg_name,
              passWord: state.ruleForm.rge_pass,
              authority: 2,
              createTime: getTime(),
              photo: 'userlogo.png',
            };
            register(params)
              .then((res) => {
                ElMessage({
                  message: res.data.message,
                  type: 'success',
                });

                emit('update:register', {
                  flag: true,
                  name: state.ruleForm.reg_name,
                  pass: state.ruleForm.rge_pass,
                });
              })
              .catch((err) => {
                if (err.response.status === 403) {
                  ElMessage({
                    message: '用户名已存在，请重新选择用户名',
                    type: 'error',
                  });
                }
              });
          } else {
            ElMessage({
              message: '验证码错误',
              type: 'error',
            });
          }
        } else {
          ElMessage({
            message: '请检查输入内容',
            type: 'error',
          });
        }
      });
    };

    onMounted(() => {
      verifyCode = new window.GVerify('v_container');
    });

    return {
      rules,
      ruleFormRef,
      handleRegister,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss">
.verification_class {
  display: flex;
  .el-input__inner {
    width: 200px;
  }
}
</style>

<style scoped>
.demo-ruleForm {
  margin-top: 30px;
}
</style>
