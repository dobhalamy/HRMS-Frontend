import { getMasterGlobalTypeList } from 'services/axios/config'
import { getModulePermission } from 'services/axios/modulePermissions'

export const actions = {
  GET_MODULES_LIST: 'GET_MODULES_LIST',
  GET_PERMISSIONS: 'GET_PERMISSIONS',
  GET_ALL_MODULE_PERMISSION_LIST: 'GET_ALL_MODULE_PERMISSION_LIST',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
}

export const getModulesList = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('modules')
    dispatch({
      type: actions.GET_MODULES_LIST,
      payload: { modulesList: response?.data?.data, totalCount: response?.data?.data.length },
    })
  }
}
export const getPermissions = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('permissions')
    dispatch({
      type: actions.GET_PERMISSIONS,
      payload: response?.data?.data,
    })
  }
}
export const getAllModulePermissions = () => {
  return async (dispatch) => {
    const response = await getModulePermission()
    dispatch({
      type: actions.GET_ALL_MODULE_PERMISSION_LIST,
      payload: response?.data?.data,
    })
  }
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
