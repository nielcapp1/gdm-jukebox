<template>
  <div class="profile">
    <h1>Profiel</h1>
    <img width="100" :src="profilePicture">
    <p>Naam: {{ currentUser.display_name }}</p>
    <p>Type account: {{ currentUser.product }}</p>
    <p>Naam: {{ currentUser.display_name }}</p>
    <p>Type account: {{ currentUser.product }}</p>
    <p>Aantal volgers: {{ totalFollowers }}</p>
  </div>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      currentUser: '',
      profilePicture: '',
      totalFollowers: ''
    }
  },
  methods: {
    checkIfAuthenticated: function () {
      if (localStorage.currentUser !== undefined) {
        this.currentUser = JSON.parse(localStorage.currentUser)
        this.profilePicture = this.currentUser.images[0].url
        this.totalFollowers = this.currentUser.followers.total
        this.status = true
        console.log(this.currentUser)
      }
    },
    logout () {
      localStorage.clear()
      location.reload()
    }
  },
  mounted: function () {
    this.checkIfAuthenticated()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
