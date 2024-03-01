import React, { useState } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { Link } from 'react-router-dom'
import apiClient from 'services/axios'
import style from '../style.module.scss'

const ForgotPassword = () => {
  const [isMailSent, setIsMailSent] = useState(false)
  const onFinish = async (values) => {
    const { hostname } = window.location
    const frontendUrl = hostname === 'localhost' ? 'localhost:3000' : hostname
    const valuesWithUrl = {
      ...values,
      url: frontendUrl,
    }

    const response = await apiClient.post('/resetPassword', valuesWithUrl)
    if (response?.data?.status && response?.status === 200) {
      notification.success({
        message: 'Success',
        description: response?.data?.message,
      })
      setIsMailSent(true)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="mt-5 pt-2">
      <div className={`card ${style.container}`}>
        {!isMailSent ? (
          <div>
            <div className="text-dark font-size-32 mb-3">Forget Password</div>
            <Form
              layout="vertical"
              hideRequiredMark
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="mb-4"
            >
              <Form.Item
                name="emailId"
                rules={[
                  {
                    type: 'email',
                    required: true,
                    message: 'Please input your e-mail address',
                  },
                ]}
              >
                <Input placeholder="Email Address" />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="text-center w-100">
                <strong>Send Mail</strong>
              </Button>
            </Form>
            <Link to="/auth/login" className="vb__utils__link">
              <i className="fe fe-arrow-left mr-1 align-middle" />
              Go to Sign in
            </Link>
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              fontFamily: 'Arial, sans-serif',
              color: '#333',
            }}
          >
            <p style={{ color: 'orange', fontSize: '18px', fontWeight: 'bold' }}>
              Password Reset Email Sent
            </p>
            <p style={{ fontSize: '16px' }}>Reset Password link has been sent to your email</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
