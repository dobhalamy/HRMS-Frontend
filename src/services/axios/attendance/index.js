import { notification } from 'antd'
import apiClient from 'services/axios'

export const getAllAttendance = async (params) => {
  try {
    return await apiClient.get(`employee/allAttendance-record`, {
      params,
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
export const getEmpAttendance = async (year) => {
  try {
    return await apiClient.get(`employee/attendance-record?year=${year}`)
  } catch (error) {
    if (error?.response?.status) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}
