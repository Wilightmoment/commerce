import Vue from 'vue'
//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
//bootstrap
import 'bootstrap'
//loading
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.min.css'
//驗證工具
import VeeValidate from 'vee-validate';
//掛載中文語系
import zhTW from 'vee-validate/dist/locale/zh_TW'
//VueLocalStorage
import VueLocalStorage from 'vue-localstorage'


import App from './App'
import router from './router'
import currenty from './filters/currency'
//將 event bus 加入 root Vue instance 的 data 中
import eventBus from './bus'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

//使用VeeValidate
Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW',zhTW)

//VueLocalStorage
Vue.use(VueLocalStorage)

Vue.component('Loading', Loading)
Vue.filter('currency', currenty)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  data() {
    return {
      //Bind our event bus to our $root Vue model
      bus: eventBus
    }
  },
  router,
  render: h => h(App)  
})

router.beforeEach((to, from, next) => {
  if(to.meta.requireAuth){
    const api = `${process.env.APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      console.log('check', response.data)
      if(response.data.success){
        next();
      }else{
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})