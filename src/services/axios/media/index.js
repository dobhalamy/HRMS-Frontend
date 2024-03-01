import { notification } from 'antd'
import { getLoggedInUserInfo } from 'utils'
import apiClient from '../index'

export const uploadDocument = (data) => apiClient.post('media', data)
export const updateDocument = (data) => apiClient.patch('media/updateMedia', data)
export const uploadAprExcel = (data) => apiClient.post('attendance/uploadApr', data)
export const uploadAttendanceExcel = (data) => apiClient.post('attendance/markAttendance', data)
export const getMonthAttendance = (month, year, userId) =>
  apiClient.get(`attendance/getAttendanceByMonth?userId=${userId}&month=${month}&year=${year}`)

export const getDocument = async (mediaType, searchEmployee, year, skip, limit) => {
  try {
    return await apiClient.get('/media', {
      params: {
        mediaType,
        searchEmployee,
        year,
        skip,
        limit,
      },
    })
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.error || 'Something went wrong',
      })
    }
  }
  return null
}

export const deleteDocument = async (id) => {
  const empId = getLoggedInUserInfo()?.empId
  try {
    return await apiClient.delete('media/documentDelete', {
      params: {
        id,
        empId,
      },
    })
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.error || 'Something went wrong',
      })
    }
  }
  return null
}

export const salarySlip = async (value) => {
  const empId = getLoggedInUserInfo()?.empId
  const userRole = getLoggedInUserInfo()?.userRole
  const { mediaType, year } = value
  try {
    return apiClient.get('media/salarySlip', {
      params: {
        empId,
        mediaType,
        year,
        userRole,
      },
    })
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.error || 'Something went wrong',
      })
    }
  }
  return null
}
