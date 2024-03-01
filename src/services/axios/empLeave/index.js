import { notification } from 'antd'
import ApiEndPoints from 'utils'
import apiClient from '../index'
// import { ReactReduxContext } from 'react-redux'

export const getListEmpLeave = async () => {
  try {
    return await apiClient.get(`${`${ApiEndPoints.ALL_LEAVE}`}`)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const getListEmpDayLeave = async () => {
  try {
    return await apiClient.get(`${ApiEndPoints.ALL_DAYOFF_LEAVE}`)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const getEmpLeaveForLeaveType = async (userId, leaveType) => {
  try {
    const res = await apiClient.get(
      `${`${ApiEndPoints.ALL_LEAVE_FOR_LEAVE_TYPE}/${userId}/${leaveType}`}`,
    )
    return res
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
    return null
  }
}

// eslint-disable-next-line consistent-return
export const addNewEmpLeave = async (leaveData) => {
  try {
    return await apiClient.post(ApiEndPoints.MARK_LEAVE, leaveData)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

// eslint-disable-next-line consistent-return
export const updateEmpLeave = async (leaveData, id) => {
  try {
    return await apiClient.put(`${ApiEndPoints.UPDATE_LEAVE}/${id}`, leaveData)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

export const getListEmpLeaveRequest = async (leaveStatus, skip, limit, employeeValue, team) => {
  try {
    return await apiClient.get(ApiEndPoints.LEAVE_REQUEST, {
      params: {
        leaveStatus,
        skip,
        limit,
        employeeValue,
        team,
      },
    })
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const updateLeaveStatus = async (data, id) => {
  try {
    return await apiClient.patch(`${ApiEndPoints.UPDATE_LEAVE_STATUS}/${id}`, data)
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

export const deleteLeaveRequest = async (data, id) => {
  try {
    return await apiClient.put(`${ApiEndPoints.DELETE_LEAVE_REQUEST}/${id}`, data)
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
