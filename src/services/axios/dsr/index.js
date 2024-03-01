import { notification } from 'antd'
import apiClient from '../index'

export const getAllEmployeeDsr = async (params) => {
  const { skip, limit, searchText, searchedEmployee, startDate, endDate } = params
  try {
    return await apiClient.get(`employee/getAllEmployeeDsr`, {
      params: {
        skip,
        limit,
        searchText,
        searchedEmployee,
        startDate,
        endDate,
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

export const getEmployeeDsr = async (params) => {
  const { skip, limit, searchText, startDate, endDate } = params
  try {
    return await apiClient.get(`employee/get-EmployeeDsr`, {
      params: {
        skip,
        limit,
        searchText,
        startDate,
        endDate,
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

export const addEmployeeDrs = async (finalDsrData) => {
  try {
    return await apiClient.post(`employee/employeeDsr`, finalDsrData)
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
export const getProjectList = async () => {
  try {
    return await apiClient.get(`employee/projectList`)
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
