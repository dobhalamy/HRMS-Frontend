/* eslint-disable consistent-return */
import { notification } from 'antd'
import ApiEndPoints from 'utils'
import apiClient from '../index'

export const addNewEvent = async (eventData) => {
  try {
    return await apiClient.post(ApiEndPoints.EVENTS, eventData)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

export const getListOfEvents = async () => {
  try {
    return await apiClient.get(ApiEndPoints.EVENTS)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
}

export const updateEvent = async (eventData, id) => {
  try {
    return await apiClient.put(ApiEndPoints.EVENTS + id, eventData)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
