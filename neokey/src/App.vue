<template>
  <div id="app">
    <img src="./assets/logo.png">
    
    <HelloWorld msg="Please enter your NEO address"/>

    <el-input placeholder="NEO address" v-model="input"></el-input>
    <el-button @click="showQr">Login with NEO</el-button>
    <vue-qr :text="qrData" size=400 qid="testid"></vue-qr>

    <qrcode-stream @decode="onDecode"></qrcode-stream>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  methods: {
    onDecode(decodedString) {
      // eslint-disable-next-line
      console.log(decodedString)
      // ...
    },
    showQr() {
      // eslint-disable-next-line
      // this.qrData = this.input
      let message = 'challenge'
      let publickey = '02963fc761eb7135c4593bfc6a0af96d8588b70d8f6ef3af8549181e57772181f5'
      if (this.input === '') {
        message = ''
        publickey = ''
      }

      let data = { message, publickey }

      this.qrData = `airgap-vault://message?data=${btoa(JSON.stringify(data))}`
    }
  },
  data() {
    return {
      input: '',
      qrData: 'test'
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
