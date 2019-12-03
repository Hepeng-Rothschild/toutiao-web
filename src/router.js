import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Tabbar from '@/views/Tabbar'
import Search from '@/views/Search'
import SearchResult from '@/views/Search-result'
import Article from '@/views/Article'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: Tabbar,
    children: [{
      name: 'home',
      path: '', // 默认子路由
      component: Home
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/search/:q',
    name: 'search-result',
    component: SearchResult
  },
  {
    path: '/article/:id',
    name: 'article',
    component: Article
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
