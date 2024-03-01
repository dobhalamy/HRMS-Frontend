import React from 'react'
import { Modal, Form, Row, Col, Button, Select, Input, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateTraineeData } from 'services/axios/emp'
import { getTraineeList } from 'redux/allEmployee/action'

const EditAssignTo = ({ empData, showTraineeAssignTo, setShowTraineeAssignTo, searchEmployee }) => {
  const [form] = Form.useForm()

  const loading = useSelector((state) => state?.toggle?.loading)
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const dispatch = useDispatch()

  const onFinishHandler = async (values) => {
    const traineeDetail = empData.Trainee
    const updateData = { ...traineeDetail, status: 3, ...values }
    const response = await updateTraineeData(updateData)
    if (response?.data?.status && response?.status === 200) {
      notification.success({
        message: 'Success',
        description: 'Trainee updated successfully',
      })
      setShowTraineeAssignTo(() => false)
      dispatch(getTraineeList({ skip, limit, employeeName: searchEmployee || null }))
    }
  }

  return (
    <Modal
      title="Update Trainee"
      centered
      visible={showTraineeAssignTo}
      width={800}
      onCancel={() => setShowTraineeAssignTo(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowTraineeAssignTo(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="update trainee"
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        name="update trainee"
        style={{
          padding: '2rem',
        }}
        layout="vertical"
        form={form}
        onFinish={onFinishHandler}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              initialValue={empData?.userName}
              label="Employee Name"
              name="userName"
              rules={[
                {
                  required: true,
                  message: 'Please input employee name',
                },
              ]}
            >
              <Input size="large" disabled />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label="TL"
              name="tlId"
              rules={[
                {
                  required: true,
                  message: 'Please select TL',
                },
              ]}
            >
              <Select size="large" placeholder="Select Team Leader">
                {empData?.tlList?.map((item) => (
                  <option key={item?.userId} value={item?.userId}>
                    {item?.userName}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label="Manager"
              name="managerId"
              rules={[
                {
                  required: true,
                  message: 'Please select manager',
                },
              ]}
            >
              <Select size="large" placeholder="Select Manager">
                {empData?.managerList?.map((item) => (
                  <option key={item?.userId} value={item?.userId}>
                    {item?.userName}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label="Assistant Manager"
              name="amId"
              rules={[
                {
                  required: true,
                  message: 'Please select AM',
                },
              ]}
            >
              <Select size="large" placeholder="Select Assistant Manager">
                {empData?.amList?.map((item) => (
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

export default EditAssignTo
