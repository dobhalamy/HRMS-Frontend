import { getAllLogList } from 'services/axios/logManagement'

export const actions = {
  GET_LOG_LIST: 'GET_LOG_LIST',
  GET_SINGLE_LOG_DATA: 'GET_SINGLE_LOG_DATA',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
}

export const getAllLog = () => {
  return async (dispatch) => {
    const response = await getAllLogList()
    dispatch({
      type: actions.GET_LOG_LIST,
      payload: {
        logs: response?.data?.logs,
        // totalCount: response?.data?.totalCount,
      },
    })
  }
}

export const getLogData = (logData) => {
  return {
    type: 'GET_SINGLE_LOG_DATA',
    payload: logData,
  }
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
