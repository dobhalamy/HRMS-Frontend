import React from 'react'
import { Progress } from 'antd'

const Chart12 = ({ title, takenLeave, totalLeave }) => {
  const percent = ((takenLeave / totalLeave) * 100).toFixed(1)
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="pr-3">
          <h2 className="font-size-18 font-weight-bold mb-1 text-dark">
            {title || 'Total Profit'}
          </h2>
          <p className="font-size-15 mb-3">{takenLeave || 0}</p>
        </div>
        <div className="text-primary font-weight-bold font-size-24">{totalLeave || 14}</div>
      </div>
      <div className="mb-3">
        <Progress
          type="line"
          percent={percent}
          showInfo={false}
          strokeWidth={12}
          strokeColor="#007bff"
        />
      </div>
      <div className="d-flex text-gray-5 justify-content-end font-size-14">
        <span className="text-uppercase">{percent}%</span>
      </div>
    </div>
  )
}

export default Chart12
