import React from 'react'
import { useSelector } from 'react-redux'
import AttendanceTable from './attendanceTable/index'
import EmployeeModel from './empAttendance'

const Index = () => {
  const userData = useSelector((state) => state.user.userInfo)
  const userRole = userData?.userRole
  return <>{userRole !== 'hr' ? <EmployeeModel /> : <AttendanceTable />}</>
}

export default Index
