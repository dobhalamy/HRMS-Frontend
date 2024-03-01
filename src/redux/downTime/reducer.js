import { actions } from './action'

const initialState = {
  downTimeData: [],
  status: 0,
  totalCount: null,
  department: [],
  pagination: {
    skip: 0,
    limit: 10,
  },
}
const onDownTimeState = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_DOWN_TIME_LIST:
      return {
        ...state,
        downTimeData: action.payload.downTimeList,
        totalCount: action.payload.totalCount,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.GET_DEPARTMENT:
      return {
        ...state,
        department: action.payload,
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
export default onDownTimeState
