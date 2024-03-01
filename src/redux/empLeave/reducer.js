import actions from './action'

const initialState = {
  data: [],
  dayOffData: [],
  pagination: {
    skip: 0,
    limit: 10,
  },
  annual_leave: [],
  work_from_home: [],
  earn_leave: [],
}

const fetchEmpLeaveData = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_EMP_LEAVE_DATA:
      return {
        ...state,
        data: action.payload?.leaveResult,
        dayOffData: {
          regularLeave: action.payload?.regularLeave,
          workFromHomeLeave: action.payload?.workFromHomeLeave,
        },
      }
    // case actions.FETCH_EMP_DAY_OFF_DATA:
    //   return {
    //     ...state,
    //     dayOffdata: action.payload,
    //   }
    case actions.FETCH_EMP_LEAVE_REQUEST_DATA:
      return {
        ...state,
        leaveRequestData: action.payload,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.FETCH_EMP_LEAVE_FOR_LEAVE_TYPE: {
      if (action.payload && action.payload.length > 0) {
        const { leaveType } = action.payload[0]
        return {
          ...state,
          [leaveType]: action.payload,
        }
      }
      return state
    }
    default:
      return state
  }
}

export default fetchEmpLeaveData
