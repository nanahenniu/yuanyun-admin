/* ********************* request 全局配置文档 ************************/
import Vue from 'vue'
import axios from 'axios'
// import router from '../router'
import qs from 'qs'
import { Message } from 'element-ui';

// 请求错误处理 注意根据具体的服务器端设置，此处仅仅是个示例
const errorFn = err => {
  console.log(err.toString())
  if (err.toString().indexOf('timeout') !== -1) {
      Message.error('请求超时，请稍后再试')
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

    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
$axios.interceptors.response.use(
  response => {
    // 如果状态码是1002，表示该用户在其他设备登录，则直接跳转到登录页面
    // 如果状态码是1019，表示该用户token失效，则直接跳转到登录页面
    // 如果状态码是1003，表示该用户被冻结，则直接跳转到登录页面
    if (response.data.error_code === 1002 || response.data.error_code === 1019 || response.data.error_code === 1003) {
      Message.error(response.data.error_msg)
      setTimeout(function () {
          window.location.href = 'http://meijinht.benxiong.org.cn/login'
          // window.location.href = 'http://localhost:8080/login'
      }, 1500)
    } else if (response.data.error_code === 1011 || response.data.error_code === 1012 || response.data.error_code === 2007) {
        Message.error(response.data.error_msg)
    } else {
      return response
    }
  }, errorFn
)
Vue.prototype.$axios = $axios
