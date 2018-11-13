import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/pages/HelloWorld'
import Modules from '@/pages/modules/Modules'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import ElementUI from '@/pages/elementUI/ElementUI'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: Login
  },{
    path: '/modules',
    name: 'modules',
    component: Modules,
    children: [{
      path: '/',
      component: Home
    },{
      path: 'elementUI',
      component: ElementUI
    },{
      path: 'test',
      component: HelloWorld
    }]
  },{
    path: '/',
    name: 'login',
    component: Login
  }]
})
