import { actions } from './action'

const initialState = {
  rosterList: [],
  totalCount: 0,
  pagination: {
    skip: 0,
    limit: 10,
  },
}

const roster = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ROSTER_LIST:
      return {
        ...state,
        rosterList: action.payload.rosterList,
        totalCount: action.payload.totalCount,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    default:
      return state
  }
}
export default roster
