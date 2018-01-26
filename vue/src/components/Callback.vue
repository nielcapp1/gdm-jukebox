<template>
  <div class="callback animated fadeIn">
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'callback',
  data () {
    return {
      client_id: '0564053a9afb4f3ebe7ced5019e40fb8',
      client_secret: '25c970866d194c38844092f4334486ed',
      redirect_uri: 'http://localhost:8080/callback'
    }
  },
  methods: {
    callback (response) {
      var code = this.$route.query.code || null
      var config = {
        headers: {
          'Authorization': 'Basic MDU2NDA1M2E5YWZiNGYzZWJlN2NlZDUwMTllNDBmYjg6MjVjOTcwODY2ZDE5NGMzODg0NDA5MmY0MzM0NDg2ZWQ='
        },
        json: true
      }
      var params = new URLSearchParams()
      params.append('code', code)
      params.append('redirect_uri', this.redirect_uri)
      params.append('grant_type', 'authorization_code')
      axios.post('https://accounts.spotify.com/api/token', params, config)
        .then(function (response) {
          var spotifyTokens = JSON.stringify(response.data)
          localStorage.setItem('spotifyTokens', spotifyTokens)
          var config = {
            headers: { 'Authorization': 'Bearer ' + response.data.access_token },
            json: true
          }
          axios.get('https://api.spotify.com/v1/me', config)
            .then(function (response) {
              console.log(response)
              var currentUser = JSON.stringify(response.data)
              localStorage.setItem('currentUser', currentUser)
              window.location.replace('http://localhost:8080')
            })
            .catch(function (error) {
              console.log(error)
            })
        })
        .catch(function (error) {
          console.log(error)
          window.location.replace('http://localhost:8080/callback/#invalid_token')
        })
    }
  },
  mounted: function () {
    this.callback()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
