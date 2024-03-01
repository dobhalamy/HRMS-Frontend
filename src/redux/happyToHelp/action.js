import { getAllHappyToHelp, getHappyToHelp } from 'services/axios/happyToHelp'
import { getMasterGlobalTypeList } from 'services/axios/config'

export const actions = {
  GET_HAPPY_TO_HELP_LIST: 'GET_HAPPY_TO_HELP_LIST',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  GET_HAPPY_TO_HELP_BELONGS_TO_LIST: 'GET_HAPPY_TO_HELP_BELONGS_TO_LIST',
}

export const getAllHappyToHelpList = ({ skip, limit }) => {
  return async (dispatch) => {
    const response = await getAllHappyToHelp({ skip, limit })

    dispatch({
      type: actions.GET_HAPPY_TO_HELP_LIST,
      payload: {
        happyToHelpList: response?.data?.data?.happyToHelpList,
        totalCount: response?.data?.data?.totalCount,
      },
    })
  }
}
export const getHappyToHelpList = ({ skip, limit }) => {
  return async (dispatch) => {
    const response = await getHappyToHelp({ skip, limit })

    dispatch({
      type: actions.GET_HAPPY_TO_HELP_LIST,
      payload: {
        happyToHelpList: response?.data?.data?.happyToHelpList,
        totalCount: response?.data?.data?.totalCount,
        communicationWith: response?.data?.data?.communicationWith,
      },
    })
  }
}
export const getHappyToHelpBelongsTo = () => {
  return async (dispatch) => {
    const response = await getMasterGlobalTypeList('happy_to_help_belongs_to')
    dispatch({
      type: actions.GET_HAPPY_TO_HELP_BELONGS_TO_LIST,
      payload: response?.data?.data,
    })
  }
}

export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
