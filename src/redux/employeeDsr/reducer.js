import { actions } from './action'

const initialState = {
  searchText: null,
  startDate: null,
  endDate: null,
  searchedEmployee: null,
  projectsName: [],
  empList: {},
  dsrTableData: [],
  totalCount: null,
  loading: true,
  pagination: {
    skip: 0,
    limit: 10,
  },
}

const onDsrState = (state = initialState, action) => {
  switch (action.type) {
    case actions.HANDLE_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText,
      }
    case actions.HANDLE_SEARCH_EMPLOYEE:
      return {
        ...state,
        searchedEmployee: action.SearchedEmployee,
      }
    case actions.HANDLE_START_DATE:
      return {
        ...state,
        startDate: action.startDate,
      }
    case actions.HANDLE_END_DATE:
      return {
        ...state,
        endDate: action.endDate,
      }
    case actions.GET_EMP_LIST:
      return {
        ...state,
        empList: action.payload,
      }
    case actions.HANDLE_LOADING:
      return {
        ...state,
        loading: action.loading,
      }
    case actions.HANDLE_DSR_TABLE_DATA:
      return {
        ...state,
        dsrTableData: action.dsrTableData,
      }
    case actions.HANDLE_DSR_TABLE_TOTAL_COUNT:
      return {
        ...state,
        totalCount: action.totalCount,
      }
    case actions.HANDLE_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.HANDLE_PROJECTSNAME:
      return {
        ...state,
        projectsName: action.payload,
      }
    default:
      return state
  }
}
export default onDsrState
