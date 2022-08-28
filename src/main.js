import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './utils/eventBus';
import 'element-plus/dist/index.css';
import './assets/icon/iconfont.css';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(store).use(router).use(ElementPlus).use(VueCookies).mount('#app');

export default app;
