import React from 'react'
import { Form, Input, Button, Col, Row, Checkbox, Space, Radio } from 'antd'

const AppraisalForm = () => {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log('Form values:', values)
  }

  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <Form.Item
            name="question1"
            label="Subjective question"
            rules={[
              {
                required: true,
                message: 'Please provide an answer for Question 1',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="question2"
        label="MCQ Question for multiple select answer"
        rules={[
          {
            required: true,
            message: 'Please provide an answer for Question 2',
          },
        ]}
      >
        <Checkbox.Group>
          <Space direction="vertical">
            <Checkbox value="option1">Option 1</Checkbox>
            <Checkbox value="option2">Option 2</Checkbox>
            <Checkbox value="option3">Option 3</Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        name="question3"
        label="MCQ Question for single select answer"
        rules={[
          {
            required: true,
            message: 'Please provide an answer for Question 2',
          },
        ]}
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AppraisalForm
