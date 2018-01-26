<template>
      <div id="nav-app" class="animated fadeIn">
            <nav v-bind:class="active" v-on:click.prevent>
                <router-link to="/" class="home" v-on:click="makeActive('home')"><i class="fa fa-home" aria-hidden="true"></i>Home</router-link>
                <router-link to="/now-playing" class="playing" v-on:click="makeActive('playing')"><i class="fa fa-headphones" aria-hidden="true"></i>Now-playing</router-link>
                <router-link to="/profile" class="Profile" v-on:click="makeActive('Profile')"><i class="fa fa-user" aria-hidden="true"></i>Profile</router-link>
            </nav>
        </div>  
</template>
<style>
nav{
    position: fixed;
    z-index: 999;
    bottom: 0;
    width: 100%;
	background:#8FC46B;
}
nav a{
	display:block;
    float:left;
	width: 33.333%;
	font-size:16px;
    height: 50px;
    line-height: 50px;
	text-decoration:none;
    text-align: center;
	background-color:transparent;
	-webkit-transition:background-color 0.25s;
	-moz-transition:background-color 0.25s;
	transition:background-color 0.25s;
    color:white;
    font-size:  15px;
    font-weight: 600;
    opacity: 0.6;
}
nav a i 
{
    display:block;
    color: white;
    font-size: 17px;
    margin-right: 3%;
    color:white;
    opacity: 0.6;
}
.router-link-exact-active, .router-link-exact-active i {opacity: 1;}
</style>
<script>
export default {
  name: 'Navigation',
  data () {
    return {
      active: ''
    }
  },
  methods: {
    makeActive: function (item) {
      this.active = item
    }
  }
}
</script>