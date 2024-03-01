import { actions } from './action'

const initialState = {
  happyToHelpData: [],
  totalCount: null,
  communicationWith: null,
  belongsToList: [],
  pagination: {
    skip: 0,
    limit: 10,
  },
}
const onHappyToHelpState = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_HAPPY_TO_HELP_LIST:
      return {
        ...state,
        happyToHelpData: action.payload.happyToHelpList,
        totalCount: action.payload.totalCount,
        communicationWith: action.payload.communicationWith,
      }

    case actions.GET_HAPPY_TO_HELP_BELONGS_TO_LIST:
      return {
        ...state,
        belongsToList: action.payload,
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
export default onHappyToHelpState
