import React from 'react'
import { connect } from 'react-redux'
// import productLogo from '../../../../public/resources/images/products/vv-logo.png'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({ settings })

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <a
          href="https://Virtuevise.com"
          target="_blank"
          rel="noopener noreferrer"
          className={style.logo}
        >
          <div className={style.logo}>
            {/* <img src={productLogo} width="100" height="auto" alt={`logo-${productLogo}`} /> */}
            <h2>Value Portal 2.0</h2>
          </div>
        </a>
        <br />
        <p className="mb-0">
          Copyright © {new Date().getFullYear()}{' '}
          <a href="https://Virtuevise.com" target="_blank" rel="noopener noreferrer">
            Virtuevise.com
          </a>
          {' | '}
          <a href="https://Virtuevise.com/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Footer)
