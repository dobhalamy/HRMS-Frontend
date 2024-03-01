import React from 'react'
import { useSelector } from 'react-redux'
import { Modal, Table } from 'antd'
import style from '../style.module.scss'

const MonthlyAttendance = ({ showMonthModal, setShowMonthModal, empData }) => {
  const newRecord = useSelector((state) => state.attendanceData.newRecord)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const handleClose = () => {
    setShowMonthModal(() => false)
  }
  const monthlyColumn = [
    {
      title: 'Date',
      width: '10%',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time In',
      width: '10%',
      dataIndex: 'timeIn',
      key: 'timeIn',
    },
    {
      title: 'Time Out',
      width: '10%',
      dataIndex: 'timeOut',
      key: 'timeOut',
    },
  ]
  return (
    <>
      <Modal
        title="Attendance"
        centered
        visible={showMonthModal}
        onCancel={handleClose}
        dots="false"
        footer={null}
        width={700}
      >
        <div className={style.EmpModal_Heading}>
          <h5>Employee Name: {empData?.name}</h5>
          <h5>Month: {empData?.month}</h5>
          <h5>Year: {empData?.year}</h5>
        </div>
        <Table
          dataSource={newRecord}
          columns={monthlyColumn}
          loading={isLoading}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </>
  )
}
export default MonthlyAttendance
