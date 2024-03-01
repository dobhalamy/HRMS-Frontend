import React, { lazy } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import Layout from 'layouts'
import ProtectedRoute from 'protectedRoutes'

const routes = [
  // VB:REPLACE-START:ROUTER-CONFIG
  {
    path: '/dashboard',
    Component: lazy(() => import('pages/dashboard/gamma')),
    exact: true,
    roles: ['employee', 'user', 'super_admin', 'hr'],
    modules: ['dashboard'],
  },
  {
    path: '/dashboard/alpha',
    Component: lazy(() => import('pages/dashboard/alpha')),
    exact: true,
    roles: ['employee', 'user', 'super_admin'],
    modules: [],
  },
  {
    path: '/dashboard/beta',
    Component: lazy(() => import('pages/dashboard/beta')),
    exact: true,
    roles: ['employee', 'user', 'super_admin'],
    modules: [],
  },
  {
    path: '/dashboard',
    Component: lazy(() => import('pages/dashboard/gamma')),
    exact: true,
    roles: ['employee', 'user', 'super_admin', 'hr', 'trainer'],
    modules: ['dashboard'],
  },
  {
    path: '/dashboard/crypto',
    Component: lazy(() => import('pages/dashboard/crypto')),
    exact: true,
    roles: ['employee', 'user', 'super_admin'],
    modules: [],
  },

  // configuration paths
  {
    path: '/config/term-and-condition',
    Component: lazy(() => import('pages/config/termAndCondition')),
    exact: true,
    roles: ['super_admin'],
    modules: ['terms_and_condition'],
  },
  {
    path: '/config/company-policy',
    Component: lazy(() => import('pages/config/companyPolicy')),
    exact: true,
    roles: ['super_admin'],
    modules: ['company_policy'],
  },
  {
    path: '/config/leave-policy',
    Component: lazy(() => import('pages/config/leavePolicy')),
    exact: true,
    roles: ['super_admin'],
    modules: ['leave_policy'],
  },
  {
    path: '/config/permissions',
    Component: lazy(() => import('pages/config/permissions')),
    exact: true,
    roles: ['super_admin'],
    modules: ['role_and_permissions'],
  },
  {
    path: '/config/module-permission',
    Component: lazy(() => import('pages/config/modulePermission')),
    exact: true,
    roles: ['super_admin'],
    modules: ['module_permission'],
  },
  {
    path: '/config/global-type-category',
    Component: lazy(() => import('pages/config/globaltypecategory')),
    exact: true,
    roles: ['super_admin'],
    modules: ['global_type_category'],
  },
  {
    path: '/config/global-type',
    Component: lazy(() => import('pages/config/globaltype')),
    exact: true,
    roles: ['super_admin'],
    modules: ['global_type'],
  },

  // employee management
  {
    path: '/emp/all-employee',
    Component: lazy(() => import('pages/emp')),
    exact: true,
    roles: ['super_admin', 'hr'],
    modules: ['employees'],
  },
  {
    path: '/emp/all-trainees',
    Component: lazy(() => import('pages/trainee')),
    exact: true,
    roles: ['super_admin', 'hr', 'trainer'],
    modules: ['trainee'],
  },
  // Attendance
  {
    path: '/attendance',
    Component: lazy(() => import('pages/attendance')),
    exact: true,
    roles: ['super_admin', 'employee', 'user'],
    modules: ['attendance'],
  },
  // down time
  {
    path: '/down-time',
    Component: lazy(() => import('pages/downTime')),
    exact: true,
    roles: ['super_admin', 'employee', 'user'],
    modules: ['down_time'],
  },
  // dsr
  {
    path: '/dsr',
    Component: lazy(() => import('pages/dsr')),
    exact: true,
    roles: ['super_admin', 'employee', 'user'],
    modules: ['dsr'],
  },
  // roster upload
  {
    path: '/roster',
    Component: lazy(() => import('pages/roster')),
    exact: true,
    roles: ['super_admin'],
    modules: ['roster'],
  },
  // exceptions
  // {
  //   path: '/exception',
  //   Component: lazy(() => import('pages/exception')),
  //   exact: true,
  //   roles: ['super_admin', 'employee', 'user'],
  //   modules: ['exception'],
  // },
  // Leave management
  {
    path: '/calendar',
    Component: lazy(() => import('pages/leave/employeeLeave')),
    exact: true,
    roles: ['hr', 'super_admin', 'employee', 'user'],
    modules: ['calender'],
  },
  // Leave approval
  {
    path: '/leave-request',
    Component: lazy(() => import('pages/leave/leaveRequest')),
    exact: true,
    roles: ['hr', 'super_admin', 'employee', 'user'],
    modules: ['leave_request', 'leave_approval'],
  },
  // RYG Status
  // {
  //   path: '/RYGstatus',
  //   Component: lazy(() => import('pages/RYGStatus')),
  //   exact: true,
  //   roles: ['hr', 'super_admin', 'employee', 'user'],
  //   modules: ['ryg_status'],
  // },
  // Happy to Help
  // {
  //   path: '/happy-to-help',
  //   Component: lazy(() => import('pages/happyToHelp')),
  //   exact: true,
  //   modules: ['happy_to_help'],
  //   roles: ['super_admin', 'employee', 'user'],
  // },
  // Edit Profile
  {
    path: '/profile',
    Component: lazy(() => import('pages/editProfile')),
    exact: true,
    modules: ['profile'],
    roles: ['super_admin', 'employee', 'user'],
  },
  // Salary slip for user
  {
    path: '/salary-slip',
    Component: lazy(() => import('pages/salarySlip/index')),
    exact: true,
    modules: ['salary_slip'],
    roles: ['super_admin', 'employee', 'user'],
  },
  // Documents
  {
    path: '/documents',
    Component: lazy(() => import('pages/documents')),
    exact: true,
    modules: ['documents'],
    roles: ['super_admin'],
  },

  // Auth
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
    modules: [],
    roles: ['employee', 'user', 'super_admin'],
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
    modules: [],
    roles: ['employee', 'user', 'super_admin'],
  },
  {
    path: '/auth/reset-password',
    Component: lazy(() => import('pages/auth/reset-password')),
    exact: true,
    modules: [],
    roles: ['employee', 'user', 'super_admin'],
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
    modules: [],
    roles: ['employee', 'user', 'super_admin'],
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
    modules: ['lockscreen'],
    roles: ['super_admin', 'employee', 'user'],
  },
  {
    path: '/under-construction',
    Component: lazy(() => import('pages/underConstruction')),
    exact: true,
    modules: ['under_construction'],
    roles: ['super_admin'],
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
    modules: ['404'],
    roles: ['employee', 'user', 'super_admin'],
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
    modules: ['500'],
    roles: ['employee', 'user', 'super_admin'],
  },
  // project management
  {
    path: '/project-management',
    Component: lazy(() => import('pages/projectManagement')),
    exact: true,
    modules: ['projectManagement'],
    roles: ['super_admin'],
  },
  // log management
  {
    path: '/log-management',
    Component: lazy(() => import('pages/logManagement')),
    exact: true,
    modules: ['logManagement'],
    roles: ['super_admin'],
  },
  {
    path: '/log-management/:fileName',
    Component: lazy(() => import('pages/logManagement/singleLogData')),
    exact: true,
    modules: ['singleLogData'],
    roles: ['super_admin'],
  },
  // client management
  {
    path: '/client-management',
    Component: lazy(() => import('pages/clientManagement')),
    exact: true,
    modules: ['clientManagement'],
    roles: ['super_admin'],
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={(state) => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    {/* VB:REPLACE-NEXT-LINE:ROUTER-REDIRECT */}

                    <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
                    {routes.map(({ path, Component, exact, roles, modules }) => (
                      <ProtectedRoute
                        key={path}
                        path={path}
                        exact={exact}
                        Component={Component}
                        roles={roles}
                        modules={modules}
                        routerAnimation={routerAnimation}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
