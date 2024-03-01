import React from 'react'
import { Form, Modal, Input, Row, Col, Button, notification } from 'antd'
import { getAllClientInfo } from 'redux/clientInfo/action'
import { useDispatch } from 'react-redux'
import { updateClientInfo } from 'services/axios/clientManagement'
import PhoneNumberInput from 'components/phoneNumberInput'

const EditClient = ({ showEditForm, setShowEditForm, clientData }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const onCancelModalHandle = () => {
    setShowEditForm(false)
  }
  const onFinishFailed = () => {
    notification.error({
      message: 'Error',
    })
  }

  const onFinish = async (values) => {
    const updatedData = {
      ...values,
      id: clientData?.id,
    }
    const updatedClientData = await updateClientInfo(updatedData)
    if (updatedClientData?.status === 200) {
      notification.success({
        message: 'Client Details Updated',
      })
      dispatch(getAllClientInfo({ skip: 0, limit: 10 }))
      setShowEditForm(false)
    }
  }

  const handleBusinessPhoneChange = (phone) => {
    form.setFieldsValue({ businessPhoneNumber: phone.trim() })
    form.validateFields(['businessPhoneNumber'])
  }

  return (
    <Modal
      title="Edit Client Details"
      visible={showEditForm}
      onCancel={onCancelModalHandle}
      centered
      width={1000}
      footer={false}
    >
      <Form
        name="editClientDetails"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        onFinishFailed={onFinishFailed}
        // initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="businessName"
              initialValue={clientData?.businessName}
              label={
                <div>
                  Business Name{' '}
                  {/* <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                    <InfoCircleOutlined />
                    </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input Business Name ',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="businessAddress"
              initialValue={clientData?.businessAddress}
              label={
                <div>
                  Business Address{' '}
                  {/* <Tooltip title={formHintBoxMessage.CONCERN_DATE}>
                    <InfoCircleOutlined />
                  </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input Business Address',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label={<div>Business Phone Number </div>}
              name="businessPhoneNumber"
              rules={[
                {
                  required: true,
                  message: 'Please enter a valid Phone Number',
                  // pattern: new RegExp(/^91[6789]\d{9}$/),
                },
              ]}
            >
              <PhoneNumberInput
                country="in"
                placeholder="Enter phone number"
                phoneNumber={clientData?.businessPhoneNumber}
                onPhoneChange={handleBusinessPhoneChange}
              />
            </Form.Item>
            {/* <Form.Item
              name="businessPhoneNumber"
              label={<div>Business Phone Number </div>}
              initialValue={clientData?.businessPhoneNumber}
              rules={[
                {
                  required: true,
                  message: 'Please enter a valid Phone Number',
                  pattern: new RegExp(/^[6789]\d{9}$/),
                },
              ]}
            >
              <Input />
            </Form.Item> */}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label="Business Email"
              name="businessEmail"
              initialValue={clientData?.businessEmail}
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please input business email',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="contactPersonName"
              initialValue={clientData?.contactPersonName}
              label={
                <div>
                  Contact Personal Name{' '}
                  {/* <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                    <InfoCircleOutlined />
                    </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input Contact Personal Name',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label="Contact Personal Email"
              name="contactPersonEmail"
              initialValue={clientData?.contactPersonEmail}
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please input your personal email',
                },
              ]}
            >
              <Input />
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

export default EditClient
