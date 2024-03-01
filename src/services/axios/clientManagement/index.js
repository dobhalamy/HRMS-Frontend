import { notification } from 'antd'
import apiClient from '../index'

export const getAllClientInfoList = async (params) => {
  const { skip, limit, searchedCustomer } = params
  try {
    return await apiClient.get('clientInfo', {
      params: {
        skip,
        limit,
        searchedCustomer,
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

export const addNewClient = async (clientData) => {
  try {
    return await apiClient.post('clientInfo', clientData)
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

export const updateClientInfo = async (data) => {
  try {
    return await apiClient.patch(`clientInfo`, data)
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
