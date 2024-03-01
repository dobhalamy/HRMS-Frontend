import { getGlobalTypeList, getMasterGlobalTypeList } from 'services/axios/config'

// Action type
const actions = {
  FETCH_MASTER_GTDATA: 'FETCH_MASTER_GTDATA',
  FETCH_GTDATA: 'FETCH_GTDATA',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
// Action creaters
export const fetchMasterGTData = (value) => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList(value)
    dispatch({ type: actions.FETCH_MASTER_GTDATA, payload: response?.data })
  }
}
// Action creators
export const fetchGTData = ({ skip = 0, limit = 10, globalTypeCategory = null }) => {
  return async (dispatch) => {
    const response = await getGlobalTypeList({ skip, limit, globalTypeCategory })
    dispatch({ type: actions.FETCH_GTDATA, payload: response?.data })
  }
}
export default actions
