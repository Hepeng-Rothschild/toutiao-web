import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
import router from 'router.js'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
// 重新封装一个请求，这样不会走request请求
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
// 配置不使用axios,默认json.parse去处理后端响应回来的json字符串
request.defaults.transformResponse = [(data) => {
  try {
    return JSONBig.parse(data)
  } catch (e) {
    return data
  }
}]
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const {
    user
  } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data
  return response

  // 如果响应结果对象中有 data，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data，则不作任何处理，直接原样返回这个数据
  // return response.data.data || response.data
}, async function (error) {
  const {
    user
  } = store.state
  // Do something with response error
  if (error.response && error.response.status === 401) {
    // 是否有refresh_token,如果没有直接跳转到登录页
    if (!user || !user.refresh_token) {
      // 在js模块中获取当前路由对象
      // 如果是a页面 ，那么currentRoute 就是a页面的$route
      // 如果是n页面，那么currentRoute 就是n页面$route 
      router.push({
        name: 'login',
        query:{
          redirect: router.currentRoute.fullPath
        }
      })
    } else {
      // 如果有，请求获取新的token，存储到容器中
      const {
        data
      } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer${user.refresh_token}`
        }
      })
      // 将请求到的新的token更新到容器中
      store.commit('setUser', {
        token: data.data.token,
        refresh_token: user.refresh_token
      })
      // 把原来的请求继续发出去 
      return request(error.config)
    }

  }
  return Promise.reject(error)
})
export default request
