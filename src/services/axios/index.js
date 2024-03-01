import { notification } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
import { getLoggedInUserInfo } from 'utils'
import NProgress from 'nprogress'
import { store } from 'index'
import { toggleLoading } from 'redux/settings/actions'

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_DEV_BASE_URL
      : process.env.REACT_APP_PROD_BASE_URL,
})

apiClient.interceptors.request.use((request) => {
  const accessToken = Cookies.get('accessToken')
  const userId = getLoggedInUserInfo()?.userId

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.userId = userId
  }
  store.dispatch(toggleLoading({ isLoading: true }))
  NProgress.start()
  return request
})
// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (response?.data?.status === false) {
      notification.error({
        message: 'Error',
        description: response?.data?.message,
      })
    }
    store.dispatch(toggleLoading({ isLoading: false }))
    NProgress.done()
    // Do something with response data
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const statusCode = error?.response?.status.toString()
    if (statusCode?.startsWith(5)) {
      notification.error({
        message: 'Error',
        description: 'Please contact the administrator',
      })
    } else if (statusCode?.startsWith(4)) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    } else {
      notification.error({
        message: 'Error',
        description: 'Something went wrong',
      })
    }
    store.dispatch(toggleLoading({ isLoading: false }))
    NProgress.done()
    return error
  },
)

export default apiClient
