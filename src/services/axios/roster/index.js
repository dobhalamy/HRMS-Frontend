import apiClient from '../index'

export const uploadRoster = (data) => apiClient.post('roster', data)
export const getRosterList = (skip, limit) =>
  apiClient.get('roster', {
    params: {
      skip,
      limit,
    },
  })
