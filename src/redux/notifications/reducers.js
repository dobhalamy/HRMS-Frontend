import { actions } from './action'

const initialState = {
  notifications: null,
}

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      }
    default:
      return state
  }
}
export default notificationsReducer
