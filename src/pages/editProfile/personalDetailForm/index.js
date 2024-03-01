import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Input, Button, notification, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { updateEmployeeData } from 'services/axios/emp'
import { formHintBoxMessage } from 'utils'

const PersonalDetailForm = ({ userDetailedInfo, onUpdate }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Error',
    })
    console.log(errorInfo)
  }

  useEffect(() => {
    if (userDetailedInfo) {
      setLoading(false)
      form.setFieldsValue({
        empId: userDetailedInfo?.empId ? userDetailedInfo?.empId : '',
        userName: userDetailedInfo?.userName ? userDetailedInfo?.userName : '',
        empMobileNumber: userDetailedInfo?.empMobileNumber
          ? userDetailedInfo?.empMobileNumber?.substring(2)
          : '',
        empCurrentAddress: userDetailedInfo?.empCurrentAddress
          ? userDetailedInfo?.empCurrentAddress
          : '',
        empPermanentAddress: userDetailedInfo?.empPermanentAddress
          ? userDetailedInfo?.empPermanentAddress
          : '',
        userPersonalEmail: userDetailedInfo?.userPersonalEmail
          ? userDetailedInfo?.userPersonalEmail
          : '',
        userFatherName: userDetailedInfo?.userFatherName || '',
        userMotherName: userDetailedInfo?.userMotherName || '',
      })
    }
  }, [userDetailedInfo, form])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      // Prepend "91" to the mobile number
      values.empMobileNumber = `91${values.empMobileNumber}`
      const updatedEmp = await updateEmployeeData({ ...userDetailedInfo, ...values })

      if (updatedEmp?.status === 200 && updatedEmp?.data?.status) {
        notification.success({
          message: 'Success',
          description: 'Employee updated successfully',
        })
        await onUpdate(updatedEmp?.data?.data)
      }
    } catch (error) {
      notification.success({
        message: 'Error',
        description: error,
      })
    }
  }

  return (
    <Form
      name="personalDetailForm"
      form={form}
      layout="vertical"
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Form.Item
            name="empId"
            key="empId"
            label="Employee ID"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item
            name="userName"
            key="Name"
            label={
              <div>
                Full Name{' '}
                <Tooltip title={formHintBoxMessage.NAME}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            }
            rules={[
              {
                required: true,
                message: 'Enter full name',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item label="Father Name" name="userFatherName" key="fatherName">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item label="Mother Name" name="userMotherName" key="motherName">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={
              <div>
                Personal Mobile Number{' '}
                <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            }
            name="empMobileNumber"
            key="personalMobileNumber"
            rules={[
              {
                required: true,
                message: 'Enter your personal mobile number',
              },
              { pattern: /^[6789]\d{9}$/, message: 'Please enter a valid mobile number.' },
            ]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={
              <div>
                Personal Email{' '}
                <Tooltip title={formHintBoxMessage.EMAIL}>
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
            }
            name="userPersonalEmail"
            key="personalEmail"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please enter personal email',
              },
            ]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <Form.Item
            label="Current Address"
            name="empCurrentAddress"
            key="currentAddress"
            rules={[
              {
                required: true,
                message: 'Please enter current address',
              },
            ]}
          >
            <Input.TextArea style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <Form.Item
            label="Permanent Address"
            name="empPermanentAddress"
            key="permanentAddress"
            rules={[
              {
                required: true,
                message: 'Please enter permanent address',
              },
            ]}
          >
            <Input.TextArea style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" form="personalDetailForm" onClick={handleSubmit}>
          Update
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PersonalDetailForm
