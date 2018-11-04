<template>
  <div id="app">

    <h1>Swisscom Access Manager <img class="building" src="./assets/building-light.png"></h1>

    <!--
    <el-button @click="checkSecret" slot="append">Check Secret</el-button>
    <el-button @click="checkLogin" slot="append">Login</el-button>
    <el-button @click="logout" slot="append">Logout</el-button>
    -->

    <el-container id="content">
      <el-main>
        <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="12">
        <transition name="component-fade" mode="out-in">
          <div v-if="!qrData" key="addressInput">
            <el-card class="box-card login-card">
              <br><br><br><br>
              <el-button  @click="showQr">
                Login using NEO
                <img class="neo-logo" src="./assets/neo.png">
              </el-button>
              <br><br><br><br><br><br><br>
              <div id="logo">
                <span>Powered by <span clas="neokey-font">NEOKΞY</span></span> <img src="./assets/key.svg">
              </div>
            </el-card>
          </div>
        </transition>
        <transition name="component-fade" mode="out-in">
          <div v-if="qrData && !qrDataScanned" key="qrScan">
            <vue-qr :text="qrData" :size="400" qid="testid"></vue-qr>
            <el-button @click="qrDataScanned = true">Done, let me show the signature.</el-button>
          </div>
        </transition>
        <transition name="component-fade" mode="out-in">
          <div v-if="qrDataScanned" key="qrRead">
            <qrcode-stream v-if="qrDataScanned" @decode="onDecode" ></qrcode-stream>
          </div>
        </transition>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as axios from 'axios'

const baseUrl = `http://localhost:8080/api`

export default {
  name: 'app',
  methods: {
    async logout() {
      await axios.get(`${baseUrl}/logout`)
    },
    async checkLogin() {
      try {
        const { data } = await axios.post(`${baseUrl}/login`, {
          challengeId: 'test',
          signature: '8ba5a96e1ba52c6dc9b581de890930537dd570f065d9697ef86c14d06c0dcb7c94d4b26f863c37fb07dc1259f58433abd90735f3187bd00f16dc884086433103',
          publickey: '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9'
         })
         // eslint-disable-next-line
         console.log(data)
      } catch (error) {
        // eslint-disable-next-line
        console.warn(error)
      }
    },
    async checkSecret() {
      try {
        const { data } = await axios.get(`${baseUrl}/secret`, { withCredentials: true })
        this.showAlert(data)
      } catch (error) {
        // eslint-disable-next-line
        console.warn(error)
      }
    },
    async onDecode(decodedString) {
      const binary = decodedString.substr(29)
      const parsed = JSON.parse(atob(binary))

      console.log(parsed)

      try {
        const { data } = await axios.post(`${baseUrl}/login`, { 
          challengeId: parsed.message, 
          publickey: parsed.publickey,
          signature: parsed.signature
        })
        // eslint-disable-next-line
        console.log(data)
        this.showAlert(data.address)
      } catch (error) {
        // eslint-disable-next-line
        console.warn(error)
      }
    },
    async showAlert(address) {
      await this.$alert(`You have been identified as ${address}.`, 'Login Successful.', {
          confirmButtonText: 'Thanks.',
          type: 'success',
          center: true,
          callback: action => {
            this.$router.push('/doors')
          }
      })
    },
    showQr() {
      this.loading = true

      let data = { 
        message: 'challenge', 
        address: this.input
      }

      this.qrData = `airgap-vault://message?data=${btoa(JSON.stringify(data))}`
      this.loading = false
    }
  },
  data() {
    return {
      qrDataScanned: false,
      loading: false,
      input: '',
      qrData: null
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Arimo');

.building {
  width: 25px;
}

.login-input {
  height: 50px;
}

.neo-logo {
  width: 15px;
}

.login-card {
  min-height: 300px;
}

.neokey-font {
  font-family: 'Arimo', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;  
}

h1 {
  font-family: 'Arimo', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#logo {
  float: right;
  padding-top: 10px;
  height: 40px;
}

#logo > span {
  font-size: 12px;
}

#logo > img {
  width: 25px;
  margin-bottom: -7px;
  margin-left: 10px;
}

body, html {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
