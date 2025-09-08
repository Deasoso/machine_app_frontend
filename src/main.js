import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
import { ThemeServiceInit, infinityTheme } from 'devui-theme';
import Button from 'vue-devui/button';
import Modal from 'vue-devui/modal';
import Icon from 'vue-devui/icon';
ThemeServiceInit({ infinityTheme }, 'infinityTheme');


import ElementUI from "element-plus";
import 'element-plus/dist/index.css'
import zhLocale from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App).use(Icon).use(Button).use(Modal).use(store).use(router).use(ElementUI, {
  locale: zhLocale
});


app.mount('#app');

