export const actions = {
  HANDLE_QUESTIONS: 'HANDLE_QUESTIONS',
  HANDLE_QUESTIONS_TOTAL_COUNT: 'HANDLE_QUESTIONS_TOTAL_COUNT',
  HANDLE_PAGINATION: 'HANDLE_PAGINATION',
  HANDLE_FORMTYPE: 'HANDLE_FORMTYPE',
  HANDLE_FILTERED_FORMTYPE: 'HANDLE_FILTERED_FORMTYPE',
  QUESTION_STATUS: 'QUESTION_STATUS',
}

export const handleFilteredQuestionStatus = (questionStatus) => {
  return {
    type: 'QUESTION_STATUS',
    questionStatus,
  }
}
export const handleFilteredFormType = (filteredFormType) => {
  return {
    type: 'HANDLE_FILTERED_FORMTYPE',
    filteredFormType,
  }
}
export const handleQuestions = (questionsList) => {
  return {
    type: 'HANDLE_QUESTIONS',
    questionsList,
  }
}
export const handleFormType = (formType) => {
  return {
    type: 'HANDLE_FORMTYPE',
    formType,
  }
}
export const handleQuestionsTotalCount = (totalCount) => {
  return {
    type: 'HANDLE_QUESTIONS_TOTAL_COUNT',
    totalCount,
  }
}
export const handlePagination = (pagination) => {
  return {
    type: 'HANDLE_PAGINATION',
    payload: pagination,
  }
}
