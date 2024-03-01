const actions = {
  SETTINGS_CHANGE_SETTING: 'SETTINGS_CHANGE_SETTING',
  SETTINGS_CHANGE_SETTING_BULK: 'settings/CHANGE_SETTING_BULK',
  SETTINGS_TOGGLE_LOADING: 'SETTINGS_TOGGLE_LOADING',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
}
export const toggleLoading = (value) => {
  return async (dispatch) => {
    dispatch({ type: actions.SETTINGS_TOGGLE_LOADING, payload: value })
  }
}
export const setPageSize = (pageSize) => {
  return async (dispatch) => {
    dispatch({ type: actions.SET_PAGE_SIZE, payload: pageSize })
  }
}
export const setCurrentPage = (currentPage) => {
  return async (dispatch) => {
    dispatch({ type: actions.SET_CURRENT_PAGE, payload: currentPage })
  }
}
export default actions
