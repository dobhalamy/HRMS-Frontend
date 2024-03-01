import { notification } from 'antd'
import apiClient from '../index'

export const getUserNotifications = async ({ userId }) => {
  try {
    return await apiClient.get(`notification/${userId}`)
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

export const readUserNotification = async (userId) => {
  try {
    return await apiClient.patch(`notification/${userId}`)
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
