import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false

import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader)

import VueQr from 'vue-qr'

// eslint-disable-next-line
Vue.component('vue-qr', VueQr)

new Vue({
  render: h => h(App)
}).$mount('#app')
