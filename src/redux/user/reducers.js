// import { getLoggedInUserInfo } from 'utils'
import actions from './actions'

const initialState = {
  avatar: '',
  authorized: true,
  userInfo: {},
  userDetailedInfo: {},
  isLoading: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.USER_SET_STATE:
      return {
        ...state,
        ...action.payload,
      }
    case actions.USER_DETAILS:
      return {
        ...state,
        userDetailedInfo: action.payload,
      }

    default:
      return state
  }
}
