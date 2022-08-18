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
      <el-button type="primary" style="width: 100%" @click="handleLogin"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { login } from "@/api/user";
import { reactive, ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
export default {
  name: "LoginForm",
  setup() {
    const formRef = ref(null);
    const moreClick = ref(false);
    const ruleForm = reactive({
      name: "一叶扁舟",
      pass: "123456zx",
    });
    const rules = reactive({
      name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });
    let { proxy } = getCurrentInstance();
    const userStore = useUserStore();
    const router = useRouter();
    const handleLogin = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (moreClick.value) return;
          moreClick.value = true;
          let fd = new FormData();
          fd.append("userName", ruleForm.name);
          fd.append("passWord", ruleForm.pass);
          login(fd)
            .then((res) => {
              proxy.$cookies.set("authMenus", res.data.auth);
              proxy.$cookies.set("token", res.data.value);
              userStore.updateUserName(ruleForm.name);
              localStorage.setItem("user_name", ruleForm.name);
              router.push("/firstItem");
            })
            .catch((err) => {
              console.log("err", err);
              if (err.response.status === 400) {
                ElMessage({
                  message: "密码错误",
                  type: "error",
                });
              } else if (err.response.status === 401) {
                ElMessage({
                  message: "用户名错误",
                  type: "error",
                });
              }
            })
            .finally(() => {
              moreClick.value = false;
            });
        } else {
          ElMessage({
            message: "请检查输入内容",
            type: "error",
          });
        }
      });
    };
    const onRegister = (name, pass) => {
      ruleForm.name = name;
      ruleForm.pass = pass;
    };
    return { moreClick, ruleForm, rules, formRef, handleLogin, onRegister };
  },
};
</script>

<style scoped>
.demo-ruleForm {
  margin-top: 30px;
}
</style>
