import { getGlobalTypeCategoryList } from 'services/axios/config'

// Action type
const actions = {
  FETCH_GTCDATA: 'FETCH_GTCDATA',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
}
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
// Action creators
export const fetchGTCData = ({ skip, limit } = {}) => {
  return async (dispatch) => {
    const response = await getGlobalTypeCategoryList({ skip, limit })
    dispatch({ type: actions.FETCH_GTCDATA, payload: response?.data })
  }
}

export default actions
