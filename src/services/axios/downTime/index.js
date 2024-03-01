import { notification } from 'antd'
import apiClient from '../index'

export const getDownTime = async (params) => {
  const { skip, limit, status } = params
  try {
    return await apiClient.get(`employee/downTimeList`, {
      params: {
        skip,
        limit,
        status,
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
export const addDownTime = async (markDownTime) => {
  try {
    return await apiClient.post(`employee/markDownTime`, markDownTime)
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
export const updateDownTime = async (data, id) => {
  try {
    return await apiClient.patch(`employee/updateDownTimeStatus/${id}`, data)
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
export const deleteDownTime = async (id) => {
  try {
    return await apiClient.put(`employee/deleteDownTime/${id}`)
  } catch (error) {
    if (error) {
      notification.error({
        message: error?.message,
      })
    }
  }
  return null
}
