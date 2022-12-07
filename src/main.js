import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import VueCookies from 'vue-cookies';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import i18n from './views/I18n';
import './utils/eventBus';
import 'element-plus/dist/index.css';
import './assets/icon/iconfont.css';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(store).use(router).use(ElementPlus).use(VueCookies).use(i18n).mount('#app');

export default app;
