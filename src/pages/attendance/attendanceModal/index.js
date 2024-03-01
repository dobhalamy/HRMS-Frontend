import React from 'react'
import { Modal, Card } from 'antd'
import style from '../style.module.scss'

const AttendanceModel = ({ open, handleCancel, data }) => {
  return (
    <>
      <Modal
        title="Attendance"
        centered
        visible={open}
        onCancel={handleCancel}
        dots="false"
        footer={null}
        width={700}
      >
        <Card>
          <div className={style.EmpModal_Heading}>
            <h5>{data ? data.name : 'User'}</h5>
          </div>
          <table className={style.EmpModal_table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Present Days</th>
                <th>Working Days</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.data.map((items, index) => (
                  <tr key={index}>
                    <td>{items?.month}</td>
                    <td>{items?.presentDays}</td>
                    <td>{items?.workingDays}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      </Modal>
    </>
  )
}
export default AttendanceModel
