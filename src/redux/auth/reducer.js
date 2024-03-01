import actions from './actions'

const initialState = {
  data: [],
}

const fetchData = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_DATA:
      return {
        ...state,
        data: action.payload,
      }

    default:
      return state
  }
}

export default fetchData
