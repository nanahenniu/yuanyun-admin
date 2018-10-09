/* ********************* request 全局配置文档 ************************/
import Vue from 'vue'
import axios from 'axios'
// import router from '../router'
import qs from 'qs'
import { Toast } from 'vant'

// 请求错误处理 注意根据具体的服务器端设置，此处仅仅是个示例
const errorFn = err => {
  console.log(err.toString())
  if (err.toString().indexOf('timeout') !== -1) {
    Toast('请求超时，请稍后再试')
  }
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 501:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 502:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 503:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 504:
        err.message = '服务器开个小差，请稍后再试'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
        err.message = '请求失败，请稍后再试'
    }
    Vue.prototype.$message.error(err.message)
  }
  return Promise.reject(err)
}
/* ***此处开始封装不同后台下的axios实例 ****/

const $axios = axios.create({
  headers: {
  },
  // baseURL: BASE_URL,
  timeout: 30000
})
$axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    if (process.env.NODE_ENV === 'development') {
      // 这里一个token，你需要在这里取到你设置好的token的值
      // const token = localStorage['X-LONGCHAT-Token']
      // const token = '5cc915c437c43fb8129c2437db72d734'
      // if (token) {
      //   // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      //   config.headers = {
      // 'token': token
      // 'User-Agent': navigator.userAgent
      // }
      // }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
$axios.interceptors.response.use(
  response => {
    // 如果状态码是ES7008，表示token失效，则直接跳转到登录页面
    if (response.data.error_code === 5002) {
      Toast(response.data.error_msg)
      // setTimeout(function () {
      //   router.replace({
      //     path: '/login'
      //   })
      // }, 1500)
      // window.location.href = 'http://mjwhqt.hjw988.com/api/login'
    } else {
      return response
    }
  }, errorFn
)
Vue.prototype.$axios = $axios
