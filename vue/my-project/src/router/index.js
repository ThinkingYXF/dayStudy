import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/pages/HelloWorld'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import First from '@/pages/first/First'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login
  },{
    path: '/modules',
    name: 'modules',
    component: Home,
    children: [{
      path: 'first',
      component: First
    },{
      path: 'test',
      component: HelloWorld
    },{
      path: '/',
      component: First
    }]
  },{
    path: '/',
    name: 'Login',
    component: Login
  }]
})
