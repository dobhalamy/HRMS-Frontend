import React from 'react'
import { Helmet } from 'react-helmet'
import WidgetsCharts12 from '@vb/widgets/WidgetsCharts/12'
import DashboardWidget from '@vb/widgets/WidgetsCharts/12v1'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import { Row } from 'antd'
import { leaveEnums } from 'enums/leave'
import { history } from 'index'
import AttendanceCalendar from '../../leave/employeeLeave/index'

const DashboardGamma = () => {
  const handleClick = (route) => {
    history.push(route)
  }

  return (
    <div id="dashboardData">
      <Helmet title="Dashboard Gamma" />
      <Row>
        <div className="col-lg-4 col-md-12">
          <div
            className="card"
            role="button"
            tabIndex={0}
            onClick={() => handleClick('/calendar')}
            onKeyDown={(e) => e.key === 'Enter' && handleClick('/calendar')}
            // onClick={handleClick}
          >
            <div className="card-body">
              <WidgetsCharts12
                title="Sick & Casual Leave"
                taken={0}
                // takenLeave={sickAndCasualLeave || 0}
                totalLeave={leaveEnums.SICK_AND_CASUAL_LEAVE}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div
            className="card"
            role="button"
            tabIndex={0}
            onClick={() => handleClick('/calendar')}
            onKeyDown={(e) => e.key === 'Enter' && handleClick('/calendar')}
            // onClick={handleClick}
          >
            <div className="card-body">
              <DashboardWidget
                title="Earned Leave"
                taken={0}
                // taken={earnLeave || 0}
                total={leaveEnums.EARNED_LEAVE}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div
            className="card"
            role="button"
            tabIndex={0}
            onClick={() => handleClick('/calendar')}
            onKeyDown={(e) => e.key === 'Enter' && handleClick('/calendar')}
            // onClick={handleClick}
          >
            <div className="card-body">
              <WidgetsCharts12
                title="WFH"
                // takenLeave={wfh || 0}
                taken={0}
                totalLeave={leaveEnums.TOTAL_WFH}
              />
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <HeadersCardHeader data={{ title: 'Upcoming Events' }} />
            </div>
            <div className="card-body">
              <AttendanceCalendar hideLeaderBoard />
            </div>
          </div>
        </div>
      </Row>
    </div>
  )
}

export default DashboardGamma
