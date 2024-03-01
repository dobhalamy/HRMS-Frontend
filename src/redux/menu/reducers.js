import actions from './actions'

const initialState = {
  menuData: [],
}

export const setMenuData = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_MENU_STATE:
      return {
        ...state,
        menuData: action.payload.menuData,
      }

    default:
      return state
  }
}
