import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import NutUI from "@nutui/nutui";
import "@nutui/nutui/dist/style.css";

import ElementUI from "element-plus";
import 'element-plus/dist/index.css'
import zhLocale from "element-plus/es/locale/lang/zh-cn";

import pageName from "@/components/pageName";

const app = createApp(App).use().use(NutUI).use(ElementUI, {
  locale: zhLocale
}).use(store).use(router);

app.component("envir-page-name", pageName);

app.mount('#app');

