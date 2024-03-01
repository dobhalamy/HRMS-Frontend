import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersHeading3 from '@vb/widgets/Headers/Heading3'
import HiddenIconsLineariconsFree from '@vb/widgets/Hidden/IconsLineariconsFree'

const Linearicons = () => {
  return (
    <div>
      <Helmet title="Linearicons" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{
                  title: 'Linearicons Free',
                  button: 'Go to Docs',
                  url: 'https://linearicons.com/free',
                }}
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <HiddenIconsLineariconsFree />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Linearicons
