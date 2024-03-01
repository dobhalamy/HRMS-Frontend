import { notification } from 'antd'
import apiClient from '../index'

export const getSingleModulePermission = (params) => {
  const { moduleId } = params
  return apiClient.get(`modules/singleModulePermission`, {
    params: {
      moduleId,
    },
  })
}

export const getModulePermission = async () => {
  try {
    return await apiClient.get(`modules/modulePermissions`)
  } catch (error) {
    if (error) {
      notification.error({
        message: error?.message,
      })
    }
  }
  return null
}
export const updateModulePermissions = async (updateData) => {
  try {
    return await apiClient.put(`modules/updateModulePermissions`, updateData)
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
export const addModulePermissions = async (data) => {
  try {
    return await apiClient.post(`modules/addModluePermissions`, data)
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
