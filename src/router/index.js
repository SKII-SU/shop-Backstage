import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import user from '../components/user.vue'
import rights from '../components/rights.vue'
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
      component: Home,
      redirect: '/wecome',
      children: [
        { path: '/wecome', component: Welcome },
        { path: '/rights', component: rights },
        { path: '/users', component: user }
      ]
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
