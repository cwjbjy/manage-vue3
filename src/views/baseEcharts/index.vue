<template>
  <section>
    <el-row>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <bar-model></bar-model>
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <pie-model></pie-model>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <scatter-model></scatter-model>
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <pictorial-bar-model></pictorial-bar-model>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <line-model></line-model>
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <cylinder-model></cylinder-model>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
/* 基础组件的自动化全局注册 */
const path = require('path');
const files = require.context('@/components/BaseEchartsModel', false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
  const name = path.basename(key, '.vue');
  modules[name] = files(key).default || files(key);
});
export default {
  name: 'BaseEcharts',
  components: modules,
};
</script>

<style scoped>
.echarts-box {
  padding: 10px;
}
</style>
