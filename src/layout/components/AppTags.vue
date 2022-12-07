<template>
  <nav class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li pointer"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
      >
        <span class="tags-li-title" @click="routerClick(item.path)">{{ item.title }}</span>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="small" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </nav>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { bus } from '@/constants';

export default {
  name: 'AppTags',
  emits: ['update:change'],
  setup(_, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      tagsList: [],
    });
    const showTags = computed(() => state.tagsList.length > 0);
    // 关闭全部标签
    const closeAll = () => {
      state.tagsList = [];
      emit('update:change', state.tagsList);
    };

    // 关闭其他标签
    const closeOther = () => {
      const curItem = state.tagsList.filter((item) => {
        return item.path === route.fullPath;
      });
      state.tagsList = curItem;
      emit('update:change', state.tagsList);
    };

    // 设置标签
    const setTags = (route) => {
      const isExist = state.tagsList.some((item) => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        if (state.tagsList.length >= 8) {
          state.tagsList.shift();
        }
        state.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.matched[1].components.default.name,
        });
        emit('update:change', state.tagsList);
      }
    };

    const methods = reactive({
      isActive(path) {
        return Object.is(path, route.fullPath);
      },
      // 关闭单个标签
      closeTags(index) {
        state.tagsList.splice(index, 1);
        emit('update:change', state.tagsList);
      },
      handleTags(command) {
        command === 'other' ? closeOther() : closeAll();
      },
      routerClick(value) {
        router.push(value);
        window.eventBus.$emit(bus.updateRouter, value);
      },
    });

    watch(
      route,
      (newValue) => {
        setTags(newValue);
      },
      {
        immediate: true,
      },
    );

    return { showTags, ...toRefs(state), ...toRefs(methods) };
  },
};
</script>

<style lang="scss">
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  ul {
    height: 30px;
  }
  @include themify($themes) {
    background-color: themed('card-background');
  }
  &-li {
    display: inline-flex;
    margin: 3px 5px;
    border-radius: 3px;
    font-size: 12px;
    height: 23px;
    line-height: 23px;
    padding: 0 12px;
    @include themify($themes) {
      border: 1px solid themed('card-border');
      color: themed('card-font');
    }
  }
  &-li.active {
    @include themify($themes) {
      background: themed('card-background-active');
      border: 1px solid themed('card-border-active');
      color: themed('color-font');
    }
    .tags-li-title {
      @include themify($themes) {
        color: themed('color-font');
      }
    }
  }
  &-li-title {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    @include themify($themes) {
      color: themed('card-font');
    }
  }
  &-close-box {
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 1px;
  }
}
</style>
