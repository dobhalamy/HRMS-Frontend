import React, { useState } from 'react'
import { Button, Modal, Row, Col, Input, Form, notification } from 'antd'
import { getAllClientInfo } from 'redux/clientInfo/action'
import { addNewClient } from 'services/axios/clientManagement'
import { useDispatch } from 'react-redux'
import PhoneNumberInput from 'components/phoneNumberInput'

const AddNewClient = () => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleOpenModal = async () => {
    setModalVisible(true)
  }
  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleFormSubmit = async (values) => {
    const addedNewClient = await addNewClient(values)
    if (addedNewClient?.status) {
      notification.success({
        message: 'New Client Added',
      })
      setModalVisible(false)
      form.resetFields()
      dispatch(getAllClientInfo({ skip: 0, limit: 10 }))
    }
  }

  const handleBusinessPhoneChange = (phone) => {
    form.setFieldsValue({ businessPhoneNumber: phone.trim() })
    form.validateFields(['businessPhoneNumber'])
  }

  // const handlePersonalPhoneChange = (phone) => {
  //   form.setFieldsValue({ clientMobileNumber: phone.trim() })
  //   form.validateFields(['clientMobileNumber'])
  // }

  return (
    <>
      <Button type="primary" onClick={handleOpenModal} size="large" id="addClient">
        Add New Client
      </Button>
      <Modal
        title="Add New Client"
        visible={modalVisible}
        onCancel={handleCloseModal}
        centered
        // initialValues={initialValues}
        width={1000}
        footer={false}
      >
        <Form
          onFinish={handleFormSubmit}
          layout="vertical"
          autoComplete="off"
          form={form}
          // initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="businessName"
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
                label={<div>Business Address </div>}
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
                  onPhoneChange={handleBusinessPhoneChange}
                />
              </Form.Item>
              {/* <Form.Item
                label={
                  <div>
                    Business Phone Number{' '}
                  </div>
                }
                name="empMobileNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a valid Phone Number',
                    pattern: new RegExp(/^91[6789]\d{9}$/),
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
              {/* <Form.Item
                label={
                  <div>
                    Client Phone Number{' '}
                  </div>
                }
                name="clientMobileNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a valid Phone Number',
                    pattern: new RegExp(/^91[6789]\d{9}$/),
                  },
                ]}
              >
                <PhoneNumberInput
                  country="in"
                  placeholder="Enter phone number"
                  onPhoneChange={handlePersonalPhoneChange}
                />
              </Form.Item> */}
              <Form.Item
                name="contactPersonName"
                label={<div>Client Name </div>}
                rules={[
                  {
                    required: true,
                    message: 'Please input Client Name ',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Client Email"
                name="contactPersonEmail"
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
    </>
  )
}

export default AddNewClient
