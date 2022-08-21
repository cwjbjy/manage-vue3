<template>
  <section class="firstItem">
    <el-row>
      <el-col :span="8" :lg="8" :xl="6">
        <UserInfo />
        <Language />
      </el-col>
      <el-col :span="16" :lg="16" :xl="18">
        <IconArea />
        <el-row style="padding: 0 10px; margin-bottom: 20px">
          <Schedule />
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <BarLineModel />
        </el-card>
      </el-col>
      <el-col :span="12" class="echarts-box">
        <el-card shadow="hover">
          <RadarModel />
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import UserInfo from "./components/userInfo";
import Language from "./components/language";
import IconArea from "./components/iconArea";
import Schedule from "./components/schedule";
import BarLineModel from "@/components/echartsModel/barLineModel";
import RadarModel from "@/components/echartsModel/radarModel";

export default {
  name: "HomePage",
  components: {
    UserInfo,
    Language,
    IconArea,
    BarLineModel,
    RadarModel,
    Schedule,
  },
};
</script>

<style scoped lang="scss">
.firstItem {
  padding: 10px 0 0 10px;
  .echarts-box {
    padding: 0 10px;
  }
}
</style>
