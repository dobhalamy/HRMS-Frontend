import axios from 'axios'

// Action type
const actions = { FETCH_DATA: 'FETCH_DATA' }

// Action creaters
export const fetchData = () => {
  return async (dispatch) => {
    const response = await axios('https://dummyjson.com/products/')
    dispatch({ type: actions.FETCH_DATA, payload: response.data?.products })
  }
}

export default actions
