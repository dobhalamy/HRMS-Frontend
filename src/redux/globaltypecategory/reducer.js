import actions from './actions'

const initialState = {
  pagination: {
    skip: 0,
    limit: 10,
  },
  data: [],
}

const fetchGlobalTypeCategoryData = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_GTCDATA:
      return {
        ...state,
        data: action.payload,
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

export default fetchGlobalTypeCategoryData
