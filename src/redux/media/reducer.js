import { actions } from './action'

const initialState = {
  document: [],
  totalCount: null,
  isOpen: false,
  documentData: {},
  mediaType: [],
  salarySlips: [],
  year: new Date().getFullYear(),
  pagination: {
    skip: 0,
    limit: 10,
  },
  profileImage: [],
}

const getDocument = (state = initialState, action) => {
  switch (action.type) {
    case actions.HANDEL_DOCUMENT:
      return {
        ...state,
        document: action.payload.documentList,
        totalCount: action.payload.totalCount,
      }
    case actions.HANDEL_OPEN:
      return {
        ...state,
        isOpen: action.payload,
      }
    case actions.HANDEL_DOCUMENT_DATA:
      return {
        ...state,
        documentData: action.payload,
      }
    case actions.HANDEL_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      }
    case actions.FETCH_MEDIA_TYPE:
      return {
        ...state,
        mediaType: action.payload,
      }
    case actions.HANDLE_SALARY_SLIP:
      return {
        ...state,
        salarySlips: action.payload.salarySlip,
        totalCount: action.payload.totalCount,
      }
    case actions.HANDLE_YEAR:
      return {
        ...state,
        year: action.payload,
      }
    default:
      return state
  }
}
export default getDocument

export const getProfileImage = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPDATE_PROFILE_PICTURE:
      return {
        ...state,
        profileImage: action.payload,
        // totalCount: action.payload.totalCount,
      }
    default:
      return state
  }
}
