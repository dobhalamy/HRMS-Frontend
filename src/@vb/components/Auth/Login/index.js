import React, { useEffect } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { history } from 'index'
import { getLoggedInUserInfo } from 'utils'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { login } from 'services/axios/auth'
import { isEmpty } from 'lodash'
// import { getUserInfo } from 'services/axios/emp'
import { getTeamForSelectedEmployee } from 'redux/projectInfo/action'
import { fetchEmpLeaveRequestData } from 'redux/empLeave/action'
import { statusEnums } from 'enums/userRole'
import style from '../style.module.scss'

const Login = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const leaveRequests = useSelector((state) => state?.empLeaveData?.leaveRequestData?.leaveRequest)
  const team = useSelector((state) => state?.projectInfo?.team)

  useEffect(() => {
    const userRole = getLoggedInUserInfo()?.userRole
    if (userRole) {
      history.push('/dashboard')
    }
  }, [])

  useEffect(() => {
    const userRole = getLoggedInUserInfo()?.userRole
    const userId = getLoggedInUserInfo()?.userId
    if (userRole) {
      const devLeaveRequest = leaveRequests?.filter(
        (data) => data?.leaveStatus === statusEnums.PENDING && data?.requestedUserId !== userId,
      )
      if (devLeaveRequest?.length > 0) {
        notification.success({
          message: 'Leave Requests Pending',
          description: 'Employees leave request are pending',
        })
      }
    }
  }, [leaveRequests])

  useEffect(() => {
    const userRole = getLoggedInUserInfo()?.userRole
    if (userRole) {
      dispatch(
        fetchEmpLeaveRequestData({
          // leaveStatus: 0,
          skip: 0,
          limit: 10,
          employeeValue: null,
          team: JSON.stringify(team),
        }),
      )
    }
  }, [team, dispatch])
  const onFinish = async (values) => {
    const response = await login(values)
    if (response?.data?.token) {
      const token = response.data?.token
      const permissions = response.data?.permissions
      const userEmail = response?.data?.user
      Cookies.set('accessToken', token, { expires: 1 })
      Cookies.set('permissions', JSON.stringify(permissions), { expires: 1 })
      const userInformation = getLoggedInUserInfo()
      userInformation.email = userEmail
      const userRole = userInformation?.userRole
      const userId = userInformation?.userId
      // warning if user does not have any module permissions assigned
      if (isEmpty(permissions) && userRole !== 'super_admin') {
        notification.warning({
          message: 'Warning',
          description: 'Please contact your administrator',
        })
      } else {
        await dispatch(getTeamForSelectedEmployee(userId))
        history.push('/dashboard')

        notification.success({
          message: 'Success',
          description: response?.data?.message,
        })
      }
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className="pt-2 pb-5 text-center">
        <div className={style.logo}>
          <h2>Value Portal</h2>
        </div>
      </div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-32 mb-3">Sign In</div>
        <div className="mb-4">Sign in with credentials</div>
        <div className="mb-4" />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input your email id' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <div className="mb-4">
            <a href="/auth/forgot-password">Forget Password?</a>
          </div>
          <Button
            type="primary"
            className="text-center w-100 btn btn-success"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            <strong>Sign in</strong>
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login
