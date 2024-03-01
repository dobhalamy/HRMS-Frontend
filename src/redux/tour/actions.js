// redux/tour/actions.js
export const setTourSteps = (steps) => {
  return {
    type: 'SET_TOUR_STEPS',
    payload: steps,
  }
}
