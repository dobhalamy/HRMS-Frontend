import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersHeading2 from '@vb/widgets/Headers/Heading2'
import WidgetsGeneral19 from '@vb/widgets/WidgetsGeneral/19'
import WidgetsGeneral21v2 from '@vb/widgets/WidgetsGeneral/21v2'
import WidgetsGeneral21 from '@vb/widgets/WidgetsGeneral/21'
import WidgetsLists10 from '@vb/widgets/WidgetsLists/10'
import WidgetsGeneral20v1 from '@vb/widgets/WidgetsGeneral/20v1'
import ChartsChartistjs7 from '@vb/widgets/ChartsChartistjs/7'
import ChartsChartistjs10 from '@vb/widgets/ChartsChartistjs/10'
import WidgetsGeneral1v1 from '@vb/widgets/WidgetsGeneral/1v1'
import AppPartialsCalendar from '@vb/widgets/AppPartials/Calendar'

const DashboardBeta = () => {
  return (
    <div>
      <Helmet title="Dashboard Beta" />
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'Account Information',
                  description: 'Block with important Account information',
                }}
              />
            </div>
            <div className="card-body">
              <WidgetsGeneral19 />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'Server Statistics',
                  description: 'Block with important Account information',
                }}
              />
            </div>
            <div className="card-body bg-light rounded">
              <WidgetsGeneral21v2 />
            </div>
            <div className="card-body bg-light rounded">
              <WidgetsGeneral21v2 />
            </div>
            <div className="card-body bg-success text-white rounded">
              <WidgetsGeneral21 />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'Work Progress',
                  description: 'Block with important Account information',
                }}
              />
            </div>
            <div className="card-body">
              <WidgetsLists10 />
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'Account Settings',
                  description: 'Block with important Account information',
                }}
              />
            </div>
            <WidgetsGeneral20v1 />
          </div>
          <div className="card card-top card-top-success">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'User Divergence',
                  description: 'Block with important Account information',
                }}
              />
            </div>
            <div className="card-body">
              <ChartsChartistjs7 />
            </div>
          </div>
          <div className="card card-top card-top-primary">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'Months Activity',
                  description: 'Block with important Account information',
                }}
              />
            </div>
            <div className="card-body">
              <ChartsChartistjs10 />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersHeading2
                data={{ title: 'Revenue', description: 'Block with important Account information' }}
              />
            </div>
            <div className="card-body">
              <WidgetsGeneral1v1 />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <AppPartialsCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardBeta
