<template>
  <div class="home">
    <h1>Home</h1>
    <div v-if="this.currentUser !== ''">
      <button v-on:click="logout">Afmelden</button>
    </div>
    <div v-else>
     <button v-on:click="login">Aanmelden</button>
    </div>
    <p>{{ currentUser.id }}</p>
    <div v-for="playlist in playlists.items">
      <div v-if="playlist.owner.id == currentUser.id">
        <router-link :to="{ name: 'PlaylistDetails', params: { playlistId: playlist.id }}">
          <div v-for="image in playlist.images.slice(0, 1)">
            <img width="100" :src="image.url">
          </div>
          <h3>{{ playlist.name }}</h3>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  data () {
    return {
      client_id: '0564053a9afb4f3ebe7ced5019e40fb8',
      client_secret: '25c970866d194c38844092f4334486ed',
      redirect_uri: 'http%3A%2F%2Flocalhost%3A8080%2Fcallback',
      state: '',
      stateKey: 'spotify_auth_state',
      scope: 'user-read-private user-read-email',
      status: false,
      currentUser: '',
      playlists: ''
    }
  },
  methods: {
    checkIfAuthenticated: function () {
      if (localStorage.currentUser !== undefined) {
        this.currentUser = JSON.parse(localStorage.currentUser)
        this.status = true
        console.log(this.currentUser)
      }
    },
    generateRandomString (length) {
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var text = ''
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      this.state = text
      localStorage.setItem('state', this.state)
    },
    login () {
      window.location.replace('https://accounts.spotify.com/authorize/?' + 'client_id=' + this.client_id + '&response_type=code' + '&redirect_uri=' + this.redirect_uri + '&scope=' + this.scope + '&state=' + this.state)
    },
    logout () {
      localStorage.clear()
      location.reload()
    },
    getPlaylists () {
      console.log(this.spotifyAccessToken)
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      axios.get('https://api.spotify.com/v1/me/playlists', config)
        .then(response => {
          this.playlists = response.data
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted: function () {
    this.generateRandomString(16)
    this.checkIfAuthenticated()
    this.getPlaylists()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
