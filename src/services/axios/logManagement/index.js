import { notification } from 'antd'
import apiClient from '../index'

export const getAllLogList = async () => {
  try {
    const response = await apiClient.get('/logs')
    return response
  } catch (error) {
    if (error) {
      notification.error({
        message: error?.message,
      })
    }
  }
  return null
}
