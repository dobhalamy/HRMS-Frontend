import React, { useEffect, useCallback } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Row, Col, Select, Space, notification, Modal, Switch } from 'antd'
import { getFormBuilderQuestions, updatedFormBuilderQuestion } from 'services/axios/formBuilder'
import { getMasterGlobalTypeList } from 'services/axios/config'
import { useSelector, useDispatch } from 'react-redux'
import {
  handleFormType,
  handleQuestionsTotalCount,
  handleQuestions,
} from 'redux/formQuestions/action'
import { AnswerType, SelectionType } from 'utils'

const EditFormBuilderForm = ({ question, showEditForm, setShowEditForm }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const typeOfForm = useSelector((state) => state?.formQuestions?.formTypes)
  const pagination = useSelector((state) => state?.formQuestions?.pagination)
  const getFormQuestions = useCallback(async () => {
    const { skip, limit } = pagination

    const formQuestions = await getFormBuilderQuestions({ skip, limit })
    if (formQuestions?.data?.status && formQuestions?.status) {
      dispatch(handleQuestions(formQuestions?.data?.data?.formBuilderData))
      dispatch(handleQuestionsTotalCount(formQuestions?.data?.data?.totalCount))
    }
  }, [dispatch, pagination])
  const getFormType = useCallback(async () => {
    const formType = await getMasterGlobalTypeList('form_type')
    if (formType?.data?.status && formType?.status) {
      dispatch(handleFormType(formType?.data?.data))
    }
  }, [dispatch])

  const onFinish = async (values) => {
    const updateQuestion = []
    updateQuestion.push({ ...values, id: question?.id })
    const updatedQuestion = await updatedFormBuilderQuestion(updateQuestion)
    if (updatedQuestion?.data?.status && updatedQuestion?.data?.message === 'Success') {
      notification.success({
        message: 'Question Updated',
      })
      setShowEditForm(false)
      getFormQuestions()
    }
  }
  const onFinishFailed = () => {
    notification.error({
      message: 'Error',
    })
  }
  const onCancelModalHandler = () => {
    setShowEditForm(false)
  }
  useEffect(() => {
    getFormType()
  }, [getFormType])
  return (
    <Modal
      title="Edit Question Detail"
      centered
      visible={showEditForm}
      onCancel={onCancelModalHandler}
      width={800}
      footer={false}
    >
      <Form
        name="editFormBuilder"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          formType: question?.formType,
          answerType: question?.answerType,
          selectionType: question?.selectionType,
          isActive: question?.isActive,
          questionName: question?.questionName,
        }}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label="Form type"
              name="formType"
              rules={[
                {
                  required: true,
                  message: 'Select form type',
                },
              ]}
            >
              <Select placeholder="Select form type">
                {typeOfForm.map((formtype) => (
                  <Select.Option key={formtype?.id} value={formtype?.displayName}>
                    {formtype?.displayName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              name="answerType"
              label="Answer type"
              rules={[
                {
                  required: true,
                  message: 'Select answer type',
                },
              ]}
            >
              <Select options={AnswerType} />
            </Form.Item>
          </Col>

          {question?.answerType === 'mcq' && (
            <Col className="gutter-row" span={6}>
              <Form.Item
                label="Selection type"
                name="selectionType"
                rules={[
                  {
                    required: true,
                    message: 'Select answer type',
                  },
                ]}
              >
                <Select options={SelectionType} />
              </Form.Item>
            </Col>
          )}
          <Col className="gutter-row" span={6}>
            <Form.Item label="Active" name="isActive">
              <Switch defaultChecked={question?.isActive} />
            </Form.Item>
          </Col>
        </Row>
        <Form.List name="mcqOptions" initialValue={question?.mcqOptions}>
          {(fields, { add: addMcqOption, remove: removeMcqOption }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    {...field}
                    name={[field.name, 'options']}
                    fieldKey={[field.fieldKey, 'options']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing option',
                      },
                    ]}
                  >
                    <Input placeholder="Option" />
                  </Form.Item>
                  <Button
                    style={{ color: 'red', fontSize: '1rem', marginRight: '0.5rem' }}
                    type="text"
                    shape="circle"
                    size="small"
                    onClick={() => removeMcqOption(field?.name)}
                    icon={<CloseCircleOutlined />}
                  />
                </Space>
              ))}
              {question?.answerType === 'mcq' && (
                <Form.Item>
                  <Button style={{ backgroundColor: '#f0f2f4' }} onClick={() => addMcqOption()}>
                    Add Options
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>

        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <Form.Item
              name="questionName"
              rules={[
                {
                  required: true,
                  message: 'Enter you question',
                },
              ]}
            >
              <Input.TextArea
                placeholder="Enter your question"
                rows={3}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditFormBuilderForm
