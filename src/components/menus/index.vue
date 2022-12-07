<template>
  <!-- 适配所有级别菜单 || 一级二级三级等等... -->
  <nav>
    <el-menu
      :default-active="$route.path"
      class="sidebar-el-menu"
      @select="handleSelect"
      :background-color="bgColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      unique-opened
      router
    >
      <menus-item :list="newMenus"></menus-item>
    </el-menu>
  </nav>
</template>

<script>
import { storeToRefs } from 'pinia';
import { reactive, toRefs, getCurrentInstance, onMounted, onBeforeUnmount, computed } from 'vue';

import menusItem from './menusItem';

import { bus, menus, echartColor } from '@/constants';
import { useThemeStore } from '@/store/themeColor';

export default {
  name: 'MenusLayout',
  components: {
    menusItem,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const themeStore = useThemeStore();
    const { theme } = storeToRefs(themeStore);

    const state = reactive({
      defaultActive: '/firstItem',
      newMenus: [],
      textColor: '#fff',
      activeTextColor: '#ffd04b',
    });

    const bgColor = computed(() => echartColor[theme.value].menuBg);

    const authMenus = proxy.$cookies.get('authMenus').split(',');

    menus.forEach((item) => {
      if (item.key && authMenus.includes(item.key)) {
        state.newMenus.push(item);
      }
    });

    const handleSelect = (index) => {
      state.defaultActive = index;
    };

    onMounted(() => {
      window.eventBus.$on(bus.updateRouter, (value) => {
        state.defaultActive = value;
      });
    });

    onBeforeUnmount(() => {
      window.eventBus.$off(bus.updateRouter);
    });

    return { bgColor, handleSelect, ...toRefs(state) };
  },
};
</script>

<style scoped lang="scss">
nav {
  height: inherit;
  overflow-y: auto;
  overflow-x: hidden;
}
nav::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
</style>
