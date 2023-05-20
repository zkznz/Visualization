import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/SellerPage'
import Seller from '@/components/Seller'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SellerPage',
    component: SellerPage,
    // children: [
    //   {
    //     path: '/seller',
    //     name: 'Seller',
    //     component: Seller,
    //   }
    // ]
  },
]

const router = new VueRouter({
  routes
})

export default router
