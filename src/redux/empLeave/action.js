import {
  getListEmpLeave,
  // getListEmpDayLeave,
  getListEmpLeaveRequest,
} from 'services/axios/empLeave'

// Action type
const actions = {
  FETCH_EMP_LEAVE_DATA: 'FETCH_EMP_LEAVE_DATA',
  FETCH_EMP_DAY_OFF_DATA: 'FETCH_EMP_DAY_OFF_DATA',
  FETCH_EMP_LEAVE_REQUEST_DATA: 'FETCH_EMP_LEAVE_REQUEST_DATA',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  FETCH_EMP_LEAVE_FOR_LEAVE_TYPE: 'FETCH_EMP_LEAVE_FOR_LEAVE_TYPE',
}

// Action creaters
export const fetchEmpLeaveData = () => {
  return async (dispatch) => {
    const response = await getListEmpLeave()
    dispatch({ type: actions.FETCH_EMP_LEAVE_DATA, payload: response?.data?.data })
  }
}
// export const fetchEmpDayLeaveData = () => {
//   return async (dispatch) => {
//     const response = await getListEmpDayLeave()
//     dispatch({ type: actions.FETCH_EMP_DAY_OFF_DATA, payload: response?.data })
//   }
// }
export const fetchEmpLeaveRequestData = ({
  leaveStatus,
  skip,
  limit,
  employeeValue,
  team,
} = {}) => {
  return async (dispatch) => {
    const response = await getListEmpLeaveRequest(leaveStatus, skip, limit, employeeValue, team)
    dispatch({ type: actions.FETCH_EMP_LEAVE_REQUEST_DATA, payload: response?.data?.data })
  }
}
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}

export default actions
