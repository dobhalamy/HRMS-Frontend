import React from 'react'
import { Table, Card } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import { downloadPdf } from 'utils'
import SideMenu from '../../attendance/sideMenu'

const AdminSalarySlip = ({
  handleChangedPagination,
  getSalarySlipYear,
  salarySlip,
  totalCount,
  year,
}) => {
  const getSlipYear = (attendanceYear) => {
    getSalarySlipYear(attendanceYear)
  }
  const handlePageChange = (pageNumber) => {
    handleChangedPagination(pageNumber)
  }

  const columns = [
    {
      title: 'Document Type',
      key: 'DocumentType',
      dataIndex: 'mediaType',
    },
    {
      title: 'EMPLOYEE ID',
      key: 'key',
      dataIndex: 'employeeId',
    },
    {
      title: 'EMPLOYEE NAME',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'UPLOAD DATE',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a, b) => new Date(a.uploadDate) - new Date(b.uploadDate),
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div style={{ cursor: 'pointer', display: 'flex', gap: '1rem' }}>
          <DownloadOutlined title="Download" onClick={() => downloadPdf(record?.mediaLink)} />
        </div>
      ),
    },
  ]

  const data = salarySlip.map((item) => ({
    key: item?.id,
    employeeId: item?.empId,
    employeeName: item?.employee?.userName,
    uploadDate: moment(item.createdAt).format('DD-MM-YYYY'),
    mediaLink: item?.mediaLink,
    mediaType: item?.mediaType,
  }))

  return (
    <>
      <Card
        style={{ textAlign: 'center' }}
        title={`Employee Salary Slip ${year}`}
        extra={<SideMenu onChange={getSlipYear} currentYear={year} />}
      >
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize: 10,
            responsive: true,
            showSizeChanger: false,
            total: totalCount,
            onChange: handlePageChange,
          }}
        />
      </Card>
    </>
  )
}

export default AdminSalarySlip
