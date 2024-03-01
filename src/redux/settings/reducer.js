import store from 'store'
import actions from './actions'

const STORED_SETTINGS = (storedSettings) => {
  const settings = {}
  Object.keys(storedSettings).forEach((key) => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    // Read docs for available values: https://docs.visualbuilder.cloud
    // VB:REPLACE-START:SETTINGS
    authProvider: 'jwt',
    logo: 'Value Portal',
    version: 'Decoding desire',
    theme: 'default',
    locale: 'en-US',
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    isPreselectedOpen: false,
    preselectedVariant: 'default',
    menuLayoutType: 'left',
    routerAnimation: 'slide-fadein-up',
    menuColor: 'gray',
    authPagesColor: 'gray',
    isAuthTopbar: true,
    primaryColor: '#4b7cf3',
    leftMenuWidth: 256,
    isMenuUnfixed: false,
    isMenuShadow: false,
    isTopbarFixed: false,
    isTopbarSeparated: false,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: false,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
    layoutMenu: 'classic',
    layoutTopbar: 'v1',
    layoutBreadcrumbs: 'v1',
    layoutFooter: 'v1',
    flyoutMenuType: 'flyout',
    flyoutMenuColor: 'blue',
  }),
  isLoading: false,
  currentPage: 1,
  pageSize: 10,
}

export const changeSettings = (state = initialState, action) => {
  if (action?.payload) {
    const {
      payload: { setting, value },
    } = action
    const settings = {}
    switch (action.type) {
      case actions.SETTINGS_CHANGE_SETTING:
        store.set(`app.settings.${setting}`, value)
        return { ...state, [setting]: value }
      case action.SETTINGS_CHANGE_SETTING_BULK:
        Object.keys(action.payload).forEach((key) => {
          store.set(`app.settings.${key}`, action.payload[key])
          settings[key] = action.payload[key]
        })
        return {
          ...state,
          ...settings,
        }
      case actions.SETTINGS_TOGGLE_LOADING:
        return { ...state, ...action.payload }
      case actions.SET_PAGE_SIZE:
        return {
          ...state,
          pageSize: action.payload,
        }
      case actions.SET_CURRENT_PAGE:
        return {
          ...state,
          currentPage: action.payload,
        }
      default:
        return state
    }
  }
  return state
}
