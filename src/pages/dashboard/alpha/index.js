import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersHeading from '@vb/widgets/Headers/Heading'
import WidgetsCharts11 from '@vb/widgets/WidgetsCharts/11'
import WidgetsCharts11v1 from '@vb/widgets/WidgetsCharts/11v1'
import WidgetsCharts11v2 from '@vb/widgets/WidgetsCharts/11v2'
import WidgetsCharts4 from '@vb/widgets/WidgetsCharts/4'
import WidgetsCharts4v1 from '@vb/widgets/WidgetsCharts/4v1'
import WidgetsCharts4v2 from '@vb/widgets/WidgetsCharts/4v2'
import HeadersHeading2 from '@vb/widgets/Headers/Heading2'
import TablesAntd3 from '@vb/widgets/TablesAntd/3'
import HeadersHeading3 from '@vb/widgets/Headers/Heading3'
import WidgetsGeneral17 from '@vb/widgets/WidgetsGeneral/17'
import WidgetsGeneral17v1 from '@vb/widgets/WidgetsGeneral/17v1'
import WidgetsGeneral17v2 from '@vb/widgets/WidgetsGeneral/17v2'
import WidgetsGeneral5 from '@vb/widgets/WidgetsGeneral/5'
import WidgetsGeneral6v1 from '@vb/widgets/WidgetsGeneral/6v1'
import WidgetsGeneral6 from '@vb/widgets/WidgetsGeneral/6'

const DashboardAlpha = () => {
  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <WidgetsCharts11 title="Total leave" />
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <WidgetsCharts11v1 />
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <WidgetsCharts11v2 />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading data={{ title: 'Today Statistics' }} />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsCharts4 />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsCharts4v1 />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsCharts4v2 />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <HeadersHeading2
                data={{
                  title: 'Recently Referrals',
                  description: 'Block with important Recently Referrals information',
                }}
              />
            </div>
            <div className="card-body">
              <TablesAntd3 />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{ title: 'Your Cards (3)', button: 'View All', url: 'https://google.com' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsGeneral17 />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsGeneral17v1 />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsGeneral17v2 />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{ title: 'Your accounts', button: 'View All', url: 'https://google.com' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsGeneral5 />
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="card-body">
              <WidgetsGeneral5 />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{
                  title: 'Recent Transactions',
                  button: 'View All',
                  url: 'https://google.com',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <WidgetsGeneral6v1 />
          </div>
          <div className="card">
            <WidgetsGeneral6 />
          </div>
          <div className="card">
            <WidgetsGeneral6v1 />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAlpha
