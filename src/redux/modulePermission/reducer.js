import { actions } from './action'

const initialState = {
  modulesList: [],
  permissionsList: [],
  modulePermissionList: [],
  totalCount: 0,
  pagination: {
    skip: 0,
    limit: 10,
  },
}
const onModulePermissionState = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MODULES_LIST:
      return {
        ...state,
        modulesList: action.payload.modulesList,
        totalCount: action.payload.totalCount,
      }
    case actions.GET_PERMISSIONS:
      return {
        ...state,
        permissionsList: action.payload,
      }
    case actions.GET_ALL_MODULE_PERMISSION_LIST:
      return {
        ...state,
        modulePermissionList: action.payload,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }

    default:
      return state
  }
}
export default onModulePermissionState
