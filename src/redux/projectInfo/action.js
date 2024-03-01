import { getAllProjectInfoList, getTeamForEmp } from 'services/axios/projectManagement'
import { getMasterGlobalTypeList } from 'services/axios/config'

export const actions = {
  GET_PROJECT_INFO_LIST: 'GET_PROJECT_INFO_LIST',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  GET_PROJECT_LIST: ' GET_PROJECT_LIST',
  HANDLE_BILLING_TYPE: 'HANDLE_BILLING_TYPE',
  HANDLE_TECHNOLOGY: 'HANDLE_TECHNOLOGY',
  HANDLE_PROJECT_ROLE: ' HANDLE_PROJECT_ROLE',
  HANDLE_SEARCH_PROJECT: 'HANDLE_SEARCH_PROJECT',
  HANDLE_PROJECT_STATUS: 'HANDLE_PROJECT_STATUS',
  GET_TEAM_MEMBER: 'GET_TEAM_MEMBER',
}

export const getAllProjectInfo = ({ skip, limit, searchedProject }) => {
  return async (dispatch) => {
    const response = await getAllProjectInfoList({ skip, limit, searchedProject })
    dispatch({
      type: actions.GET_PROJECT_INFO_LIST,
      payload: {
        projectInfoList: response?.data?.data?.projectInfo?.rows,
        totalCount: response?.data?.data?.totalCount,
      },
    })
  }
}

export const handleSearchProject = (searchedProject) => {
  return {
    type: 'HANDLE_SEARCH_PROJECT',
    searchedProject,
  }
}
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}

export const handleProjectList = (projectList) => {
  return {
    type: actions.GET_PROJECT_LIST,
    payload: projectList,
  }
}

export const getProjectBillingType = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('billing_type')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const billingType = response?.data?.data
      dispatch({
        type: actions.HANDLE_BILLING_TYPE,
        payload: billingType,
      })
    }
  }
}

export const getTech = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('technology')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const technologies = response?.data?.data
      dispatch({
        type: actions.HANDLE_TECHNOLOGY,
        payload: technologies,
      })
    }
  }
}

export const getEmployeeProjectRole = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('employee_project_role')
    if (response?.status === 200 && response?.data?.data?.length > 0) {
      const projectRole = response?.data?.data
      dispatch({
        type: actions.HANDLE_PROJECT_ROLE,
        payload: projectRole,
      })
    }
  }
}

export const getProjectStatus = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('project_status')

    if (response?.status === 200 && response?.data?.data?.length > 0) {
      dispatch({
        type: actions.HANDLE_PROJECT_STATUS,
        payload: {
          projectInfo: response?.data?.data?.projectInfo?.projectInfo,
        },
      })
    }
  }
}

export const getTeamForSelectedEmployee = (userId) => {
  return async (dispatch) => {
    const response = await getTeamForEmp(userId)
    dispatch({
      type: actions.GET_TEAM_MEMBER,
      payload: response?.data?.data,
    })
  }
}
