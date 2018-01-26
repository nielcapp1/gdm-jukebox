<template>
  <div class="profile animated fadeIn">
    <img width="100" :src="profilePicture">
    <div class="profile-info"> 
        <p><strong>{{ userInformation.display_name }}</strong></p>
        <p>{{ totalFollowers }} volgers</p>
        <br>
        <p>{{ userInformation.email }}</p>
        <br>
    </div> 
    <div v-if="this.currentUser !== ''">
          <button class="log-out-button" v-on:click="logout">Afmelden</button>
    </div> 
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'profile',
  data () {
    return {
      currentUser: '',
      profilePicture: '',
      totalFollowers: '',
      userInformation: ''
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
    getUserInfo: function () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      var config = {
        headers: { 'Authorization': 'Bearer ' + spotifyTokens.access_token },
        json: true
      }
      var self = this
      axios.get('https://api.spotify.com/v1/me', config)
        .then(function (response) {
          console.log(response)
          self.userInformation = response.data
          self.profilePicture = response.data.images[0].url
          self.totalFollowers = response.data.followers.total
        })
        .catch(function (error) {
          console.log(error)
          self.refreshToken()
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
    logout () {
      localStorage.clear()
      location.reload()
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
    this.getUserInfo()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.profile
{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);

}
.profile img
{
  background: url('https://cdn2.iconfinder.com/data/icons/metro-ui-dock/512/Personal.png');
  display:block;
  width: 137px;
  height:137px;
  margin:0 auto;
  margin-top: 60px;
  background-size: cover;
}
.profile-info
{ 
  display: block;
  width: 100%;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
  margin-top: 50px;
}
.profile-info p
{ 
  line-height: 2rem;
  list-style: none;
  color:rgba(112, 107, 123, 0.8);
}
.log-out-button
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
</style>