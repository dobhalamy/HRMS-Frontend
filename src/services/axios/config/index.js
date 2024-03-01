import { notification } from 'antd'
import ApiEndPoints, { handelError, getLoggedInUserInfo } from 'utils'
import apiClient from '../index'

export const getPermissionsByDepId = async (depId, nestedRoleId) => {
  try {
    return await apiClient.get(`role`, {
      params: {
        depId,
        nestedRoleId,
      },
    })
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}
export const getPermissionsWithModules = () => apiClient.get('/modules/modulePermissions')
export const getGlobalTypeCategoryList = async (params) => {
  const { skip, limit } = params

  try {
    return await apiClient.get(ApiEndPoints.GLOBAL_TYPE_CATEGORY, {
      params: {
        skip,
        limit,
      },
    })
  } catch (error) {
    handelError(error)
  }
  return null
}
export const addRoleAndPermissions = async (values) => {
  try {
    return await apiClient.post('role', values)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const getMasterGlobalTypeList = async (value) => {
  try {
    return await apiClient.get(`${ApiEndPoints.MASTER_GLOBAL_TYPE_CATEGORY}${value}`)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const getNestedGlobalType = async (pareentId, globalTypeValue) => {
  try {
    return await apiClient.get(`${ApiEndPoints.NESTED_GLOBAL_TYPE}${globalTypeValue}/${pareentId}`)
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const getGlobalTypeList = async (params) => {
  const { skip, limit, globalTypeCategory } = params

  try {
    const response = await apiClient.get(`${ApiEndPoints.GLOBAL_TYPE}`, {
      params: {
        skip,
        limit,
        globalTypeCategory,
      },
    })
    return response
  } catch (error) {
    handelError(error)
  }
  return null
}
export const saveGlobalTypeCategory = async (data) => {
  try {
    return await apiClient.post(`${ApiEndPoints.GLOBAL_TYPE_CATEGORY}`, data)
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
export const updateGlobalTypeCategory = async (data, id) => {
  try {
    return await apiClient.put(`${ApiEndPoints.GLOBAL_TYPE_CATEGORY}${id}`, data)
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
export const saveGlobalType = async (data) => {
  try {
    return await apiClient.post(`${ApiEndPoints.GLOBAL_TYPE}`, data)
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
export const updateGlobalType = async (data, id) => {
  try {
    return await apiClient.put(`${ApiEndPoints.GLOBAL_TYPE}${id}`, data)
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

export const getAllRoles = async () => {
  try {
    const response = await apiClient.get(`${ApiEndPoints.MASTER_GLOBAL_TYPE_CATEGORY}user_role`)
    return response
  } catch (error) {
    notification.error({
      message: error?.message,
    })
  }
  return null
}

export const staticContent = async (data) => {
  const { title, content } = data
  const empId = getLoggedInUserInfo()?.empId
  try {
    return await apiClient.post('staticContent', {
      empId,
      title,
      content,
    })
  } catch (error) {
    if (error?.response?.status) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}

export const getStaticContent = async (title) => {
  const empId = getLoggedInUserInfo()?.empId
  try {
    return await apiClient.get(`staticContent/getStaticContent?empId=${empId}&title=${title}`)
  } catch (error) {
    if (error?.response?.status) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
  return null
}
