const Vue = require('vue')
const ElementUI = require('element-ui')

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
