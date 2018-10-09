// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll' //滚动加载
import store from './store/index'

import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/login.css'
import '@/assets/css/checkout.css'
import {currency} from '@/util/currency' //金额格式化

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(VueLazyload,{
  loading:'./../static/loading-svg/loading-bubbles.svg'
})
Vue.filter('currency',currency);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
