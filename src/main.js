import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import '@/assets/common.scss'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')