import { isEmpty } from 'lodash'
import React, { Suspense } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { getLoggedInUserInfo } from 'utils'

const ProtectedRoute = ({ routerAnimation, Component, roles, modules, ...rest }) => {
  const userRoles = getLoggedInUserInfo()?.userRoles
  const userRole = getLoggedInUserInfo()?.userRole
  if (userRoles !== undefined) {
    userRoles['404'] = ['all']
  }

  let isAuthenticate = userRole === 'super_admin' || false
  if (userRole !== 'super_admin' && !isEmpty(userRoles)) {
    for (let i = 0; i < modules?.length; i += 1) {
      const module = modules[i]
      if (Object.prototype.hasOwnProperty.call(userRoles, module)) {
        isAuthenticate = true
        break
      }
    }
  }

  return (
    <Route
      {...rest}
      render={() => {
        if (isEmpty(userRoles) || userRole !== 'super_admin') {
          return (
            <div className={routerAnimation}>
              <Suspense fallback={null}>
                <Component />
              </Suspense>
            </div>
          )
        }
        if (!isAuthenticate) {
          return <Redirect to="/auth/404" />
        }

        return (
          <div className={routerAnimation}>
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          </div>
        )
      }}
    />
  )
}
export default ProtectedRoute
