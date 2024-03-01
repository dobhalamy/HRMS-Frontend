import { getUserInfo } from 'services/axios/emp'

const actions = {
  USER_SET_STATE: 'USER_SET_STATE',
  USER_LOGIN: 'USER_SET_STATE',
  USER_REGISTER: 'USER_REGISTER',
  USER_LOAD_CURRENT_ACCOUNT: 'USER_LOAD_CURRENT_ACCOUNT',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_DETAILS: 'USER_DETAILS',
}

export const toggleLoading = (value) => {
  return {
    type: 'TOGGLE_LOADING',
    payload: value,
  }
}

export const getUserDetailedInfo = (userId) => {
  return async (dispatch) => {
    dispatch(toggleLoading(true))
    const response = await getUserInfo({ userId })
    dispatch({ type: actions.USER_DETAILS, payload: response?.data?.data })
    dispatch(toggleLoading(false))
    return response?.data?.data
  }
}

export default actions
