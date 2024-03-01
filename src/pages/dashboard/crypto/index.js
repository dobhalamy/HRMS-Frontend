import React from 'react'
import { Helmet } from 'react-helmet'
import CryptoCryptoList from '@vb/widgets/Crypto/CryptoList'
import HeadersCardHeader3 from '@vb/widgets/Headers/CardHeader3'
import CryptoCryptoChart from '@vb/widgets/Crypto/CryptoChart'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import CryptoCryptoOrders from '@vb/widgets/Crypto/CryptoOrders'
import CryptoCryptoHistory from '@vb/widgets/Crypto/CryptoHistory'
import CryptoCryptoLoadTable from '@vb/widgets/Crypto/CryptoLoadTable'

const CryptoTerminal = () => {
  return (
    <div>
      <Helmet title="Crypto Terminal" />
      <div className="row">
        <div className="col-lg-3 col-md-12">
          <div className="card-placeholder">
            <div className="card-body">
              <CryptoCryptoList />
            </div>
          </div>
        </div>
        <div className="col-lg-9 col-md-12">
          <div className="card card-top card-top-success">
            <div className="card-header py-0">
              <HeadersCardHeader3 data={{ title: 'BTC-USD Market' }} />
            </div>
            <div className="card-body">
              <CryptoCryptoChart />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersCardHeader data={{ title: 'Order Book' }} />
            </div>
            <div className="card-body">
              <CryptoCryptoOrders />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersCardHeader data={{ title: 'Market History' }} />
            </div>
            <div className="card-body">
              <CryptoCryptoHistory />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersCardHeader data={{ title: 'My Open Orders' }} />
            </div>
            <div className="card-body">
              <CryptoCryptoLoadTable />
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <HeadersCardHeader data={{ title: 'My Order History' }} />
            </div>
            <div className="card-body">
              <CryptoCryptoLoadTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoTerminal
