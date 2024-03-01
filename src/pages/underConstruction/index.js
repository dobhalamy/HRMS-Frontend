import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const SystemLockscreen = () => {
  ;<Helmet title="Underconstuction" />
  return (
    <div className="mt-5 pt-2">
      <div className="card">
        <div className="text-dark text-center font-size-32 mb-3">Coming Soon</div>
        <div className="text-center">
          <div className="d-inline-block mb-2">
            <img src="resources/images/content/home-slider.gif" alt="Mary Stanform" />
          </div>
          <div className="font-size-48 text-dark mb-4">
            <strong>Under Constuction</strong>
          </div>
        </div>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Already have an account?</span>
        <Link to="/auth/login" className="vb__utils__link">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default SystemLockscreen
