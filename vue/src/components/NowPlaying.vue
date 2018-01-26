<template>
  <div class="player animated fadeIn">
    <div class="audio-player">
      <div v-if="device == false">
        <div class="cover-image">
          <h3>{{ artist }}</h3>
          <h2>{{ track }}</h2>
          <img :src="albumCover">
        </div>
        <div class="info">
          <div v-if="newProcessTrack == ''">
            <p id="timestart">{{ progressOnLoad }}</p>
            <div id="myProgress">
              <div v-bind:style="{ width: percentage + '%' }" id="myBar">
              </div>
            </div>
          </div>
          <div v-else>
            <p id="timestart">{{ progressSeconds }}</p>
            <div id="myProgress">
              <div v-bind:style="{ width: percentage + '%' }" id="myBar">
              </div>
            </div>
          </div>
          <p id="timesleft">{{ durationSeconds }}</p>
          <div hidden>
            {{ percentageTrack }}
          </div>
        </div>
        <div class="controls">
          <div class="controls_plays">
            <i v-on:click="previousTrack" class="fa fa-step-backward" aria-hidden="true"></i>
            <i v-if="playing === true" v-on:click="pauseTrack" class="fa fa-pause" aria-hidden="true"></i>
            <i v-else v-on:click="playTrack" class="fa fa-play " aria-hidden="true"></i>
            <i v-on:click="nextTrack" class="fa fa-step-forward" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <div v-if="device == true">
        <div>
          <h1>Er zijn geen devices beschikbaar</h1>
          <button v-on:click="nowPlaying">Refresh</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'now-playing',
  data () {
    return {
      currentUser: '',
      status: '',
      nowPlayingData: '',
      artist: '',
      track: '',
      albumCover: '',
      durationTrack: '',
      progressTrack: '',
      newProcessTrack: '',
      percentage: '',
      playing: '',
      device: ''
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
      console.log(spotifyTokens.refresh_token)
      axios.post('https://accounts.spotify.com/api/token', params, config)
        .then(function (response) {
          var spotifyTokens = JSON.stringify(response.data)
          localStorage.setItem('spotifyTokens', spotifyTokens)
          alert('JOO')
        })
        .catch(function (error) {
          console.log(error.response)
          // if (error.response.data.error_description === 'Invalid refresh token') {
          //   localStorage.clear()
          //   window.location.replace('http://localhost:8080')
          // }
        })
      // location.reload()
    },
    nowPlaying: function () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      this.device = false
      console.log(spotifyTokens.access_token)
      var self = this
      axios.get('https://api.spotify.com/v1/me/player/currently-playing', config)
        .then(function (response) {
          console.log(response)
          if (response.status === 200) {
            self.device = false
            self.playing = response.data.is_playing
            self.durationTrack = response.data.item.duration_ms
            self.progressTrack = response.data.progress_ms
            self.track = response.data.item.name
            self.artist = response.data.item.album.artists[0].name
            self.albumCover = response.data.item.album.images[0].url
            console.log(self.device)
          }
        })
        .catch(function (error) {
          console.log(error)
          // self.refreshToken()
        })
    },
    playTrack () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      console.log(spotifyTokens.access_token)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      axios.put('https://api.spotify.com/v1/me/player/play', {}, config)
        .then(function (response) {
          console.log(response)
          if (response.status === 202) {
            this.device = false
          } else {
            this.nowPlaying()
          }
        })
        .catch(function (error) {
          console.log(error.response)
        })
      var self = this
      self.playing = true
    },
    pauseTrack () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      axios.put('https://api.spotify.com/v1/me/player/pause', {}, config)
        .then(function (response) {
          console.log(response)
          if (response.status === 202) {
            this.device = false
          } else {
            this.nowPlaying()
          }
        })
        .catch(function (error) {
          console.log(error.response)
        })
      var self = this
      self.playing = false
    },
    previousTrack () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      var self = this
      axios.post('https://api.spotify.com/v1/me/player/previous', {}, config)
        .then(function (response) {
          console.log(response)
          if (response.status === 204) {
            self.nowPlaying()
            location.reload()
          } else if (response.status === 202) {
            this.device = false
          } else {
            this.nowPlaying()
          }
        })
        .catch(function (error) {
          console.log(error.response)
        })
    },
    nextTrack () {
      var spotifyTokens = JSON.parse(localStorage.spotifyTokens)
      let config = {
        headers: {
          'Authorization': 'Bearer ' + spotifyTokens.access_token
        }
      }
      var self = this
      axios.post('https://api.spotify.com/v1/me/player/next', {}, config)
        .then(function (response) {
          console.log(response)
          if (response.status === 204) {
            self.nowPlaying()
            location.reload()
          } else if (response.status === 202) {
            this.device = false
          } else {
            this.nowPlaying()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    addZero (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    calculateTime () {
      if (this.device === false) {
        if (this.newProcessTrack > (this.durationTrack / 1000)) {
          this.nowPlaying()
        }
        if (this.playing === false) {
          return this.newProcessTrack
        } else {
          this.newProcessTrack = ((this.progressTrack += 1000) / 1000)
          return this.newProcessTrack
        }
      }
    },
    counter () {
      if (this.device === false) {
        setInterval(function () {
          this.calculateTime()
        }.bind(this), 1000)
      }
    }
  },
  computed: {
    progressSeconds: function () {
      var seconds = this.addZero(Math.floor(this.newProcessTrack % 60))
      var minutes = Math.floor(this.newProcessTrack / 60)
      var progress = minutes + ':' + seconds
      return progress
    },
    durationSeconds: function () {
      var seconds = this.addZero(Math.round((this.durationTrack / 1000) % 60))
      var minutes = Math.round((this.durationTrack / 1000) / 60)
      var duration = minutes + ':' + seconds
      return duration
    },
    percentageTrack: function () {
      if (this.newProcessTrack === '') {
        this.percentage = Math.round((this.progressTrack / this.durationTrack) * 100)
      } else {
        this.percentage = Math.round((this.newProcessTrack / this.durationTrack) * 100000)
      }
      return this.percentage + ' %'
    },
    progressOnLoad: function () {
      var seconds = this.addZero(Math.round((this.progressTrack / 1000) % 60))
      var minutes = Math.round((this.progressTrack / 1000) / 60)
      var duration = minutes + ':' + seconds
      return duration
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
    this.nowPlaying()
    this.counter()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.button_details_above
{
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 23px;
    color: #706B7B;

}
.cover-image h2
{
    text-align: center;
    color:rgba(112, 107, 123, 0.57);
    font-weight: bold;
    font-size: 14px;
    padding-top: 10px;
}
.cover-image
{
    width: 58%;
    margin: 0 auto;
    max-width: 300px;
    margin-bottom: 60px;
    text-align:center;
}
.cover-image img {margin-top: 40px;max-width: 300px;width: 100%;}
.cover-image h3
{
    text-align: center;
    padding-top: 10%;
    color:rgba(112, 107, 123, 0.8);
    font-weight: bold;
    font-size: 18px;
}
.player
{
    width: 90%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -55%);
    
}
.info
{
    width: 65%;
    margin: 0 auto;
    margin-top: 30px;
    overflow: hidden;
}
#timestart{float:left;margin-top: 15px;color: #8FC46B;font-weight: 600;font-size: 15px;}
#timesleft{float:right;margin-top: 15px;color: #8FC46B;font-weight: 600;font-size: 15px;}
.controls {
  width: 100%;
  height: 100px;
  background: white;
  margin-top: -1px;
  padding: 20px;
  box-sizing: border-box;
  transition: all 0.2s;
}
.controls_plays i:nth-child(2){color:#8FC46B;}
.controls_plays{width: 249px;margin: 0 auto;margin-top: 20px;}
.controls_plays i {width: 80px;margin: 0 auto;text-align:center;font-size: 23px;color:#AEACB2;}
#plays_btn, #prev_btn, #next_btn {
  cursor: pointer;
  width: 26px;
  max-width: 18px;
  transition: all 0.2s;
}
.controls_plays i:hover {
  color: #8FC46B;
}
#myProgress{
  width: 100%;
  background: #AEACB2;
  height: 2px;
}
#myBar {
  width: 1%;
  background: #8FC46B;
  height: 2px;
}
</style>