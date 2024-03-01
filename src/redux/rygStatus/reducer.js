import actions from './action'

const initialState = {
  data: [],
}

const fetchRYGstatusEmpList = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_RYG_STATUS_DATA:
      return {
        ...state,
        data: action.payload,
      }
    default:
      return state
  }
}

export default fetchRYGstatusEmpList
