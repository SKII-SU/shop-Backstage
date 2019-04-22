import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/home.vue'
Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

router.beforeEach(function(to, from, next) {
  if (window.sessionStorage.getItem('token') === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
