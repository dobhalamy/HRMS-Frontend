import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersHeading3 from '@vb/widgets/Headers/Heading3'
import HiddenIconsFeather from '@vb/widgets/Hidden/IconsFeather'

const FeatherIcons = () => {
  return (
    <div>
      <Helmet title="Feather Icons" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{
                  title: 'Feather Icons',
                  button: 'Go to Docs',
                  url: 'https://linearicons.com/free',
                }}
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <HiddenIconsFeather />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatherIcons
