<template>
  <div :class="themeClass">
    <div class="app-container">
      <AppHeader @theme="colorChange" />
      <main class="app-main">
        <aside>
          <MenusLayout />
        </aside>
        <article class="app-content">
          <app-tags @update:change="tagChange" />
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <keep-alive :include="keepList" :exclude="exList" :max="8">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </article>
      </main>
      <footer>
        <el-backtop target=".app-content" :bottom="100"></el-backtop>
      </footer>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue';

import AppHeader from './components/AppHeader';
import AppTags from './components/AppTags';
import MenusLayout from '@/components/menus';

export default {
  name: 'AppHome',
  components: {
    AppHeader,
    AppTags,
    MenusLayout,
  },
  setup() {
    const state = reactive({
      msg: 'Dynamic Themes',
      theme: 'gray',
      keepList: [],
      exList: ['HomePage', 'fleetLine', 'BaseEcharts'],
    });
    const themeClass = computed(() => `theme-${state.theme}`);
    const methods = reactive({
      colorChange(val) {
        state.theme = val;
      },
      tagChange(val) {
        state.keepList = [];
        val.forEach((element) => {
          state.keepList.push(element.name);
        });
      },
    });
    return { themeClass, ...toRefs(state), ...toRefs(methods) };
  },
};
</script>

<style lang="scss">
.app-container {
  @include themify($themes) {
    color: themed('color-font');
    background-color: themed('background-main');
  }
  .layoutHeader {
    @include themify($themes) {
      background-color: themed('background-header');
    }
    height: 70px;
    width: 100%;
  }
  .app-main {
    display: flex;
    height: calc(100vh - 70px);
  }
  .el-menu {
    border: none;
  }
  aside {
    height: inherit;
    @include themify($themes) {
      background-color: themed('background-aside');
    }
  }
  .app-content {
    height: inherit;
    width: 100%;
    overflow: auto;
  }
  .pointer {
    cursor: $cursor-pointer;
  }
}
/* element-ui???????????? */
.el-card {
  @include themify($themes) {
    background-color: themed('card-background');
    color: themed('card-font');
    border: 1px solid themed('card-border');
  }
}
.el-card__header {
  @include themify($themes) {
    border-bottom: 1px solid themed('card-border');
  }
}
.el-progress__text {
  @include themify($themes) {
    color: themed('card-font');
  }
}
.el-button--primary {
  @include themify($themes) {
    background-color: themed('button-primary');
    border: 1px solid themed('card-border');
    color: themed('color-font');
  }
}
.el-input__inner {
  @include themify($themes) {
    // background-color: themed('card-background');
    // border: 1px solid themed('card-border');
    color: themed('card-font');
  }
}

.el-table th,
.el-table tr {
  @include themify($themes) {
    background-color: themed('card-background');
  }
}
.el-table td,
.el-table th.is-leaf {
  @include themify($themes) {
    border-bottom: 1px solid themed('card-border');
  }
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  @include themify($themes) {
    background-color: themed('background-main');
  }
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  @include themify($themes) {
    background-color: themed('card-border');
  }
}
.el-table thead.is-group th {
  @include themify($themes) {
    background-color: themed('table-th');
  }
}
.el-table--border,
.el-table--group {
  @include themify($themes) {
    border: 1px solid themed('card-border');
  }
}
.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  @include themify($themes) {
    border: 1px solid themed('card-border');
  }
}
.el-table--border th,
.el-table__fixed-right-patch {
  @include themify($themes) {
    border-bottom: 1px solid themed('card-border');
  }
}
.el-table thead {
  @include themify($themes) {
    color: themed('card-font');
  }
}
.el-table {
  @include themify($themes) {
    color: themed('card-font');
  }
}
</style>
