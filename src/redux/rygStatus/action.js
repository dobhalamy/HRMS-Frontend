import { getRYGstatusList } from 'services/axios/rygStatus'

// Action type
const actions = {
  FETCH_RYG_STATUS_DATA: 'FETCH_RYG_STATUS_DATA',
}

// Action creaters
export const fetchRYGstatusData = ({ StatusFilter, skip, limit, EmployeeFilter } = {}) => {
  return async (dispatch) => {
    const response = await getRYGstatusList(StatusFilter, skip, limit, EmployeeFilter)
    dispatch({ type: actions.FETCH_RYG_STATUS_DATA, payload: response?.data?.data })
  }
}

export default actions
