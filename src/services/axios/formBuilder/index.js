import { notification } from 'antd'
import apiClient from '../index'

export const getFormBuilderQuestions = async (params) => {
  const { skip, limit, formType, isActive } = params

  try {
    return await apiClient.get('formBuilder', {
      params: {
        skip,
        limit,
        formType,
        isActive,
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

export const addFormBuilder = async (formBuilderData) => {
  try {
    return await apiClient.post('formBuilder', formBuilderData)
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

export const updatedFormBuilderQuestion = async (updatedQuestion) => {
  try {
    return await apiClient.patch('formBuilder', updatedQuestion)
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
