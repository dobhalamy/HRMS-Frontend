import apiClient from '../index'

export const addException = (data) => apiClient.post('/exception', data)
export const getException = (status, skip, limit) =>
  apiClient.get('/exception/getAllException', {
    params: {
      status,
      skip,
      limit,
    },
  })
export const getSingleEmpException = (status, skip, limit) =>
  apiClient.get('/exception/getSingleEmpException', {
    params: {
      status,
      skip,
      limit,
    },
  })

export const deleteException = (id) => apiClient.delete(`exception/${id}`)
export const updateException = (data) => apiClient.patch('/exception/updateException', data)
