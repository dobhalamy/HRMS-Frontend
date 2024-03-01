import actions from './actions'

const initialState = {
  modules: [],
  roles: [],
  nestedRoles: [],
  staticContent: [],
}

const roleAndModules = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_MODULES:
      return {
        ...state,
        modules: action.payload,
      }
    case actions.FETCH_ROLES:
      return {
        ...state,
        roles: action.payload,
      }
    case actions.STATIC_CONTENT:
      return {
        ...state,
        staticContent: action.payload,
      }
    case actions.NESTED_ROLES:
      return {
        ...state,
        nestedRoles: action.payload,
      }
    default:
      return state
  }
}

export default roleAndModules
