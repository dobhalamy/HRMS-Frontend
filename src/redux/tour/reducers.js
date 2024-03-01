// redux/tour/reducers.js
const initialState = {
  tourSteps: [],
}

const tourReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOUR_STEPS':
      return {
        ...state,
        tourSteps: action.payload,
      }
    default:
      return state
  }
}

export default tourReducer
