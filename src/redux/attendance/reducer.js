import { actions } from './action'

const initialState = {
  isOpen: false,
  newRecord: [],
  empAttendance: [],
  singleAttendance: [],
  totalCount: null,
  loading: false,
  year: new Date().getFullYear(),
  pagination: {
    skip: 0,
    limit: 10,
  },
}

const attendanceData = (state = initialState, action) => {
  switch (action.type) {
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.HANDEL_NEWRECORD:
      return {
        ...state,
        newRecord: action.payload,
      }
    case actions.HANDLE_ISOPEN:
      return {
        ...state,
        isOpen: action.payload,
      }
    case actions.HANDEL_YEAR:
      return {
        ...state,
        year: action.payload,
      }
    case actions.HANDLE_EMPLOYEE_ATTENDANCE: {
      return {
        ...state,
        empAttendance: action.payload.attendanceList,
        totalCount: action.payload.totalCount,
      }
    }
    case actions.HANDEL_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case actions.HANDLE_COUNT:
      return {
        ...state,
        totalCount: action.payload,
      }
    case actions.HANDLE_SINGLE_EMP_ATTENDANCE:
      return {
        ...state,
        singleAttendance: action.payload,
      }
    default:
      return state
  }
}

export default attendanceData
