<template>
  <div class="playlist-detail">
    <ul v-for="item in playlist.tracks.items">
    <audio controls :src="item.track.preview_url"></audio>
    
      <div v-for="image in item.track.album.images.slice(0, 1)">
        <img width="100" :src="image.url">
      </div>
      <li>
        <span v-for="artist in item.track.artists">{{ artist.name }} - </span>{{ item.track.name }}
      </li>
    </ul>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'playlist-detail',
  data () {
    return {
      playlist: {},
      currentUser: ''
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
    getPlaylist () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      axios.get('https://api.spotify.com/v1/users/' + this.currentUser.id + '/playlists/' + this.$route.params.playlistId + '?_format=json', config)
        .then(response => {
          console.log(response)
          this.playlist = response.data
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
    this.getPlaylist()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
