<template>
  <div id="app">
    <header>
      <div class="user_profile">
        <img :src="profilePicture">
      </div>
      <span>GDM Jukebox</span>
      <div class="navigation">
        <router-link to="/">
          Home
        </router-link>
        <button v-on:click="refreshToken">RefreshToken</button>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
      currentUser: {},
      profilePicture: ''
    }
  },
  methods: {
    checkIfAuthenticated: function () {
      if (localStorage.currentUser !== undefined) {
        this.currentUser = JSON.parse(localStorage.currentUser)
        this.profilePicture = this.currentUser.images[0].url
        console.log(this.currentUser)
      }
    },
    refreshToken: function () {
      var config = {
        headers: {
          'Authorization': 'Basic MDU2NDA1M2E5YWZiNGYzZWJlN2NlZDUwMTllNDBmYjg6MjVjOTcwODY2ZDE5NGMzODg0NDA5MmY0MzM0NDg2ZWQ='
        },
        json: true
      }
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      var params = new URLSearchParams()
      params.append('refresh_token', spotifyTokens.refresh_token)
      params.append('grant_type', 'refresh_token')
      axios.post('https://accounts.spotify.com/api/token', params, config)
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Montserrat');

body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
  background-color: #262626;
}

header {
  margin: 0;
  height: 60px;
  padding: 0 16px 0 24px;
  background-color: #1DB954;
  color: #FFF;
}

header span {
  display: block;
  float: left;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 800;
  box-sizing: border-box;
  margin: 20px 10px;
}

.user_profile {
  float: left;
  display: inline-block;
}

.user_profile img {
  border-radius: 20px;
  margin: 10px;
  height: 40px;
}

.navigation a {
  float: right;
  color: #FFF;
  font-size: 16px;
  margin: 22px 0px 0px 20px;
  text-decoration: none; 
}

</style>
