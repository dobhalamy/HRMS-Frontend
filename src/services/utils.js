import Cookies from 'js-cookie'
import { history, store as reduxStore } from 'index'
import store from 'store'
import qs from 'qs'

export const getConfig = () => {
  const token = Cookies.get('accessToken')
  if (token) {
    return {
      headers: { Authorization: `${token}` },
    }
  }
  return null
}
export const isUserLoggedIn = () => !!Cookies.get('accessToken')

export function SETUP() {
  // load settings from url on app load
  const changeSettings = (search) => {
    const query = qs.parse(search, { ignoreQueryPrefix: true })
    Object.keys(query).forEach((key) => {
      let value
      switch (query[key]) {
        case 'false':
          value = false
          break
        case 'true':
          value = true
          break
        default:
          value = query[key]
          break
      }
      reduxStore.dispatch({
        type: 'SETTINGS_CHANGE_SETTING',
        payload: {
          setting: key,
          value,
        },
      })
    })
  }
  changeSettings(history.location.search)
  history.listen((params) => {
    const { search } = params
    changeSettings(search)
  })

  // detect isMobileView setting on app load and window resize
  const isMobileView = (load = false) => {
    const currentState = global.window.innerWidth < 768
    const prevState = store.get('app.settings.isMobileView')
    if (currentState !== prevState || load) {
      reduxStore.dispatch({
        type: 'SETTINGS_CHANGE_SETTING',
        payload: {
          setting: 'isMobileView',
          value: currentState,
        },
      })
    }
  }

  // detect viewport width on app load and window resize
  const isMenuToggled = () => {
    const shouldToggle = global.window.innerWidth < 1024
    const prevState = store.get('app.settings.isMenuCollapsed')
    if (shouldToggle || prevState) {
      reduxStore.dispatch({
        type: 'SETTINGS_CHANGE_SETTING',
        payload: {
          setting: 'isMenuCollapsed',
          value: true,
        },
      })
    }
  }

  isMobileView(true)
  isMenuToggled()
  window.addEventListener('resize', () => {
    isMobileView()
    isMenuToggled()
  })
}
