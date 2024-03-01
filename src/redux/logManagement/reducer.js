import { actions } from './actions'

const initialState = {
  logs: [],
  logData: {},
  totalCount: null,
  pagination: {
    skip: 0,
    limit: 10,
  },
}
const onLogsState = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_LOG_LIST:
      return {
        ...state,
        logs: action.payload?.logs,
        // totalCount: action.payload?.totalCount,
      }
    case actions.GET_SINGLE_LOG_DATA:
      return {
        ...state,
        logData: action.payload,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    default:
      return state
  }
}
export default onLogsState
