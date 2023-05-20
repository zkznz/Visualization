import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import "@/assets/css/global.less"
import request from '@/utils/request'

Vue.config.productionTip = false
Vue.prototype.$http = request
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
