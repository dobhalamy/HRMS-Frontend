import React from 'react'
import { Progress } from 'antd'

const DashboardWidget = ({ title, taken = 0, total = 0 }) => {
  const percent = taken ? Math.round((taken / total) * 100) : 0
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="pr-3">
          <h2 className="font-size-18 font-weight-bold mb-1 text-dark">{title || 'Total WFH'}</h2>
          <p className="font-size-15 mb-3">{taken}</p>
        </div>
        <div className="text-success font-weight-bold font-size-24">{total}</div>
      </div>
      <div className="mb-3">
        <Progress
          type="line"
          percent={percent}
          showInfo={false}
          strokeWidth={12}
          strokeColor="#46be8a"
        />
      </div>
      <div className="d-flex text-gray-5 justify-content-between font-size-14">
        <span className="text-uppercase">{percent}%</span>
      </div>
    </div>
  )
}

export default DashboardWidget
