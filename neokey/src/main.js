import Vue from 'vue'
import App from './App.vue'
import Login from './Login.vue'
import Doors from './Doors.vue'
import './plugins/element.js'

Vue.config.productionTip = false

import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader)

import VueQr from 'vue-qr'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

Vue.component('vue-qr', VueQr)

Vue.use(VueRouter)
Vue.use(VueCookies)

const routes = [{ path: '/', component: Login }, { path: '/doors', component: Doors }]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
