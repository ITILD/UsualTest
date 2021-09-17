import { createApp } from 'vue'

// import vuetify from './plugins/vuetify'
import Antd from './plugins/antd'

// import 'ant-design-vue/dist/antd.css'

import App from './App.vue'
import router from './router'
import store from './store'
import { appconfig } from './api/config'

const app = createApp(App)
app.use(router)
app.use(store)

// app.use(vuetify)
app.use(Antd);
app.mount('#app')

// 全局配置
appconfig()