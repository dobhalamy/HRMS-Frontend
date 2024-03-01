import { getRosterList } from 'services/axios/roster'

export const actions = {
  GET_ROSTER_LIST: 'GET_ROSTER_LIST',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
}

// Action creators
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}

export const getListOfRoster = ({ skip, limit }) => {
  return async (dispatch) => {
    const response = await getRosterList(skip, limit)
    if (response?.status === 200 && response?.data?.message === 'success') {
      dispatch({
        type: actions.GET_ROSTER_LIST,
        payload: {
          rosterList: response?.data?.data?.rosterList || [],
          totalCount: response?.data?.data?.totalCount,
        },
      })
    }
  }
}
