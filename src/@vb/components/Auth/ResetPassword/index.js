import React, { useEffect, useState } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { Link } from 'react-router-dom'
import apiClient from 'services/axios'
import style from '../style.module.scss'

const ResetPassword = () => {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  const token = url.searchParams.get('token')
  const [isExpire, setIsExpired] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [apiCallCompleted, setApiCallCompleted] = useState(false)
  // eslint-disable-next-line
  useEffect(async () => {
    if (token) {
      try {
        const res = await apiClient.get(`resetPassword/compareToken/${token}`)
        if (res.status !== 200) {
          setIsExpired(true)
        }
        setApiCallCompleted(true)
      } catch (error) {
        console.error('Error:', error)
        setApiCallCompleted(true)
      }
    }
  }, [token])

  if (!apiCallCompleted) {
    return <div>Loading...</div>
  }

  const onFinish = async (values) => {
    try {
      const res = await apiClient.get(`resetPassword/setExpiredLink/${token}`)
      if (res?.status === 200) {
        const { email } = res?.data?.data
        console.log(email)

        const data = {
          ...values,
          email,
        }
        const result = await apiClient.post('resetPassword/updatePassword', data)
        if (result.status === 200) {
          notification.success({
            message: 'Success',
            description: result?.data?.message,
          })
          setPasswordReset(true)
        }
      } else {
        console.error('API Error:', res)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="mt-5 pt-2">
      <div className={`card ${style.container}`}>
        {!isExpire && !passwordReset ? (
          <div>
            <div className="text-dark font-size-32 mb-3">Reset Password</div>
            <Form
              layout="vertical"
              //   hideRequiredMark
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="mb-4"
            >
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input new password',
                  },
                  {
                    min: 6, // Minimum password length
                    message: 'Password must be at least 6 characters long.',
                  },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, // Password complexity regex
                    message:
                      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['newPassword']} // Make it dependent on the 'newPassword' field
                rules={[
                  {
                    required: true,
                    message: 'Please input confirm password',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('The two passwords do not match'))
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="text-center w-100">
                <strong>Reset Password</strong>
              </Button>
            </Form>
            <Link to="/auth/login" className="vb__utils__link">
              <i className="fe fe-arrow-left mr-1 align-middle" />
              Go to Sign in
            </Link>
          </div>
        ) : (
          !passwordReset && (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
              }}
            >
              <p style={{ fontSize: '16px' }}>The time for this link is over.</p>
              <Link to="/auth/forgot-password" className="vb__utils__link">
                <i className="fe fe-arrow-left mr-1 align-middle" />
                Go to Forget Password
              </Link>
            </div>
          )
        )}
        {passwordReset && (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              fontFamily: 'Arial, sans-serif',
              color: '#333',
            }}
          >
            <p style={{ fontSize: '16px' }}>Sign in through new password</p>
            <Link to="/auth/login" className="vb__utils__link">
              <i className="fe fe-arrow-left mr-1 align-middle" />
              Go to Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
export default ResetPassword
