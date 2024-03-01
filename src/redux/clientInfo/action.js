import { getAllClientInfoList } from 'services/axios/clientManagement'

export const actions = {
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  GET_CLIENT_INFO: 'GET_CLIENT_INFO',
  HANDLE_SEARCH_CUSTOMER: 'HANDLE_SEARCH_CUSTOMER',
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
export const handleSearchCustomer = (searchedCustomer) => {
  return {
    type: 'HANDLE_SEARCH_CUSTOMER',
    searchedCustomer,
  }
}

export const getAllClientInfo = ({ skip, limit, searchedCustomer }) => {
  return async (dispatch) => {
    const response = await getAllClientInfoList({ skip, limit, searchedCustomer })
    if (Array.isArray(response?.data?.data?.clientInfo)) {
      dispatch({
        type: actions.GET_CLIENT_INFO,
        payload: {
          clientInfo: response?.data?.data?.clientInfo,
          totalCount: response?.data?.data?.totalCount,
        },
      })
    } else {
      dispatch({
        type: actions.GET_CLIENT_INFO,
        payload: {
          clientInfo: response?.data?.data?.clientInfo?.rows,
          totalCount: response?.data?.data?.totalCount,
        },
      })
    }
  }
}
