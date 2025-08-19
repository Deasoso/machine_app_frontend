import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import NutUI from "@nutui/nutui";
import "@nutui/nutui/dist/style.css";

import ElementUI from "element-plus";
import 'element-plus/dist/index.css'
import zhLocale from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App).use().use(NutUI).use(ElementUI, {
  locale: zhLocale
}).use(store).use(router);

app.mount('#app');

