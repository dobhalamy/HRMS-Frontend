/* eslint-disable consistent-return */
import { notification } from 'antd'
import { history } from 'index'
import Cookies from 'js-cookie'
import { handelError } from 'utils'
import apiClient from '../index'

export const getListOfEmployee = async (params) => {
  const { skip, limit, userRole } = params
  try {
    return await apiClient.get('employee', {
      params: {
        skip,
        limit,
        userRole,
      },
    })
  } catch (error) {
    handelError(error)
  }
}
export const getListOfTrainee = async (params) => {
  const { status, skip, limit, employeeName } = params
  try {
    return await apiClient.get('employee/allTrainees', {
      params: {
        status,
        skip,
        limit,
        employeeName,
      },
    })
  } catch (error) {
    handelError(error)
  }
}

export const getListOfTraineeHistory = async (params) => {
  const { skip, limit, userId } = params
  try {
    return await apiClient.get('employee/traineeHistory', {
      params: {
        skip,
        limit,
        userId,
      },
    })
  } catch (error) {
    handelError(error)
  }
}
export const assignTrainer = async ({ id, userId }) => {
  try {
    return await apiClient.put(`employee/assignTrainer/${id}/${userId}`)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
export const trainerDetailsUpdate = async ({ userId, trainerId }) => {
  try {
    return await apiClient.patch(`employee/updateTrainerDetails/${userId}/${trainerId}`)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

export const filterEmployee = async (params) => {
  const { skip, limit, employeeName } = params
  try {
    return await apiClient.get(`employee/filterEmployee`, {
      params: {
        skip,
        limit,
        employeeName,
      },
    })
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

export const updateEmployeeData = async (data) => {
  try {
    return await apiClient.patch('employee', data)
  } catch (error) {
    if (error?.response?.data?.statusCode === 401) {
      Cookies.remove('accessToken')
      history.push('/auth/login')
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
export const updateTraineeData = async (data) => {
  try {
    return await apiClient.patch('employee/updateTrainee', data)
  } catch (error) {
    if (error?.response?.data?.statusCode === 401) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
export const updateTraineeStatus = async (data) => {
  try {
    return await apiClient.patch('employee/updateTraineeStatus', data)
  } catch (error) {
    if (error?.response?.data?.statusCode === 401) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
export const deleteEmployee = async ({ userId, empId }) => {
  try {
    return await apiClient.delete(`employee/${userId}/${empId}`)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
export const fetchNewEmpId = async () => {
  try {
    return await apiClient.get('employee/getNewEmpId')
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}
export const addNewEmployee = async (empData) => {
  try {
    return await apiClient.post('employee', empData)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

export const getUserInfo = async ({ userId }) => {
  try {
    return await apiClient.get(`userInfo/${userId}`)
  } catch (error) {
    if (error?.response?.data?.statusCode) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.message,
      })
    }
  }
}

// export const uploadProfilePicture = async (empData) => {
//   try {
//     return await apiClient.post('media/image', empData)
//   } catch (error) {
//     if (error?.response?.data?.statusCode) {
//       notification.error({
//         message: 'Error',
//         description: error?.response?.data?.message,
//       })
//     }
//   }
// }
