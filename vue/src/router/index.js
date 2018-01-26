import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Callback from '@/components/Callback'
import PlaylistDetails from '@/components/PlaylistDetails'
import NowPlaying from '@/components/NowPlaying'
import Profile from '@/components/Profile'
// import RefreshToken from '@/components/RefreshToken'

Vue.use(Router)

const router = new Router({
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
      component: PlaylistDetails,
      meta: { requiresAuth: true }
    },
    {
      path: '/now-playing',
      name: 'NowPlaying',
      component: NowPlaying,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
