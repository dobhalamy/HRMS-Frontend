import actions from './action'

const initialState = {
  data: [],
}

const fetchEventsData = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_EVENT_DATA:
      return {
        ...state,
        data: action.payload,
      }

    default:
      return state
  }
}

export default fetchEventsData
