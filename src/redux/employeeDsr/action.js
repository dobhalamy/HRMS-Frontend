import { getListOfEmployee } from 'services/axios/emp'
import { getProjectList } from 'services/axios/dsr'

export const actions = {
  HANDLE_SEARCH_TEXT: 'HANDLE_SEARCH_TEXT',
  HANDLE_SEARCH_EMPLOYEE: 'HANDLE_SEARCH_EMPLOYEE',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  HANDLE_START_DATE: 'HANDLE_START_DATE',
  GET_EMP_LIST: 'GET_EMP_LIST',
  HANDLE_END_DATE: 'HANDLE_END_DATE',
  HANDLE_LOADING: 'HANDLE_LOADING',
  HANDLE_DSR_TABLE_DATA: 'HANDLE_DSR_TABLE_DATA',
  HANDLE_DSR_TABLE_TOTAL_COUNT: 'HANDLE_DSR_TABLE_TOTAL_COUNT',
  HANDLE_PROJECTSNAME: 'HANDLE_PROJECTSNAME',
}

export const getEmployeeList = ({ skip, limit }) => {
  return async (dispatch) => {
    const response = await getListOfEmployee({ skip, limit })
    dispatch({ type: actions.GET_EMP_LIST, payload: response?.data?.data })
  }
}
export const projectList = () => {
  return async (dispatch) => {
    const response = await getProjectList()
    dispatch({ type: actions.HANDLE_PROJECTSNAME, payload: response?.data?.data })
  }
}
export const handleSearchEmployee = (SearchedEmployee) => {
  return {
    type: 'HANDLE_SEARCH_EMPLOYEE',
    SearchedEmployee,
  }
}
export const handleSearchText = (searchText) => {
  return {
    type: 'HANDLE_SEARCH_TEXT',
    searchText,
  }
}
export const handleStartDate = (startDate) => {
  return {
    type: 'HANDLE_START_DATE',
    startDate,
  }
}
export const handleDsrTableData = (dsrTableData) => {
  return {
    type: 'HANDLE_DSR_TABLE_DATA',
    dsrTableData,
  }
}
export const handleDsrTableTotalCount = (totalCount) => {
  return {
    type: 'HANDLE_DSR_TABLE_TOTAL_COUNT',
    totalCount,
  }
}
export const handleEndDate = (endDate) => {
  return {
    type: 'HANDLE_END_DATE',
    endDate,
  }
}
export const handleLoading = (loading) => {
  return {
    type: 'HANDLE_LOADING',
    loading,
  }
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
