<template>
  <div id="app">
    <main>
      <router-view></router-view>
      <navigation-bottom v-if="confirmUser"></navigation-bottom>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import navigation from './components/Navigation.vue'
export default {
  name: 'app',
  data () {
    return {
      currentUser: {},
      profilePicture: '',
      confirmUser: false
    }
  },
  components: {
    'navigation-bottom': navigation
  },
  methods: {
    checkIfAuthenticated: function () {
      if (localStorage.currentUser !== undefined) {
        this.currentUser = JSON.parse(localStorage.currentUser)
        this.profilePicture = this.currentUser.images[0].url
        this.confirmUser = true
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
          var spotifyTokens = JSON.stringify(response.data)
          localStorage.setItem('spotifyTokens', spotifyTokens)
        })
        .catch(function (error) {
          if (error.response.data.error_description === 'Invalid refresh token') {
            localStorage.clear()
          }
        })
      location.reload()
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600,700');
main,*{margin:0;padding:0;}
body {
  margin: 0;
}

#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
img{max-width: 100%;}

</style>

