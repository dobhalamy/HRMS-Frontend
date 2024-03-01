import React from 'react'
import { Button, Card, Tag } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { downloadPdf } from 'utils'
import SideMenu from '../../attendance/sideMenu'

const UserSalarySlip = ({ salarySlip, year, getSalarySlipYear }) => {
  const getSlipYear = (attendanceYear) => {
    getSalarySlipYear(attendanceYear)
  }

  return (
    <Card
      style={{ textAlign: 'center' }}
      title={`Employee Salary Slip ${year}`}
      extra={<SideMenu onChange={getSlipYear} />}
    >
      <div className="row">
        {salarySlip?.length > 0 ? (
          salarySlip.map((item) =>
            item.data.map((newItem, key) => (
              <div className="col-lg-3 col-md-12" key={key}>
                <div className="card">
                  <div className="card-body">
                    <h5 style={{ marginBottom: '2rem' }}>
                      <Tag color="#4f4f51" key={key}>
                        {item?.monthNames}
                      </Tag>
                    </h5>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<DownloadOutlined />}
                      size="middle"
                      onClick={() => downloadPdf(newItem?.mediaLink)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )),
          )
        ) : (
          <p>No data found for {year}.</p>
        )}
      </div>
    </Card>
  )
}

export default UserSalarySlip
