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
      geoData: {},
    };
  },
  watch: {
    geoData: {
      handler(val) {
        console.log('qq', val);
      },
      immediate: true,
    },
  },
  created() {
    getAirData().then((res) => {
      this.geoData = res.data;
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
