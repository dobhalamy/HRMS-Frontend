import { actions } from './action'

const initialState = {
  questionsList: [],
  formTypes: [],
  questionStatus: null,
  filteredFormType: null,
  totalCount: 0,
  pagination: {
    skip: 0,
    limit: 10,
  },
}

const onFormQuestions = (state = initialState, action) => {
  switch (action.type) {
    case actions.QUESTION_STATUS:
      return {
        ...state,
        questionStatus: action.questionStatus,
      }
    case actions.HANDLE_FILTERED_FORMTYPE:
      return {
        ...state,
        filteredFormType: action.filteredFormType,
      }
    case actions.HANDLE_QUESTIONS:
      return {
        ...state,
        questionsList: action.questionsList,
      }
    case actions.HANDLE_QUESTIONS_TOTAL_COUNT:
      return {
        ...state,
        totalCount: action.totalCount,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.HANDLE_FORMTYPE:
      return {
        ...state,
        formTypes: action.formType,
      }
    default:
      return state
  }
}

export default onFormQuestions
