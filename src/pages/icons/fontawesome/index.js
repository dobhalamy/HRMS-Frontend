import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersHeading3 from '@vb/widgets/Headers/Heading3'
import HiddenIconsFontawesome from '@vb/widgets/Hidden/IconsFontawesome'

const Fontawesome = () => {
  return (
    <div>
      <Helmet title="Fontawesome" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{ title: 'Fontawesome', button: 'Go to Docs', url: 'http://fontawesome.io/' }}
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <HiddenIconsFontawesome />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fontawesome
