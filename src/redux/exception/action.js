import { getMasterGlobalTypeList, getNestedGlobalType } from 'services/axios/config'
import { getException, getSingleEmpException } from 'services/axios/exception'

export const actions = {
  GET_REQUEST_TYPE: 'GET_REQUEST_TYPE',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  GET_EXCEPTION: 'GET_EXCEPTION',
  HANDLE_ATTENDANCE: 'HANDLE_ATTENDANCE',
  HANDLE_STATUS: 'HANDLE_STATUS',
}

// Action creators
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}

export const getRequestType = (globalTypeCategory) => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList(globalTypeCategory)
    dispatch({ type: actions.GET_REQUEST_TYPE, payload: response?.data?.data })
  }
}
export const handleStatus = (status) => {
  return {
    type: 'HANDLE_STATUS',
    status,
  }
}

export const getListOfException = ({ status, skip, limit }) => {
  return async (dispatch) => {
    const response = await getException(status, skip, limit)
    if (response?.status === 200 && response?.data?.message === 'success') {
      dispatch({
        type: actions.GET_EXCEPTION,
        payload: {
          exceptionList: response?.data?.data?.expList || [],
          totalCount: response?.data?.data?.totalCount,
        },
      })
    }
  }
}
export const getExceptionListSingleEmp = ({ status, skip, limit }) => {
  return async (dispatch) => {
    const response = await getSingleEmpException(status, skip, limit)
    if (response?.status === 200 && response?.data?.message === 'success') {
      dispatch({
        type: actions.GET_EXCEPTION,
        payload: {
          exceptionList: response?.data?.data?.expList || [],
          totalCount: response?.data?.data?.totalCount,
        },
      })
    }
  }
}
export const getAttendance = (id) => {
  return async (dispatch) => {
    const response = await getNestedGlobalType(id, 'attendance')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const attendance = response?.data?.data
      dispatch({
        type: actions.HANDLE_ATTENDANCE,
        payload: attendance,
      })
    }
  }
}
