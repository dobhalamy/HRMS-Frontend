import { getAllAttendance, getEmpAttendance } from 'services/axios/attendance'

export const actions = {
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  HANDLE_ISOPEN: 'HANDEL_IS_OPEN',
  HANDEL_NEWRECORD: 'HANDEL_NEW_RECORD',
  HANDEL_YEAR: 'HANDEL_YEAR',
  HANDLE_EMPLOYEE_ATTENDANCE: 'HANDLE_EMP_ATTENDANCE',
  HANDEL_LOADING: 'HANDEL_LOADING',
  HANDEL_COUNT: 'HANDEL_TOTAL_COUNT',
  HANDLE_SINGLE_EMP_ATTENDANCE: 'HANDLE_SINGLE_EMPLOYEE_ATTENDANCE',
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}

export const handleIsOpen = (isOpen) => {
  return {
    type: 'HANDEL_IS_OPEN',
    payload: isOpen,
  }
}
export const handelNewRecord = (newRecord) => {
  return {
    type: 'HANDEL_NEW_RECORD',
    payload: newRecord,
  }
}
export const handleYear = (year) => {
  return {
    type: 'HANDEL_YEAR',
    payload: year,
  }
}
export const handelLoading = (loading) => {
  return {
    type: 'HANDEL_LOADING',
    payload: loading,
  }
}
export const allEmpAttendance = ({ skip, limit, year }) => {
  return async (dispatch) => {
    dispatch(handelLoading(true))
    const response = await getAllAttendance({ skip, limit, year })
    if (response?.status === 200 && response?.data?.message === 'success') {
      dispatch({
        type: actions.HANDLE_EMPLOYEE_ATTENDANCE,
        payload: {
          attendanceList: response?.data?.data?.attendanceList,
          totalCount: response?.data?.data?.totalCount,
        },
      })
    }
    dispatch(handelLoading(false))
  }
}
export const singleEmpAttendance = (year) => {
  return async (dispatch) => {
    const response = await getEmpAttendance(year)
    if (response?.status === 200 && response?.data?.statusCode === 200) {
      dispatch({
        type: actions.HANDLE_SINGLE_EMP_ATTENDANCE,
        payload: response?.data?.data?.data || [],
      })
    }
  }
}
