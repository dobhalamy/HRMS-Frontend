import { actions } from './action'

const initialState = {
  toggle: true,
  pagination: {
    skip: 0,
    limit: 10,
  },
  empList: {},
  traineeList: {},
  loading: false,
  docType: [],
  empDesignation: [],
  empRole: [],
  empProcess: [],
  department: [],
}

const onToggle = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SWITCH:
      return {
        ...state,
        toggle: action.payload,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.GET_EMP_LIST:
      return {
        ...state,
        empList: action.payload,
      }
    case actions.GET_TRAINEE_LIST:
      return {
        ...state,
        traineeList: action.payload,
      }
    case actions.GET_TRAINEE_HISTORY:
      return {
        ...state,
        traineeHistory: action.payload,
      }
    case actions.TOGGLE_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case actions.HANDLE_EMP_DESIGNATION:
      return {
        ...state,
        empDesignation: action.payload,
      }
    case actions.HANDLE_DOC_TYPE:
      return {
        ...state,
        docType: action.payload,
      }
    case actions.HANDLE_USER_ROLE:
      return {
        ...state,
        empRole: action.payload,
      }
    case actions.HANDLE_USER_PROCESS:
      return {
        ...state,
        empProcess: action.payload,
      }
    case actions.GET_DEPARTMENT:
      return {
        ...state,
        department: action.payload,
      }
    default:
      return state
  }
}
export default onToggle
