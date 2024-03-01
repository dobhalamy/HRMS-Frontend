import { getListOfEvents } from 'services/axios/events'

// Action type
const actions = {
  FETCH_EVENT_DATA: 'FETCH_EVENT_DATA',
}

// Action creaters
export const fetchEventsData = () => {
  return async (dispatch) => {
    const response = await getListOfEvents()
    dispatch({ type: actions.FETCH_EVENT_DATA, payload: response?.data?.eventData })
  }
}

export default actions
