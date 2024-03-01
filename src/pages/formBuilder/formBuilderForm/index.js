import React, { useCallback, useEffect, useState } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Row, Col, Select, Space, notification, Card } from 'antd'
import { addFormBuilder } from 'services/axios/formBuilder'
import { getMasterGlobalTypeList } from 'services/axios/config/index'
import { handleFormType } from 'redux/formQuestions/action'
import { useDispatch, useSelector } from 'react-redux'
import { history } from 'index'
import { AnswerType, SelectionType } from 'utils'

const FormBuilderForm = () => {
  const [answerType, setAnswerType] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)
  const dispatch = useDispatch()
  const typeOfForm = useSelector((state) => state?.formQuestions?.formTypes)
  const [form] = Form.useForm()
  const getFormType = useCallback(async () => {
    const formType = await getMasterGlobalTypeList('form_type')
    if (formType?.data?.status && formType?.status) {
      dispatch(handleFormType(formType?.data?.data))
    }
  }, [dispatch])
  const onFinish = async (values) => {
    const addedFormBuilder = await addFormBuilder(values)
    if (addedFormBuilder?.data?.status && addedFormBuilder?.data?.message === 'success') {
      notification.success({
        message: 'Question Added',
      })
      form.resetFields()
      setAnswerType(null)
      setShowSubmit(false)
      history.push('/form-builder')
    }
  }
  const onFinishFailed = () => {
    notification.error({
      message: 'Error',
    })
  }
  const handlerAnswerType = (value) => {
    setAnswerType(value)
  }
  const handleFormChange = (values) => {
    setShowSubmit(Object.values(values).some((val) => !!val))
  }
  useEffect(() => {
    getFormType()
  }, [getFormType])
  return (
    <Card title="Add Question">
      <Form
        name="formBuilder"
        form={form}
        onValuesChange={handleFormChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={null}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
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
          <Col className="gutter-row" span={8}>
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
              <Select
                placeholder="Select answer type"
                options={AnswerType}
                onChange={handlerAnswerType}
              />
            </Form.Item>
          </Col>

          {answerType === 'mcq' && (
            <Col className="gutter-row" span={8}>
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
                <Select placeholder="Select selection  type" options={SelectionType} />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Form.List name="mcqOptions">
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
                  <CloseCircleOutlined
                    style={{ color: 'red', fontSize: '1rem', marginRight: '0.5rem' }}
                    onClick={() => removeMcqOption(field.name)}
                  />
                </Space>
              ))}
              {answerType === 'mcq' && (
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
        {showSubmit && (
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  )
}
export default FormBuilderForm
