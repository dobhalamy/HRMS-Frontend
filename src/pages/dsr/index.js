import React from 'react'
import { getLoggedInUserInfo } from 'utils'
import AddDsr from './addDsr'
import DsrTable from './dsrTable'

const index = () => {
  const userRole = getLoggedInUserInfo()?.userRole
  return (
    <>
      {userRole !== 'super_admin' && (
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <AddDsr />
        </div>
      )}

      <DsrTable />
    </>
  )
}

export default index
