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
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store/themeColor";
import { bus, menus, echartColor } from "@/constants";
import menusItem from "./menusItem";

export default {
  name: "MenusLayout",
  components: {
    menusItem,
  },
  data() {
    return {
      defaultActive: "/firstItem",
      newMenus: [],
      bgColor: "#545c64",
      textColor: "#fff",
      activeTextColor: "#ffd04b",
    };
  },
  watch: {
    theme(newVal) {
      this.bgColor = echartColor[newVal].menuBg;
    },
  },
  setup() {
    const themeStore = useThemeStore();
    const { theme } = storeToRefs(themeStore);
    return { theme };
  },
  created() {
    let authMenus = this.$cookies.get("authMenus").split(",");
    menus.forEach((item) => {
      if (item.key && authMenus.includes(item.key)) {
        this.newMenus.push(item);
      }
    });
  },
  mounted() {
    window.eventBus.$on(bus.updateRouter, (value) => {
      this.defaultActive = value;
    });
  },
  beforeUnmount() {
    window.eventBus.$off(bus.updateRouter);
  },
  methods: {
    handleSelect(index) {
      this.defaultActive = index;
    },
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
