<template>
  <div class="fleetLine">
    <FleetModel :model="geoData" />
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';

import FleetModel from '@/components/echartsModel/fleetModel';

import { getAirData } from '@/api/local';

export default {
  name: 'fleetLine',
  components: {
    FleetModel,
  },
  setup() {
    const state = reactive({
      geoData: {},
    });

    getAirData().then((res) => {
      state.geoData = res.data;
    });
    return { ...toRefs(state) };
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
