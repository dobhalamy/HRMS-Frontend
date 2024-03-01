import React from 'react'
import { Row, Col, Rate, Space, Form, Button, Input, InputNumber } from 'antd'

const data = [
  {
    id: 1,
    skill: 'React',
    rate: 4,
  },
  {
    id: 2,
    skill: 'Node',
    rate: 3,
  },
  {
    id: 3,
    skill: 'Angular',
    rate: 1,
  },
  {
    id: 4,
    skill: 'Express',
    rate: 5,
  },
]

const SkillForm = () => {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    data.push(values)
    console.log(data)
  }
  return (
    <>
      <Form
        layout="vertical"
        form={form}
        initialValues={null}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col>
            <Form.Item
              name="skill"
              rules={[
                {
                  required: true,
                  message: 'Enter your skill',
                },
              ]}
            >
              <Input placeholder="Enter the skill" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="rate"
              rules={[
                {
                  required: true,
                  message: 'Rate your skill',
                },
              ]}
            >
              <InputNumber placeholder="Rate out of 5" min={1} max={5} />
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Row>
      </Form>
      <Row gutter={16}>
        {data.map((skill) => (
          <Col key={skill.id} className="gutter-row" span={6} style={{ paddingBottom: '1.5rem' }}>
            <Space direction="vertical" style={{ textAlign: 'center' }}>
              <div>{skill.skill}</div>

              <Rate disabled defaultValue={skill.rate} />
            </Space>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default SkillForm
