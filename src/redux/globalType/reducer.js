import actions from './actions'

const initialState = {
  pagination: {
    skip: 0,
    limit: 10,
    globalTypeCategory: null,
  },
  data: [],
  GTdata: [],
}

export const fetchMasterGlobalTypeData = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_MASTER_GTDATA:
      return {
        ...state,
        data: action.payload,
      }
    case actions.FETCH_GTDATA:
      return {
        ...state,
        GTdata: action.payload,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action?.payload,
      }

    default:
      return state
  }
}
