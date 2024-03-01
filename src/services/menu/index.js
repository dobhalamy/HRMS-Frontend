import { isEmpty } from 'lodash'
import { getLoggedInUserInfo } from 'utils'

export default function getMenuData() {
  let menuData = []
  const userRole = getLoggedInUserInfo()?.userRole
  if (userRole === 'hr' || userRole === 'super_admin') {
    menuData = [
      {
        title: 'Dashboard',
        key: '2t2ghd',
        url: '/dashboard',
        module: 'dashboard',
        icon: 'fe fe-home',
      },
      {
        title: 'Configuration',
        key: '6rq4ze6',
        url: '/Configuration',
        module: 'configuration',
        icon: 'fe fe-settings',
        children: [
          {
            title: 'Global Type Category',
            url: '/config/global-type-category',
            module: 'global_type_category',
            key: 'e38wke',
          },
          {
            title: 'Global Type',
            url: '/config/global-type',
            module: 'global_type',
            key: 'e38wkesds',
          },
          {
            title: 'Role and Permissions',
            url: '/config/permissions',
            module: 'role_and_permissions',
            key: 'e38wkew',
          },
          {
            title: 'Module Permission',
            url: '/config/module-permission',
            key: 'e38wkex',
            module: 'module_permission',
          },
          {
            title: 'Terms and condition',
            url: '/config/term-and-condition',
            module: 'term_condition',
            key: 'e38wkea',
          },

          {
            title: 'Company Policy',
            url: '/config/company-policy',
            module: 'company_policy',
            key: 'eyu7wker',
          },
          {
            title: 'Leave Policy',
            url: '/config/leave-policy',
            module: 'leave_policy',
            key: 'lvoPrus',
          },
        ],
      },
      {
        title: 'HR Management',
        url: '/EmployeeManagement',
        module: 'hr_management',
        key: '6rs4ze6',
        icon: 'fe fe-user',
        children: [
          {
            title: 'Employees',
            url: '/emp/all-employee',
            module: 'employees',
            key: 'e38ws34ke',
          },
          {
            title: 'Attendance',
            url: '/attendance',
            module: 'attendance',
            key: 'e38wk3fesds',
          },
          {
            title: 'Trainee',
            url: '/emp/all-trainees',
            module: 'trainee',
            key: 'e38wk3feds',
          },
          // {
          //   title: 'Happy To Help',
          //   url: '/happy-to-help',
          //   module: 'happy_to_help',
          //   key: 'e38r4eqvd',
          // },
          {
            title: 'Daily Status Report',
            url: '/dsr',
            module: 'dsr',
            key: 'e38wk3fdak',
          },
          {
            title: 'Down time',
            url: '/down-time',
            module: 'down_time',
            key: 'e38wk3fdk',
          },
          {
            title: 'Roster',
            url: '/roster',
            module: 'roster',
            key: 'e38wk3fo',
          },
          // {
          //   title: 'Exception',
          //   url: '/exception',
          //   module: 'exception',
          //   key: 'e38wk3fes',
          // },
          {
            title: 'Calendar',
            url: '/calendar',
            module: 'calender',
            key: 'e38r4eq',
          },
          {
            title: 'Leave Approval',
            url: '/leave-request',
            module: 'leave_approval',
            key: 'e38kjd7',
          },
          {
            title: 'Documents',
            url: '/documents',
            module: 'documents',
            key: '4mn45rdg',
          },
        ],
      },
      {
        title: 'Project Management',
        url: '/project-Management',
        module: 'project_management',
        key: '6rds4ze8',
        icon: 'fe fe-clipboard',
      },
      {
        title: 'Log Management',
        url: '/log-Management',
        module: 'log_management',
        key: '6rds4zey8u',
        icon: 'fe fe-file-text',
      },
      {
        title: 'Client Management',
        url: '/client-Management',
        module: 'client_management',
        key: '8rds4gvy3u',
        icon: 'fe fe-clipboard',
      },
      // {
      //   title: 'RYG Status',
      //   url: '/RYGstatus',
      //   module: 'ryg_status',
      //   key: '6rds4ze6',
      //   icon: 'fe fe-flag',
      // },
      {
        title: 'Reports',
        url: '/under-construction',
        module: 'reports',
        key: '6r767s4ze6',
        icon: 'fe fe-file-text',
        children: [
          {
            title: 'Attendance Report',
            url: '/under-construction',
            module: 'attendance_report',
            key: 'e345s34ke',
          },
          {
            title: 'Leave Report',
            url: '/under-construction',
            module: 'leave_report',
            key: 'e38dwk4sds',
          },
        ],
      },
    ]
  } else {
    menuData = [
      {
        title: 'Dashboard',
        key: '2t2ghd',
        url: '/dashboard',
        module: 'dashboard',
        icon: 'fe fe-home',
      },
      {
        title: 'Configuration',
        key: '6rq4ze6',
        url: '/Configuration',
        module: 'configuration',
        icon: 'fe fe-truck',
        children: [
          {
            title: 'Global Type Category',
            url: '/config/global-type-category',
            module: 'global_type_category',
            key: 'e38wke',
          },
          {
            title: 'Global Type',
            url: '/config/global-type',
            module: 'global_type',
            key: 'e38wkesds',
          },
          {
            title: 'Role and Permissions',
            url: '/config/permissions',
            module: 'role_and_permissions',
            key: 'e38wkew',
          },
          {
            title: 'Module Permission',
            url: '/config/module-permission',
            key: 'e38wkex',
            module: 'module_permission',
          },
          {
            title: 'Terms and condition',
            url: '/config/term-and-condition',
            module: 'term_condition',
            key: 'e38wkea',
          },

          {
            title: 'Company Policy',
            url: '/config/company-policy',
            module: 'company_policy',
            key: 'eyu7wker',
          },
          {
            title: 'Leave Policy',
            url: '/config/leave-policy',
            module: 'leave_policy',
            key: 'lvoPrus',
          },
        ],
      },

      {
        title: 'Employees',
        url: '/emp/all-employee',
        module: 'employees',
        key: 'e38ws34ke',
      },
      {
        title: 'Attendance',
        url: '/attendance',
        module: 'attendance',
        key: 'e38wk3fesds',
        icon: 'fe fe-bar-chart',
      },
      {
        title: 'Trainee',
        url: '/emp/all-trainees',
        module: 'trainee',
        key: 'e38wk3feds',
      },
      // {
      //   title: 'Happy To Help',
      //   url: '/happy-to-help',
      //   module: 'happy_to_help',
      //   key: 'e38r4eqvd',
      // },
      {
        title: 'Daily Status Report',
        url: '/dsr',
        module: 'dsr',
        key: 'e38wk3fdak',
        icon: 'fe fe-book-open',
      },
      {
        title: 'Down time',
        url: '/down-time',
        module: 'down_time',
        key: 'e38wk3fdk',
        icon: 'fe fe-clock',
      },
      {
        title: 'Roster',
        url: '/roster',
        module: 'roster',
        key: 'e38wk3fo',
      },
      // {
      //   title: 'Exception',
      //   url: '/exception',
      //   module: 'exception',
      //   key: 'e38wk3fes',
      // },
      {
        title: 'Calendar',
        url: '/calendar',
        module: 'calender',
        key: 'e38r4eq',
        icon: 'fe fe-calendar',
      },
      {
        title: 'Leave Approval',
        url: '/leave-request',
        module: 'leave_approval',
        key: 'e38kjd7',
        icon: 'fe fe-check-square',
      },
      {
        title: 'Documents',
        url: '/documents',
        module: 'documents',
        key: '4mn45rdg',
      },
      {
        title: 'Project Management',
        url: '/project-Management',
        module: 'project_management',
        key: '6rds4ze8',
        icon: 'fa-product-hunt',
      },
      {
        title: 'Log Management',
        url: '/log-Management',
        module: 'log_management',
        key: '6rds4zey8u',
        icon: 'fa-product-hunt',
      },
      {
        title: 'Client Management',
        url: '/client-Management',
        module: 'client_management',
        key: '8rds4gvy3u',
        icon: 'fa-product-hunt',
      },
      // {
      //   title: 'RYG Status',
      //   url: '/RYGstatus',
      //   module: 'ryg_status',
      //   key: '6rds4ze6',
      //   icon: 'fe fe-flag',
      // },
      {
        title: 'Reports',
        url: '/under-construction',
        module: 'reports',
        key: '6r767s4ze6',
        icon: 'fe fe-file-text',
        children: [
          {
            title: 'Attendance Report',
            url: '/under-construction',
            module: 'attendance_report',
            key: 'e345s34ke',
          },
          {
            title: 'Leave Report',
            url: '/under-construction',
            module: 'leave_report',
            key: 'e38dwk4sds',
          },
        ],
      },
    ]
  }

  const userRoles = getLoggedInUserInfo()?.userRoles
  if (userRole === 'super_admin') {
    return menuData
  }
  const filteredMenuData = menuData?.filter((item) => {
    if (
      !item.children &&
      Object.prototype.hasOwnProperty.call(userRoles, item.module) &&
      !isEmpty(userRoles[item.module])
    ) {
      return item
    }
    // If the menu item has children, filter the children based on the keys present in userRoles object
    const filteredChildren = item?.children?.filter((childItem) => {
      if (
        Object.prototype.hasOwnProperty.call(userRoles, childItem.module) &&
        !isEmpty(userRoles[childItem.module])
      ) {
        return childItem
      }
      return null
    })
    item.children = filteredChildren // Update the children array with the filtered result
    return filteredChildren?.length > 0
  })

  return filteredMenuData
}
