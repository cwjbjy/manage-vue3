<template>
  <section>
    <el-card shadow="hover">
      <strong>上传头像功能，上传完可点击首页观看效果</strong>
      <el-upload
        class="avatar-uploader frontArea"
        :action="uploadURL"
        :on-success="onSuccess"
        :show-file-list="false"
        :data="user"
        :headers="headers"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="加载失败" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <template #tip>
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
        </template>
      </el-upload>
    </el-card>
  </section>
</template>

<script>
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { getCurrentInstance, reactive, toRefs } from 'vue';

import { bus } from '@/constants';
import { useUserStore } from '@/store/user';

export default {
  name: 'FileUp',
  inject: ['uploadURL'],
  setup() {
    const { proxy } = getCurrentInstance();
    const userStore = useUserStore();
    const { user_name, imageUrl } = storeToRefs(userStore);
    const state = reactive({
      headers: {
        Authorization: '',
      },
      user: {
        user_name: '',
      },
    });
    const token = proxy.$cookies.get('token');
    state.headers.Authorization = token;
    state.user.user_name = user_name;

    const methods = reactive({
      onSuccess: (response) => {
        ElMessage({
          type: 'success',
          message: response.message,
        });
        //更换头部图片
        window.eventBus.$emit(bus.updateImg);
      },
      beforeAvatarUpload: (file) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          ElMessage({
            type: 'error',
            message: '上传头像图片只能是 JPG/PNG 格式!',
          });
        }
        if (!isLt2M) {
          ElMessage({
            type: 'error',
            message: '上传头像图片大小不能超过 2MB!',
          });
        }
        return isJPG && isLt2M;
      },
    });

    return { ...toRefs(state), ...toRefs(methods), imageUrl };
  },
};
</script>

<style>
.frontArea {
  margin-top: 15px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
