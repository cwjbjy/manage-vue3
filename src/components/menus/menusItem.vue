<template>
  <div>
    <template v-for="item in list" :key="item.name">
      <el-sub-menu :index="item.name" v-if="item.children">
        <template #title>
          <img v-if="item.icon" :src="item.icon" class="icon" alt="加载失败" />
          <span>{{ item.name }}</span>
        </template>
        <menus-item :list="item.children"></menus-item>
      </el-sub-menu>
      <el-menu-item :index="item.path" v-else>
        <img v-if="item.icon" :src="item.icon" class="icon" alt="加载失败" />
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "menusItem",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.icon {
  margin-right: 10px;
  width: 18px;
  height: 18px;
}
</style>
