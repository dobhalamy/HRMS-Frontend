import React from 'react'
import { Modal, Button, Form, Input, Col, Row, Select, notification } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { getAgentList } from 'redux/allEmployee/action'
import { trainerDetailsUpdate } from 'services/axios/emp'

const AddRetrainingForm = ({ showRetrainingForm, agentData, setShowRetrainingForm }) => {
  const [form] = Form.useForm()
  const loading = useSelector((state) => state?.toggle?.loading)
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const dispatch = useDispatch()
  const onFinishHandler = async (values) => {
    const { trainerDetails } = values
    setShowRetrainingForm(() => false)
    const userId = agentData?.userId
    if (userId) {
      const confirmSubmit = window.confirm('Are you sure you want to assign trainer?')
      if (confirmSubmit) {
        const trainerId = trainerDetails
        const res = await trainerDetailsUpdate({ userId, trainerId })
        if (res && res.status === 200) {
          dispatch(getAgentList({ skip, limit, employeeName: null }))
          notification.success({
            message: 'Success',
            description:
              'An Agent is assign a trainer marking the beginning of retraining phase. This agent is now visible to trainer',
          })
        }
      }
    }
  }

  return (
    <Modal
      title="Retraining Agent Form"
      centered
      visible={showRetrainingForm}
      width={800}
      onCancel={() => setShowRetrainingForm(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowRetrainingForm(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="retrainingAgent"
          onClick={() => form.submit()}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        name="retrainingAgent"
        style={{
          padding: '2rem',
        }}
        layout="vertical"
        form={form}
        onFinish={onFinishHandler}
      >
        <Row gutter={26}>
          <Col className="gutter-row" span={8}>
            <Form.Item initialValue={agentData?.empId} label="Employee ID" name="traineeId">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item initialValue={agentData?.userName} label="Employee Name" name="userName">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label="Trainer"
              name="trainerDetails"
              rules={[
                {
                  required: true,
                  message: 'Please select trainer',
                },
              ]}
              initialValue={agentData?.trainerDetails?.userId}
            >
              <Select
                size="large"
                placeholder="Select Trainer"
                defaultValue={agentData?.trainerDetails?.userName}
              >
                {agentData?.trainerList?.map((item) => (
                  <option key={item?.userId} value={item?.userId}>
                    {item?.userName}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddRetrainingForm
