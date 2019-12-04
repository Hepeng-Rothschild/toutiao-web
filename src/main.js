import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import VeeValidate, {
  Validator
} from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import {
  relativeTime
} from './utils/dayjs'
import 'amfe-flexible/index.js'
Vue.filter('relativeTime', relativeTime)
Validator.localize('zh_CN', zhCN)
Vue.use(Vant)
Vue.use(
  VeeValidate, {
    events: '' // 禁用默认的事件校验
  }
)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
