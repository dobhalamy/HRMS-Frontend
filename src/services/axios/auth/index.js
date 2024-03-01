/* eslint-disable consistent-return */

import { notification } from 'antd'
import ApiEndPoints from 'utils'
import apiClient from '../index'

export const login = async (values) => {
  try {
    return await apiClient.post(ApiEndPoints.LOGIN, { ...values })
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
