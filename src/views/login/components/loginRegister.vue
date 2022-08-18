<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormRef"
      class="demo-ruleForm"
    >
      <el-form-item prop="reg_name">
        <el-input v-model.trim="ruleForm.reg_name" placeholder="请输入用户名">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="rge_pass">
        <el-input
          v-model="ruleForm.rge_pass"
          placeholder="请输入8-16位由数字与字母组成的密码"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon> </template
        ></el-input>
      </el-form-item>
      <el-form-item prop="rge_passAgain">
        <el-input
          v-model="ruleForm.rge_passAgain"
          placeholder="请再次输入密码"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon> </template
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="verification_class">
      <el-input v-model="authCode" placeholder="验证码区分大小写"></el-input>
      <div id="v_container" style="width: 200px; height: 50px"></div>
    </div>
    <el-button type="primary" style="width: 100%" @click="handleRegister"
      >注册</el-button
    >
  </div>
</template>

<script>
import { register } from "@/api/user";
import { isValidPass } from "@/utils/rules";
import { getTime } from "@/utils/comFunc";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

export default {
  emits: ["update:register"],
  // eslint-disable-next-line no-unused-vars
  setup(_, { emit }) {
    let verifyCode = reactive({});
    const ruleFormRef = ref(null);
    const authCode = ref("");

    const ruleForm = reactive({
      reg_name: "",
      verification: "",
      rge_pass: "",
      rge_passAgain: "",
    });
    const validatePass = (rule, value, callback) => {
      if (!isValidPass(value)) {
        callback(new Error("请输入8-16位由数字与字母组成的密码"));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== ruleForm.rge_pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      reg_name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      rge_pass: [{ validator: validatePass, trigger: "blur" }],
      rge_passAgain: [{ validator: validatePass2, trigger: "blur" }],
    });

    onMounted(() => {
      verifyCode = new window.GVerify("v_container");
    });
    const handleRegister = async () => {
      await ruleFormRef.value.validate((valid) => {
        if (valid) {
          var res = verifyCode.validate(authCode.value);
          if (res) {
            let params = {
              userName: ruleForm.reg_name,
              passWord: ruleForm.rge_pass,
              authority: 2,
              createTime: getTime(),
              photo: "userlogo.png",
            };
            register(params)
              .then((res) => {
                ElMessage({
                  message: res.data.message,
                  type: "success",
                });

                emit("update:register", {
                  flag: true,
                  name: ruleForm.reg_name,
                  pass: ruleForm.rge_pass,
                });
              })
              .catch((err) => {
                if (err.response.status === 403) {
                  ElMessage({
                    message: "用户名已存在，请重新选择用户名",
                    type: "error",
                  });
                }
              });
          } else {
            ElMessage({
              message: "验证码错误",
              type: "error",
            });
          }
        } else {
          ElMessage({
            message: "请检查输入内容",
            type: "error",
          });
        }
      });
    };

    return {
      authCode,
      ruleForm,
      rules,
      handleRegister,
      ruleFormRef,
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