import { actions } from './action'

const initialState = {
  clientInfoData: [],
  totalCount: null,
  searchedCustomer: null,
  pagination: {
    skip: 0,
    limit: 10,
  },
}

const onClientInfoState = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_CLIENT_INFO:
      return {
        ...state,
        clientInfoData: action.payload?.clientInfo,
        totalCount: action.payload?.totalCount,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.HANDLE_SEARCH_CUSTOMER:
      return {
        ...state,
        searchedCustomer: action.searchedCustomer,
      }

    default:
      return state
  }
}

export default onClientInfoState
