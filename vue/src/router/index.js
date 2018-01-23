import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Callback from '@/components/Callback'
import PlaylistDetails from '@/components/PlaylistDetails'
// import RefreshToken from '@/components/RefreshToken'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    {
      path: '/playlist/:playlistId',
      name: 'PlaylistDetails',
      component: PlaylistDetails
    }
    // {
    //   path: '/refresh_token',
    //   name: 'RefreshToken',
    //   component: RefreshToken
    // }
  ]
})
