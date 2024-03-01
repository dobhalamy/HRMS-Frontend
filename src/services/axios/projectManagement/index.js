import { notification } from 'antd'
import ApiEndPoints from 'utils'
import apiClient from '../index'

export const addNewProject = async (projectData) => {
  try {
    return await apiClient.post('projectInfo', projectData)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}
export const fetchNewProjectId = async () => {
  try {
    return await apiClient.get('projectInfo/getNewProjectId')
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}

export const getAllProjectInfoList = async (params) => {
  const { skip, limit, searchedProject } = params
  try {
    return await apiClient.get(`projectInfo`, {
      params: {
        skip,
        limit,
        searchedProject,
      },
    })
  } catch (error) {
    if (error) {
      notification.error({
        message: error?.message,
      })
    }
  }
  return null
}

export const updateProjectInfo = async (data) => {
  try {
    return await apiClient.patch(`projectInfo`, data)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}

export const assignEmployee = async (data) => {
  try {
    return await apiClient.post('projectInfo/assign', data)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}

export const getPoForSelectedEmployee = async (userId) => {
  try {
    const res = await apiClient.get(`${ApiEndPoints.EMPLOYEE_PO}/${userId}`)
    // const empPos = res?.data?.data?.po?.map((data) => data?.userId)
    const empPos = res?.data?.data?.poArray
    return empPos
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}
export const getTeamForEmp = async (userId) => {
  try {
    const res = await apiClient.get(`${ApiEndPoints.EMPLOYEE_TEAM}/${userId}`)
    return res
    // const empTeam = res?.data?.data?.teamArray
    // return empTeam
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}
