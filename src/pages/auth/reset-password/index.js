import React from 'react'
import { Helmet } from 'react-helmet'
import ResetPassword from '@vb/components/Auth/ResetPassword'

const SystemResetPassword = () => {
  return (
    <div>
      <Helmet title="Reset Password" />
      <ResetPassword />
    </div>
  )
}

export default SystemResetPassword
