import { actions } from './action'

const initialState = {
  requestType: [],
  exceptionList: [],
  attendance: [],
  status: 0,
  totalCount: 0,
  pagination: {
    skip: 0,
    limit: 10,
  },
}

const exception = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_REQUEST_TYPE:
      return {
        ...state,
        requestType: action.payload,
      }
    case actions.GET_EXCEPTION:
      return {
        ...state,
        exceptionList: action.payload.exceptionList,
        totalCount: action.payload.totalCount,
      }
    case actions.HANDLE_ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.HANDLE_STATUS:
      return {
        ...state,
        status: action.status,
      }
    default:
      return state
  }
}

export default exception
