import { actions } from './action'

const initialState = {
  projectInfoData: [],
  totalCount: null,
  searchedProject: null,
  pagination: {
    skip: 0,
    limit: 10,
  },
  billingType: [],
  technologies: [],
  employeeProjectRole: [],
  projectStatus: [],
}
const onProjectInfoState = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_PROJECT_INFO_LIST:
      return {
        ...state,
        projectInfoData: action.payload?.projectInfoList,
        totalCount: action.payload?.totalCount,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.GET_PROJECT_LIST:
      return {
        ...state,
        projectInfoData: action.payload,
      }
    case actions.HANDLE_BILLING_TYPE:
      return {
        ...state,
        billingType: action.payload,
      }
    case actions.HANDLE_TECHNOLOGY:
      return {
        ...state,
        technologies: action.payload,
      }
    case actions.HANDLE_PROJECT_ROLE:
      return {
        ...state,
        employeeProjectRole: action.payload,
      }
    case actions.HANDLE_SEARCH_PROJECT:
      return {
        ...state,
        searchedProject: action.searchedProject,
      }
    case actions.HANDLE_PROJECT_STATUS:
      return {
        ...state,
        projectStatus: action.payload.projectInfo,
      }
    case actions.GET_TEAM_MEMBER:
      return {
        ...state,
        team: action.payload.teamArray,
      }
    default:
      return state
  }
}
export default onProjectInfoState
