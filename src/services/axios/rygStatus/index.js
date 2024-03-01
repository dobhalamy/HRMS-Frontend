import { notification } from 'antd'
import ApiEndPoints from 'utils'
import apiClient from '../index'

export const getRYGstatusList = async (StatusFilter, skip, limit, EmployeeFilter) => {
  try {
    return await apiClient.get(`${`${ApiEndPoints.RYG_STATUS_LIST}`}`, {
      params: {
        StatusFilter,
        skip,
        limit,
        EmployeeFilter,
      },
    })
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const updateRYGEmployee = async (values) => {
  try {
    return await apiClient.post(`${`${ApiEndPoints.UPDATE_RYG_EMPLOYEE}`}`, values)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}
