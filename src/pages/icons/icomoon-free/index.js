import React from 'react'
import { Helmet } from 'react-helmet'
import HeadersHeading3 from '@vb/widgets/Headers/Heading3'
import HiddenIconsIcomoonFree from '@vb/widgets/Hidden/IconsIcomoonFree'

const IcomoonFree = () => {
  return (
    <div>
      <Helmet title="Icomoon Free" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card-placeholder">
            <div className="card-header">
              <HeadersHeading3
                data={{
                  title: 'Icomoon Free',
                  button: 'Go to Docs',
                  url: 'https://icomoon.io/#icons-icomoon',
                }}
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <HiddenIconsIcomoonFree />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IcomoonFree
