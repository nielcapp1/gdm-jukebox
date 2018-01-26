<template>
<div class="playlist-detail animated fadeIn">
    <div class="playlist-info">
        <div class="playlist-image">
           <img :src="playlistCover">
        </div>
        <div class="playlist-title">{{ playlist.name }}</div>
        <button v-on:click="playPlaylist" class="shuffle-button">PLAY</button>
    </div>  
    <div class="playlist-track-list">
      <ul v-for="item in tracks">
        <li>
          <div class="track-image" v-for="image in item.track.album.images.slice(0, 1)">
            <img width="100" :src="image.url">
          </div>
          <div class="track-info" v-for="artist in item.track.artists.slice(0, 1)">
            <span>{{ item.track.name }}</span>
            <em>{{ artist.name }}</em>
          </div>
        </li>
      </ul>
    </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'playlist-detail',
  data () {
    return {
      playlist: {},
      playlistCover: '',
      tracks: [],
      currentUser: '',
      device: '',
      deviceId: ''
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
    getDevice: function () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      console.log(spotifyTokens.access_token)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      var self = this
      axios.get('https://api.spotify.com/v1/me/player/devices', config)
        .then(function (response) {
          if (response.data.devices.length === 0) {
            self.device = true
          } else {
            self.deviceId = response.data.devices[0].id
            console.log(self.deviceId)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
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
          location.reload()
        })
        .catch(function (error) {
          console.log(error.response)
          if (error.response.data.error_description === 'Invalid refresh token') {
            localStorage.clear()
            location.reload()
          }
        })
    },
    playPlaylist () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      console.log(spotifyTokens.access_token)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      axios.put('https://api.spotify.com/v1/me/player/play?&device_id=' + this.deviceId, {
        'context_uri': this.playlist.uri
      }, config)
        .then(function (response) {
          console.log(response)
          if (response.status === 202) {
            alert('Er zijn geen devices beschikbaar.')
          }
        })
        .catch(function (error) {
          console.log(error.response)
          this.refreshToken()
        })
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
          this.tracks = response.data.tracks.items
          this.playlist = response.data
          this.playlistCover = response.data.images[0].url
        })
        .catch(e => {
          console.log(e)
          this.refreshToken()
        })
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
    this.getPlaylist()
    this.getDevice()
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.playlist-detail{margin-top: 80px;}
.playlist-image
{ 
    width: 137px;
    height:137px;
    background: lightgray;
    margin: 0 auto;
    margin-top: 60px;
}
.shuffle-button
{
  width:150px;
  display:block;
  margin: 0 auto;
  background:#8FC46B;
  border:none;
  color:white;
  height:40px;
  z-index:999;
  border-radius:50px;
  font-size: 18px;
  margin-top: 50px;
  font-weight: 600;
}
.playlist-title
{
  text-align:center;
  margin-top: 20px;
  color:rgba(112, 107, 123, 0.8);
  font-weight: bold;
  font-size:16px;
}
.playlist-track-list li {list-style: none;}
.playlist-track-list 
{
    position: relative;
    z-index: 10;
    overflow: hidden;
    width: 70%;
    margin: auto;
    margin-top: 40px;
}

.playlist-track-list h2{line-height: 35px;}
.playlist-track-list h2 i{float:left;font-size:35px;margin-right:10px;}
.playlist-track-list ul {margin: 0;padding: 0}
.playlist-track-list li 
{
    overflow: hidden;
    padding: 20px 15px;
}

.playlist-track-list li .track-image 
{
    float: left;
    width:60px;
    height: 60px;
}

.playlist-track-list li .track-info 
{
    display: inline-block;
    position: relative;
    float: left;
    line-height: 37px;
    max-width: 400px;
    margin-left: 20px;
}
.playlist-track-list li .track-info span 
{
  color:rgba(112, 107, 123, 0.8);
  font-weight: bold;
} 
.playlist-track-list li .track-info em 
{
    display:block;
    font-size: 13px;
    font-style: normal;
    line-height: 15px;
    text-decoration:none;
    color:rgba(112, 107, 123, 0.54);
    font-weight: 600;
}


</style>
