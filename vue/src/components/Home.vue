<template>
<div class="home-template animated fadeIn">
  <div class="login" v-if="!currentUser">
        <div class="logo-box">
            <svg version="1.1" id="Logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 158.4 97.5" style="enable-background:new 0 0 158.4 97.5;" xml:space="preserve">
              <polygon class="st0" points="123,92.1 152,92.1 152,63.1 123.1,63.1 "/>
              <rect x="123" y="5.2" class="st0" width="29" height="29"/>
              <path class="st0" d="M50.2,4.4C26,4.4,6.3,24.1,6.3,48.3c0,24.2,19.6,43.8,43.8,43.8H94V48.3C94,24.1,74.4,4.4,50.2,4.4z"/>
              <path class="st1" d="M40.9,49.4C40.9,49.4,40.9,49.4,40.9,49.4c0,4.4,0,8.9,0,13.3c0,1.4,1,2,2.2,1.3c7.7-4.4,15.4-8.9,23.1-13.3
                c1.2-0.7,1.2-1.8,0-2.5c-7.7-4.4-15.3-8.8-23-13.3c-1.4-0.8-2.3-0.2-2.3,1.3C40.9,40.6,40.9,45,40.9,49.4z"/>
            </svg>
        </div>    
      <h1>GDM Jukebox</h1>
        <div v-if="currentUser">
          <button v-on:click="logout">Afmelden</button>
        </div>
        <div v-else>
        <button v-on:click="login" class="button-sign-in">Inloggen op spotify</button>
        </div>
  </div>
  <div  v-if="currentUser" class="playlists">
    <div class="title-box">
        <h2>Playlists</h2>
        <p>Alle playlists</p>
    </div>
    <input required='required' v-model="searchQuery" for="location"  class="search" placeholder="Welke playlist zoekt u ?" type='text'>
    <div class="flex-grid">
      <div class="t-col-4 m-col-12" v-for="playlist in filteredPlaylists" v-if="playlist.owner.id == currentUser.id">

              <router-link :to="{ name: 'PlaylistDetails', params: { playlistId: playlist.id }}">
                <div class="album_cover" v-for="image in playlist.images.slice(0, 1)">
                  <img :src='image.url'>
                </div>
              </router-link>
              <h3>{{ playlist.name }}</h3>
      </div>     
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
      scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private streaming ugc-image-upload user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played',
      currentUser: '',
      confirmUser: '',
      playlists: [],
      searchQuery: '',
      spotifyTokens: ''
    }
  },
  methods: {
    checkIfAuthenticated: function () {
      if (localStorage.currentUser !== undefined) {
        this.currentUser = JSON.parse(localStorage.currentUser)
        this.confirmUser = true
        this.getPlaylists()
      }
    },
    login () {
      window.location.replace('https://accounts.spotify.com/authorize/?' + 'client_id=' + this.client_id + '&response_type=code' + '&redirect_uri=' + this.redirect_uri + '&scope=' + this.scope)
    },
    logout () {
      localStorage.clear()
      location.reload()
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
    getPlaylists () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      axios.get('https://api.spotify.com/v1/me/playlists', config)
        .then(response => {
          this.playlists = response.data.items
        })
        .catch(e => {
          this.refreshToken()
        })
    }
  },
  computed: {
    filteredPlaylists: function () {
      let self = this
      return self.playlists.filter(function (playlist) {
        return playlist.name.toUpperCase().indexOf(self.searchQuery.toUpperCase()) !== -1
      })
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.st0{fill:#8FC46B;stroke:#4D4E56;stroke-width:2.5562;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
.st1{fill:#FFFFFF;stroke:#4D4E56;stroke-width:2.4671;stroke-miterlimit:10;}
.login{width: 100vw;height:100vh;
  /*background-image: -webkit-repeating-radial-gradient(center center, rgba(214, 213, 215,  0.9), rgba(214, 213, 215, 0.3) , transparent 2px, transparent 100%);
  background-image: -moz-repeating-radial-gradient(center center, rgba(214, 213, 215,  0.9), rgba(214, 213, 215,  0.3) , transparent 2px, transparent 100%);
  background-image: -ms-repeating-radial-gradient(center center, rgba(214, 213, 215,  0.9), rgba(214, 213, 215,  0.3) , transparent 2px, transparent 100%);
  background-image: repeating-radial-gradient(center center, rgba(214, 213, 215,  0.9), rgba(214, 213, 215,  0.3) , transparent 2px, transparent 100%);
  -webkit-background-size: 30px 30px;
  -moz-background-size: 30px 30px;
  background-size: 30px 30px;*/}
.login h1
{
  text-transform: uppercase;
  font-size:25px;
  text-align: center;
  
}
.logo-box
{
  width: 200px;
  margin: 0 auto;
  padding-top: 18%;
  padding-bottom: 4%;

}
.button-sign-in
{
  width:210px;
  display:block;
  margin: 0 auto;
  background:#8FC46B;
  border:none;
  color:white;
  height:50px;
  z-index:999;
  border-radius:50px;
  font-size: 18px;
  margin-top: 50px;
  font-weight: 600;
}

h1, h2 {
  font-weight: semi-bold;
  color:#4c4e55;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}

.title-box{text-align:center;margin-top: 40px;}
.title-box h2
{
    font-size: 18px;
    color:rgba(112, 107, 123, 0.8)
}

.title-box p
{
    font-size: 18px;
    color:rgba(112, 107, 123, 0.54)
}
.playlists{margin-bottom: 80px;margin-top: 80px;}
.search
{       
    display: block;
    background: rgba(174, 172, 178, 0.17);
    border: none;
    padding: 15px;
    width: 80%;
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
    margin-top: 40px;
    border-radius: 2px;
    font-size: 14px;
    margin-bottom: 50px;
}
.album_cover img{max-width: 100%;}
.flex-grid {
	display: flex;
  width: 80%;margin: 0 auto;
  max-width: 800px;
	justify-content: space-between;
	text-align: center;
}
@media only screen and (min-width: 661px){	

	.flex-grid {flex-flow: row wrap;}
	.t-col-4{margin: 4.5%;width: 23.46%}
	.flex-grid:first-child .t-col-4 {
		 margin-top: 0;
	}
}

@media only screen and (min-width: 0px) and (max-width: 660px) {
	.flex-grid {flex-flow: row wrap;}
	.m-col-12 {margin: 5%;}
	.m-col-12 		{width: 40%;}
	.flex-grid:first-child .m-col-12 {
		 margin-top: 0;
	}
}

.flex-grid h3{font-size: 13px;text-align: center;color:rgba(112, 107, 123, 0.87);text-transform:uppercase;margin-top: 10px;}
</style>

