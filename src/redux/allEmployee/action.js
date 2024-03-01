import { getListOfTrainee, getListOfEmployee, getListOfTraineeHistory } from 'services/axios/emp'
import { getMasterGlobalTypeList, getNestedGlobalType } from 'services/axios/config'

export const actions = {
  TOGGLE_SWITCH: 'TOGGLE_SWITCH',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  GET_EMP_LIST: 'GET_EMP_LIST',
  GET_TRAINEE_LIST: 'GET_TRAINEE_LIST',
  GET_TRAINEE_HISTORY: 'GET_TRAINEE_HISTORY',
  GET_TRAINER_LIST: 'GET_TRAINER_LIST',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  HANDLE_DOC_TYPE: 'HANDLE_DOC_TYPE',
  HANDLE_EMP_DESIGNATION: 'EMP_DESIGNATION',
  HANDLE_USER_ROLE: 'USER_ROLE',
  HANDLE_USER_PROCESS: 'HANDLE_USER_PROCESS',
  GET_DEPARTMENT: 'GET_DEPARTMENT',
  GET_USER_INFO: 'GET_USER_INFO',
}

export const toggle = (onChange) => {
  return {
    type: 'TOGGLE_SWITCH',
    payload: onChange,
  }
}
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
export const toggleLoading = (value) => {
  return {
    type: 'TOGGLE_LOADING',
    payload: value,
  }
}
export const handleEmpList = (empList) => {
  return {
    type: 'GET_EMP_LIST',
    payload: empList,
  }
}
export const getEmployeeList = ({ skip, limit, userRole = null }) => {
  return async (dispatch) => {
    dispatch(toggleLoading(true))
    const response = await getListOfEmployee({ skip, limit, userRole })
    dispatch({ type: actions.GET_EMP_LIST, payload: response?.data?.data })
    dispatch(toggleLoading(false))
  }
}
export const getTraineeList = ({ status, skip, limit, employeeName }) => {
  return async (dispatch) => {
    dispatch(toggleLoading(true))
    const response = await getListOfTrainee({ status, skip, limit, employeeName })
    dispatch({ type: actions.GET_TRAINEE_LIST, payload: response?.data?.data })
    dispatch(toggleLoading(false))
  }
}
export const getTraineeHistory = ({ skip, limit, userId }) => {
  return async (dispatch) => {
    const response = await getListOfTraineeHistory({ skip, limit, userId })
    dispatch({ type: actions.GET_TRAINEE_HISTORY, payload: response?.data?.data })
  }
}

export const getEmpDesignation = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('designation')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const designation = response?.data?.data
      dispatch({
        type: actions.HANDLE_EMP_DESIGNATION,
        payload: designation,
      })
    }
  }
}
export const getDocumentType = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('document_type')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const docType = response?.data?.data
      dispatch({
        type: actions.HANDLE_DOC_TYPE,
        payload: docType,
      })
    }
  }
}
export const getEmpRole = (depId) => {
  return async (dispatch) => {
    const response = await getNestedGlobalType(depId, 'user_role')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const role = response?.data?.data
      dispatch({
        type: actions.HANDLE_USER_ROLE,
        payload: role,
      })
    }
  }
}
export const getEmpProcess = (depId) => {
  return async (dispatch) => {
    const response = await getNestedGlobalType(depId, 'process')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const process = response?.data?.data
      dispatch({
        type: actions.HANDLE_USER_PROCESS,
        payload: process,
      })
    }
  }
}
export const getDep = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('department')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const department = response?.data?.data
      dispatch({
        type: actions.GET_DEPARTMENT,
        payload: department,
      })
    }
  }
}
