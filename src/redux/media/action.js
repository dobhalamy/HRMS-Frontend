import { getDocument, salarySlip } from 'services/axios/media'
import { getMasterGlobalTypeList } from 'services/axios/config'

export const actions = {
  HANDEL_DOCUMENT: 'HANDLE_DOCUMENT',
  HANDEL_PAGINATION: 'HANDLE_PAGINATION',
  HANDEL_OPEN: 'HANDLE_OPEN',
  HANDEL_DOCUMENT_DATA: 'HANDLE_DOCUMENT_DATA',
  FETCH_MEDIA_TYPE: 'FETCH_MEDIA_TYPE',
  HANDLE_SALARY_SLIP: 'FETCH_SALARY_SLIP',
  HANDLE_YEAR: 'HANDLE_YEAR',
  PROFILE_IMAGE: 'PROFILE_IMAGE',
}
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
export const handleOpen = (open) => {
  return {
    type: 'HANDLE_OPEN',
    payload: open,
  }
}
export const handleDocumentData = (document) => {
  return {
    type: 'HANDLE_DOCUMENT_DATA',
    payload: document,
  }
}
export const handelYear = (year) => {
  return {
    type: 'HANDLE_YEAR',
    payload: year,
  }
}
export const handelDocument = (media, searchEmployee, year, skip, limit) => {
  return async (dispatch) => {
    const response = await getDocument(media, searchEmployee, year, skip, limit)
    if (response?.status === 200 && response?.data?.message === 'success') {
      dispatch({
        type: actions.HANDEL_DOCUMENT,
        payload: {
          documentList: response?.data?.data?.documentList || [],
          totalCount: response?.data?.data?.totalCount,
        },
      })
    }
  }
}
export const handleMediaType = () => {
  return async (dispatch) => {
    const mediaType = await getMasterGlobalTypeList('document_type')
    dispatch({ type: actions.FETCH_MEDIA_TYPE, payload: mediaType?.data?.data })
  }
}

export const handleSalarySlip = (value) => {
  return async (dispatch) => {
    const response = await salarySlip(value)
    if (response?.status === 200 && response?.data?.message === 'success') {
      dispatch({
        type: actions.HANDLE_SALARY_SLIP,
        payload: { salarySlip: response?.data?.data, totalCount: response?.data?.totalCount },
      })
    }
  }
}
