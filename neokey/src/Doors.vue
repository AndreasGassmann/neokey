<template>
  <div>
    <h1>Swisscom Access Manager - Building Permissions <img class="building" src="./assets/building-light.png"></h1>
    
    <el-container id="content">
      <el-main>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="18">
            
    <div style="float: right">
    <el-button @click="logout" slot="append">Logout</el-button>
    </div>
    <el-table
      :data="doors"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="300">
      </el-table-column>
      <el-table-column
        prop="allowed"
        align="right"
        label="Allowed">
        <template slot-scope="scope">
            <i v-if="scope.row.allowed" class="el-icon el-icon-circle-check success"></i>
            <i v-if="!scope.row.allowed" class="el-icon el-icon-circle-close warning"></i>
        </template>
      </el-table-column>
    </el-table>
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
  async beforeMount() {
    try {
      const result = await axios.get(`${baseUrl}/authenticated`, { withCredentials: true })
    } catch (error) {
      this.$router.push('/')
    }
  },
  async mounted() {
    this.fetchDoors()
  },
  methods: {
    async logout() {
      await axios.get(`${baseUrl}/logout`)
      this.$router.push('/')
    },
    async fetchDoors() {
      const { data } = await axios.get(`${baseUrl}/doors`)
      this.doors = data
    },
  },
  data() {
    return {
      doors: []
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Arimo');

h1 {
  font-family: 'Arimo', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-icon {
  font-size: 20px;
}

.warning {
  color: #E6A23C;
}

.success {
  color: #67C23A;
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
