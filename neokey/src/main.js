import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false

import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader)

import VueQr from 'vue-qr'
import VueRouter from 'vue-router'

Vue.component('vue-qr', VueQr)
Vue.use(VueRouter)

new Vue({
  render: h => h(App)
}).$mount('#app')
