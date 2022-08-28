<template>
  <section>
    <el-row>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <BarModel />
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <PieModel />
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <ScatterModel />
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <PictorialBarModel />
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <LineModel />
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <CylinderModel />
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
