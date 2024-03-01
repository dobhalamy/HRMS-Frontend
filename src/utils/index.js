import React from 'react'
import moment from 'moment'
import { saveAs } from 'file-saver'
import { history } from 'index'
import { notification } from 'antd'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import { setPageSize, setCurrentPage } from 'redux/settings/actions'
import { isEmpty } from 'lodash'
import { getEmpLeaveForLeaveType } from 'services/axios/empLeave'

const ApiEndPoints = {
  LOGIN: 'auth/login',
  GLOBAL_TYPE_CATEGORY: 'globaltypecategory/',
  GLOBAL_TYPE_CATEGORY_STATUS: 'globaltypecategory/status/',
  MASTER_GLOBAL_TYPE_CATEGORY: 'globalType/masterglobaltype/',
  NESTED_GLOBAL_TYPE: 'globalType/nestedGlobaltype/',
  GLOBAL_TYPE: 'globaltype/',
  GLOBAL_TYPE_STATUS: 'globaltype/status/',

  MARK_LEAVE: 'employee/markLeave',
  UPDATE_LEAVE: 'employee/updateLeave',
  // ALL_LEAVE: 'employee/',
  ALL_LEAVE: 'employee/allEmployee-leave',
  LEAVE_REQUEST: 'employee/leaveRequest',
  UPDATE_LEAVE_STATUS: 'employee/updateLeaveStatus',
  DELETE_LEAVE_REQUEST: 'employee/deleteLeaveRequest',
  ALL_DAYOFF_LEAVE: 'employee/allEmployeeDay-leave',
  ALL_LEAVE_FOR_LEAVE_TYPE: 'employee/getAllLeaveForLeaveType',
  RYG_STATUS_LIST: 'employee/getRYGEmployee',
  UPDATE_RYG_EMPLOYEE: 'employee/updateRYGEmployee',
  EVENTS: 'event/',

  EMPLOYEE_PO: 'employee/getEmployeePo',
  EMPLOYEE_TEAM: 'employee/getTeamUnderSelectedPo',
}

export const utcToDate = (utc) => {
  const date = moment(utc).format('YYYY-MM-DD')
  return date
}
export const changeDateFormat = (value) => {
  const date = moment(value).format('YYYY/MM/DD')
  return date
}
export const utcToIst = (utc) => {
  const ist = moment.utc(utc).local().format('h:mm A')
  return ist
}
export const capitalizeFirstLetter = (string) => {
  if (string === (undefined || null)) return null
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export const capitalizeAllLetters = (string) => {
  if (string === undefined || string === null) return null
  return string.toUpperCase()
}

export const formatDate = (date) => {
  const formattedDate = moment(date).format('YYYY-MM-DD')
  return moment(formattedDate, 'YYYY-MM-DD')
}
export const DateFormater = (date) => {
  const formattedDate = moment(date).format('YYYY-MM-DD')

  return formattedDate
}

export const localToUTC = (date) => {
  return moment(date, 'YYYY-MM-DD').utc()
}
// Returns an array of dates between the two dates
export const getDates = (startDate, endDate) => {
  const date = new Date(startDate.getTime())

  const dates = []

  while (date <= endDate) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}

export const convertToCSV = (data) => {
  const header = `${Object.keys(data[0]).join(',')}\n`
  const rows = data.map((row) => `${Object.values(row).join(',')}\n`).join('')
  return header + rows
}

export const manageCSVDownload = (tableData) => {
  const csvData = convertToCSV(tableData)
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'table-data.csv')
}

export const logoutUser = () => {
  Cookies.remove('accessToken')
  Cookies.remove('permissions')
  history.push('/auth/login')
}

const displayErrorMsg = (error) => {
  notification.error({
    message: 'Error',
    description: error?.response?.data?.message,
  })
}
export const handelError = (error) => {
  if (error?.response?.data?.statusCode === (401 || 403)) {
    displayErrorMsg(error)
    logoutUser()
  } else {
    displayErrorMsg(error)
  }
}
export const generateYears = () => {
  const startYear = 2018
  const endYear = new Date().getFullYear()
  const years = []
  for (let year = startYear; year <= endYear; year += 1) {
    years.push({ label: year.toString(), value: year.toString() })
  }
  return years.reverse()
}

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export const AnswerType = [
  { label: 'Subjective', value: 'subjective' },
  { label: 'MCQ', value: 'mcq' },
]
export const SelectionType = [
  { label: 'Single', value: 0 },
  { label: 'Multiple', value: 1 },
]
export const getLoggedInUserInfo = () => {
  const token = Cookies.get('accessToken')
  const permissions = Cookies.get('permissions')
  if (token) {
    const decodedToken = jwt.decode(token)
    if (decodedToken?.userRole && decodedToken?.empId && decodedToken?.userId) {
      const userName = decodedToken?.userName
      const userRole = decodedToken?.userRole
      const userRoleId = decodedToken?.userRoleId
      const empId = decodedToken?.empId?.toUpperCase()
      const userId = decodedToken?.userId
      const email = decodedToken?.email?.toLowerCase()
      const userRoles = permissions !== undefined ? JSON.parse(permissions) : {}
      return { userName, userRole, userRoleId, userId, empId, email, userRoles }
    }
  }
  return null
}
export const hourConversion = (minutes) => {
  if (!Number.isNaN(minutes)) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    return `${hour} Hours ${minute} Minutes`
  }
  return null
}
export const downloadPdf = (mediaLink) => {
  const protocol = window?.location?.protocol
  const baseURL =
    process.env.NODE_ENV === 'development' ? 'localhost:5000' : process.env.REACT_APP_PROD_BASE_URL
  // const downloadLink = `${protocol}//${baseURL}/${mediaLink}`
  const downloadLink =
    process.env.NODE_ENV === 'development'
      ? `${protocol}//${baseURL}/${mediaLink}`
      : `//${baseURL}/${mediaLink}`
  const fileName = downloadLink.split('/').pop()
  fetch(downloadLink)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
    .catch((error) => console.error('Error downloading PDF:', error))
}
export const filterOption = (input, option) => {
  return option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export const resetPagination = { skip: 0, limit: 10 }
export const defaultPagination = (dispatch) => {
  dispatch(setCurrentPage(1))
  dispatch(setPageSize(10))
}
export const onPageChange = ({
  totalCount,
  pageSize,
  currentPage,
  oldPageSize,
  pageNumber,
  dispatch,
  handlePagination,
}) => {
  const lastPage = Math.ceil(totalCount / pageSize)
  if (currentPage !== pageNumber && (currentPage <= lastPage || currentPage === 2)) {
    const pageLimit = parseInt(pageNumber * oldPageSize, 10)
    const pageSkip = parseInt(pageLimit - oldPageSize, 10)
    dispatch(
      handlePagination({
        limit: pageLimit,
        skip: pageSkip,
      }),
    )
    dispatch(setCurrentPage(pageNumber))
  } else {
    dispatch(setCurrentPage(1))
  }
}

export const onPageSizeChange = ({ oldPageSize, pageSize, dispatch, handlePagination }) => {
  if (oldPageSize !== pageSize) {
    const pageLimit = parseInt(pageSize, 10)
    const pageSkip = parseInt(pageLimit - Number(pageSize), 10)
    dispatch(
      handlePagination({
        limit: pageLimit,
        skip: pageSkip,
      }),
    )
    dispatch(setPageSize(pageSize))
  }
}
export const Permissions = {
  READ: 'read',
  ADD: 'add',
  UPDATE: 'update',
  SHOW_ACTIVE_TOGGLE: 'show-active-toggle',
  DOWNLOAD_DATA: 'download-data',
  UPLOAD_DATA: 'upload-data',
  SEARCH_FILTERS: 'search-filters',
  WRITE: 'write',
}
export const ModuleUniqueValues = {
  EMPLOYEES: 'employees',
  ATTENDANCE: 'attendance',
  ROSTER: 'roster',
  DOWN_TIME: 'down_time',
  EXCEPTION: 'exception',
  GLOBAL_TYPE: 'global_type',
  GLOBAL_TYPE_CATEGORY: 'global_type_category',
  MODULE_PERMISSION: 'module_permission',
  TERMS_AND_CONDITION: 'terms_and_condition',
  COMPANY_POLICY: 'company_policy',
  LEAVE_POLICY: 'leave_policy',
  TRAINEES: 'trainee',
  DASHBOARD: 'dashboard',
  ROLE_AND_PERMISSIONS: 'role_and_permissions',
  HAPPY_TO_HELP: 'happy_to_help',
  RYG_STATUS: 'ryg_status',
}

export const formHintBoxMessage = {
  PASSWORD: (
    <div style={{ padding: '5px', minWidth: '100px' }}>
      <p style={{ margin: 0, fontSize: '12px' }}>- Atleast 6 character long</p>
      <p style={{ margin: 0, fontSize: '12px' }}>- Atleast 1 upper letter</p>
      <p style={{ margin: 0, fontSize: '12px' }}>- Atleast 1 special symbol</p>
      <p style={{ margin: 0, fontSize: '12px' }}>- Atleast 1 number</p>
    </div>
  ),
  EMAIL: <p style={{ margin: 0, fontSize: '12px' }}>Enter a valid email for notification</p>,
  NAME: <p style={{ margin: 0, fontSize: '12px' }}>Name should be match your Id proof</p>,
  PHONE_NUMBER: <p style={{ margin: 0, fontSize: '12px' }}>Enter a valid mobile number</p>,
  COMMUNICATION_WITH: (
    <p style={{ margin: 0, maxWidth: '210px', fontSize: '12px' }}>
      To whom do you want to communicate in order to resolve your issue
    </p>
  ),
  CONCERN_DATE: <p style={{ margin: 0, fontSize: '12px' }}>Date related to issue invoke</p>,
  BELONGS_TO: <p style={{ margin: 0, fontSize: '12px' }}>Major field for issue</p>,
  DOWN_TIME: <p style={{ margin: 0, fontSize: '12px' }}>Reason for the down time</p>,
  UNIQUE_VALUE: (
    <div style={{ padding: '5px', maxWidth: '500px' }}>
      <p style={{ margin: 0, fontSize: '12px' }}>- Space will be treated as underscore</p>
      <p style={{ margin: 0, fontSize: '12px' }}>- Only string is allowed</p>
      <p style={{ margin: 0, fontSize: '12px' }}>- Max 30 character allowed</p>
    </div>
  ),
  TRAINING_END_DATE: (
    <p style={{ margin: 0, fontSize: '12px' }}>
      By default 15 days would be added from starting date{' '}
    </p>
  ),
}

export const CheckPermission = ({ moduleUniqueValue, permission, children }) => {
  const { userRole, userRoles } = getLoggedInUserInfo()
  let showComponent = false
  if (userRole === 'super_admin') {
    showComponent = true
  } else if (!isEmpty(userRoles)) {
    const allPermissions = userRoles[moduleUniqueValue]
    showComponent = allPermissions?.includes(permission)
  }

  return <>{showComponent ? children : null}</>
}

export const getColor = (status) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    default:
      return 'error'
  }
}
export const getStatusLabel = (status) => {
  let color
  let displayStatus

  switch (status) {
    case 0:
      color = getColor(status)
      displayStatus = 'Pending'
      break
    case 1:
      color = getColor(status)
      displayStatus = 'Accepted'
      break
    case 2:
      color = getColor(status)
      displayStatus = 'Rejected'
      break
    case 'certified':
      color = 'green'
      displayStatus = 'Certified'
      break
    default:
      color = getColor(status)
      displayStatus = status
      break
  }

  return { color, displayStatus }
}

export const fetchEmpLeaveForLeaveType = async (userId, leaveType) => {
  const response = await getEmpLeaveForLeaveType(userId, leaveType)
  return response?.data?.data
}

export const tooltip = (props) => {
  return props
}
export const uploadButtonContent = (
  <div>
    <p>Upload pdf only</p>
  </div>
)

export const TaskStatus = [
  { label: 'Completed', value: 'Completed' },
  { label: 'In-progress', value: 'Inprogress' },
]
export const TaskHours = [
  { label: '0 Hour', value: 0 },
  { label: '1 Hour', value: 1 },
  { label: '2 Hour', value: 2 },
  { label: '3 Hour', value: 3 },
  { label: '4 Hour', value: 4 },
  { label: '5 Hour', value: 5 },
  { label: '6 Hour', value: 6 },
  { label: '7 Hour', value: 7 },
  { label: '8 Hour', value: 8 },
  { label: '9 Hour', value: 9 },
  { label: '10 Hour', value: 10 },
]
export const Minutes = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
  { label: '24', value: 24 },
  { label: '25', value: 25 },
  { label: '26', value: 26 },
  { label: '27', value: 27 },
  { label: '28', value: 28 },
  { label: '29', value: 29 },
  { label: '30', value: 30 },
  { label: '31', value: 31 },
  { label: '32', value: 32 },
  { label: '33', value: 33 },
  { label: '34', value: 34 },
  { label: '35', value: 35 },
  { label: '36', value: 36 },
  { label: '37', value: 37 },
  { label: '38', value: 38 },
  { label: '39', value: 39 },
  { label: '40', value: 40 },
  { label: '41', value: 41 },
  { label: '42', value: 42 },
  { label: '43', value: 43 },
  { label: '44', value: 44 },
  { label: '45', value: 45 },
  { label: '46', value: 46 },
  { label: '47', value: 47 },
  { label: '48', value: 48 },
  { label: '49', value: 49 },
  { label: '50', value: 50 },
  { label: '51', value: 51 },
  { label: '52', value: 52 },
  { label: '53', value: 53 },
  { label: '54', value: 54 },
  { label: '55', value: 55 },
  { label: '56', value: 56 },
  { label: '57', value: 57 },
  { label: '58', value: 58 },
  { label: '59', value: 59 },
]

export default ApiEndPoints
