import { getDownTime } from 'services/axios/downTime'
import { getMasterGlobalTypeList } from 'services/axios/config'

export const actions = {
  GET_DOWN_TIME_LIST: 'GET_DOWN_TIME_LIST',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  GET_DEPARTMENT: 'GET_DEPARTMENT',
  HANDLE_STATUS: 'HANDLE_STATUS',
}

export const getDownTimeList = ({ status, skip, limit }) => {
  return async (dispatch) => {
    const response = await getDownTime({ status, skip, limit })
    dispatch({
      type: actions.GET_DOWN_TIME_LIST,
      payload: {
        downTimeList: response?.data?.data,
        totalCount: response?.data?.data?.totalCount,
      },
    })
  }
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
export const handleStatus = (status) => {
  return {
    type: 'HANDLE_STATUS',
    status,
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
