<template>
  <section>
    <el-card shadow="hover">
      <strong>点击按钮，进行pdf预览，具有放大、缩小、下载、打印功能</strong>
      <div class="frontArea">
        <el-button type="primary" @click="dialogFormVisible = true">点我弹框</el-button>
      </div>
    </el-card>
    <el-dialog title="pdf预览" v-model="dialogFormVisible" width="90%" top="2vh">
      <iframe :src="src" frameborder="0" class="pdf"></iframe>
    </el-dialog>
  </section>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  name: 'PDFPreview',
  setup() {
    const state = reactive({
      src: '/static/cwj.pdf',
      dialogFormVisible: false,
    });
    return { ...toRefs(state) };
  },
};
</script>

<style lang="scss" scoped>
.frontArea {
  margin-top: 15px;
}
.pdf {
  width: 100%;
  height: calc(100vh - 170px - 2vh);
}
</style>
