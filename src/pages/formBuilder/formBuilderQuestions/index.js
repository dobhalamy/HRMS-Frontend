/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useState } from 'react'
import { getFormBuilderQuestions, updatedFormBuilderQuestion } from 'services/axios/formBuilder'
import { getMasterGlobalTypeList } from 'services/axios/config/index'
import { EditFilled, EyeFilled } from '@ant-design/icons'
import { defaultPagination, onPageChange, onPageSizeChange, resetPagination } from 'utils'
import { List, Button, Switch, Space, Select, Typography, notification, Checkbox } from 'antd'
import { history } from 'index'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import EditFormBuilderForm from '../editFormBuilderForm'

import {
  handleQuestions,
  handleQuestionsTotalCount,
  handlePagination,
  handleFormType,
  handleFilteredFormType,
  handleFilteredQuestionStatus,
} from '../../../redux/formQuestions/action'
import QuestionDetails from '../questionDetails'

const { Text } = Typography

const FormBuilderQuestions = () => {
  const formQuestionsList = useSelector((state) => state?.formQuestions?.questionsList)
  const totalCount = useSelector((state) => state?.formQuestions?.totalCount)
  const pagination = useSelector((state) => state?.formQuestions?.pagination)
  const typeOfForm = useSelector((state) => state?.formQuestions?.formTypes)
  const filteredFormType = useSelector((state) => state?.formQuestions?.filteredFormType)
  const filteredQuestionStatus = useSelector((state) => state?.formQuestions?.questionStatus)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)

  const dispatch = useDispatch()

  const [showEditForm, setShowEditForm] = useState(false)
  const [showQuestionDetailModal, setShowQuestionDetailModal] = useState(false)
  const [editQuestion, setEditQuestion] = useState(false)

  let updateMultipleQuestions = []
  const QuestionStatus = [
    { label: 'Active', value: '1' },
    { label: 'Disabled', value: '0' },
  ]

  const handlePageChange = (pageNumber, pageSize) => {
    onPageChange({
      totalCount,
      pageSize,
      currentPage,
      oldPageSize,
      pageNumber,
      dispatch,
      handlePagination,
    })
  }
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }
  const getFormType = useCallback(async () => {
    const formType = await getMasterGlobalTypeList('form_type')
    if (formType?.data?.status && formType?.status) {
      dispatch(handleFormType(formType?.data?.data))
    }
  }, [dispatch])

  const getFormQuestions = useCallback(
    async (formType, isActive, pagination) => {
      const { skip, limit } = pagination

      const formQuestions = await getFormBuilderQuestions({ skip, limit, formType, isActive })
      if (formQuestions?.data?.status && formQuestions?.status) {
        dispatch(handleQuestions(formQuestions?.data?.data?.formBuilderData))
        dispatch(handleQuestionsTotalCount(formQuestions?.data?.data?.totalCount))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, pagination],
  )

  const handleEditFormModal = (question) => {
    setEditQuestion(question)
    setShowEditForm(true)
  }
  const handleQuestionDetailModal = (question) => {
    setEditQuestion(question)
    setShowQuestionDetailModal(true)
  }
  const onChangeIsActive = async (question) => {
    const updateQuestion = []
    updateQuestion.push({
      ...question,
      isActive: !question?.isActive,
    })
    const updatedQuestion = await updatedFormBuilderQuestion(updateQuestion)
    if (updatedQuestion?.data?.status && updatedQuestion?.data?.message === 'Success') {
      notification.success({
        message: 'Question Updated',
      })
      getFormQuestions(filteredFormType, filteredQuestionStatus)
    }
  }
  const handleFormTypeChange = debounce(async (value) => {
    if (value) {
      dispatch(handleFilteredFormType(value))
      getFormQuestions(value, filteredQuestionStatus, { ...resetPagination })
    } else {
      dispatch(handleFilteredFormType(null))
      getFormQuestions(null, filteredQuestionStatus, { ...resetPagination })
    }
    handlePageChange(1)
  }, 1000)
  const handleQuestionStatusChange = debounce((value) => {
    if (value) {
      dispatch(handleFilteredQuestionStatus(value))
      getFormQuestions(filteredFormType, value, { ...resetPagination })
    } else {
      dispatch(handleFilteredQuestionStatus(null))
      getFormQuestions(filteredFormType, null, { ...resetPagination })
    }
    handlePageChange(1)
  }, 1000)

  const onChangeHandler = (e, question) => {
    if (e?.target?.checked) {
      updateMultipleQuestions.push(question)
    } else {
      updateMultipleQuestions = updateMultipleQuestions.filter(
        (updateQuestion) => updateQuestion?.id !== question?.id,
      )
    }
  }
  const updateAllChangeHandler = async (checked) => {
    let newUpdated
    if (checked) {
      newUpdated = updateMultipleQuestions.map((question) => ({
        ...question,
        isActive: checked,
      }))
    } else {
      newUpdated = updateMultipleQuestions.map((question) => ({
        ...question,
        isActive: checked,
      }))
    }
    const updatedSelectedQuestion = await updatedFormBuilderQuestion(newUpdated)
    if (
      updatedSelectedQuestion?.data?.status &&
      updatedSelectedQuestion?.data?.message === 'Success'
    ) {
      notification.success({
        message: 'Selected Question Updated',
      })
    }
    window.location.reload()
  }
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (filteredQuestionStatus === null && filteredFormType === null) {
      getFormType()
      getFormQuestions(null, null, pagination)
    } else {
      dispatch(handleFilteredQuestionStatus(null))
      dispatch(handleFilteredFormType(null))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFormQuestions, dispatch])

  return (
    <>
      <Space>
        <Text strong>Active All </Text>
        <Switch onChange={updateAllChangeHandler} loading={isLoading} />,
      </Space>
      <Space style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
        <Button
          type="primary"
          onClick={() => history.push('/form-builder/add-question')}
          loading={isLoading}
        >
          Add Question
        </Button>
      </Space>

      <Space>
        <Select
          allowClear
          placeholder="Filter form type"
          size="large"
          style={{ width: 180 }}
          onChange={handleFormTypeChange}
        >
          {typeOfForm.map((formtype) => (
            <Select.Option key={formtype?.id} value={formtype?.displayName}>
              {formtype?.displayName}
            </Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Question Status"
          size="large"
          style={{ width: 180 }}
          onChange={handleQuestionStatusChange}
          options={QuestionStatus}
        />
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={formQuestionsList}
        pagination={
          formQuestionsList?.length === 0
            ? false
            : {
                defaultPageSize: oldPageSize,
                current: parseInt(currentPage, 10),
                total: totalCount,
                responsive: true,
                onChange: handlePageChange,
                onShowSizeChange: handlePageSizeChange,
                showSizeChanger: true,
                locale: { items_per_page: '' },
                pageSizeOptions: ['10', '20', '50', '100'],
              }
        }
        renderItem={(question) => (
          <List.Item
            key={question?.id}
            actions={[
              <Switch
                defaultChecked={question.isActive}
                onClick={() => onChangeIsActive(question)}
              />,
              <Button type="primary" onClick={() => handleQuestionDetailModal(question)}>
                <EyeFilled />
              </Button>,
              <Button type="primary" onClick={() => handleEditFormModal(question)}>
                <EditFilled />
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Checkbox
                  onChange={(e) => {
                    onChangeHandler(e, question)
                  }}
                />
              }
              title={`Question: ${question?.questionName} ?`}
            />
          </List.Item>
        )}
      />

      {showQuestionDetailModal && (
        <QuestionDetails
          question={editQuestion}
          showQuestionDetailModal={showQuestionDetailModal}
          setShowQuestionDetailModal={setShowQuestionDetailModal}
        />
      )}
      {showEditForm && (
        <EditFormBuilderForm
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          question={editQuestion}
        />
      )}
    </>
  )
}

export default FormBuilderQuestions
