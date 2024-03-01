import {
  getMasterGlobalTypeList,
  getNestedGlobalType,
  getStaticContent,
  getPermissionsWithModules,
} from 'services/axios/config'

// Action type
const actions = {
  FETCH_MODULES: 'FETCH_MODULES',
  FETCH_ROLES: 'FETCH_ROLES',
  STATIC_CONTENT: 'STATIC_CONTENT',
  NESTED_ROLES: 'NESTED_ROLES',
}

// Action creators
export const fetchRoles = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('department')
    const permissionRoles = response?.data?.data?.filter(
      (item) => ['HR', 'IT', 'Training', 'Quality', 'Ops'].includes(item?.displayName) && item,
    )
    dispatch({ type: actions.FETCH_ROLES, payload: permissionRoles })
  }
}
export const fetchStaticContent = (title) => {
  return async (dispatch) => {
    const response = await getStaticContent(title)
    dispatch({ type: actions.STATIC_CONTENT, payload: response?.data?.data })
  }
}
export const fetchNestedRoles = (parentId = 133, globalTypeValue = 'department') => {
  return async (dispatch) => {
    const response = await getNestedGlobalType(parentId, globalTypeValue)
    const filterData = response?.data?.data?.map((ele) => ele?.GlobalType)
    dispatch({ type: actions.NESTED_ROLES, payload: filterData })
  }
}
export const fetchModulesPermissions = () => {
  return async (dispatch) => {
    const permissions = await getPermissionsWithModules()
    dispatch({ type: actions.FETCH_MODULES, payload: permissions?.data?.data })
  }
}

export default actions
