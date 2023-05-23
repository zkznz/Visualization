import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import "@/assets/css/global.less"
import "@/assets/font/iconfont.css"
import request from '@/utils/request'
import SocketService from '@/utils/socket_service'

//对服务端进行websocket连接
SocketService.Instance.connect();

Vue.prototype.$socket = SocketService.Instance;
Vue.config.productionTip = false
Vue.prototype.$http = request
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
