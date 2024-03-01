import { notification } from 'antd'
import apiClient from '../index'

export const getAllHappyToHelp = async (params) => {
  const { skip, limit } = params

  try {
    return await apiClient.get(`happyToHelp/getAllHappyToHelp`, {
      params: {
        skip,
        limit,
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
export const getHappyToHelp = async (params) => {
  const { skip, limit } = params

  try {
    return await apiClient.get(`happyToHelp/getHappyToHelp`, {
      params: {
        skip,
        limit,
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

export const addHappyToHelp = async (happyToHelpData) => {
  try {
    return await apiClient.post('happyToHelp', happyToHelpData)
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
export const updateHappyToHelp = async (data, id) => {
  try {
    return await apiClient.patch(`happyToHelp/updateHappyToHelp/${id}`, data)
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
export const deleteHappyToHelp = async (id) => {
  try {
    return await apiClient.put(`happyToHelp/${id}`)
  } catch (error) {
    if (error) {
      notification.error({
        message: error?.message,
      })
    }
  }
  return null
}
