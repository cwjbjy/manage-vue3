<template>
  <div class="fleetLine">
    <FleetModel :model="geoData" />
  </div>
</template>

<script>
import FleetModel from '@/components/echartsModel/fleetModel';
import { getAirData } from '@/api/local';
export default {
  name: 'fleetLine',
  components: {
    FleetModel,
  },
  data() {
    return {
      lineData: {},
      tableData: [],
      geoData: {},
    };
  },
  created() {
    getAirData().then((res) => {
      this.geoData = res.data;
      this.tableData = res.data.apiData;
    });
  },
};
</script>

<style lang="scss" scoped>
.fleetLine {
  @include themify($themes) {
    background-color: themed('background-fleet');
  }
}
</style>
