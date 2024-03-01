import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import fetchData from './auth/reducer'
import user from './user/reducers'
import { setMenuData } from './menu/reducers'
import { changeSettings } from './settings/reducer'
import fetchGlobalTypeCategoryData from './globaltypecategory/reducer'
import { fetchMasterGlobalTypeData } from './globalType/reducer'
import roleAndModules from './config/reducer'
import onToggle from './allEmployee/reducer'
import fetchEmpLeaveData from './empLeave/reducer'
import fetchEevntsData from './events/reducer'
import onDsrState from './employeeDsr/reducer'
import attendanceData from './attendance/reducer'
import onFormQuestions from './formQuestions/reducer'
import getDocument, { getProfileImage } from './media/reducer'
import onDownTimeState from './downTime/reducer'
import fetchRYGstatusEmpList from './rygStatus/reducer'
import onHappyToHelpState from './happyToHelp/reducer'
import roster from './roster/reducers'
import exception from './exception/reducer'
import onModulePermissionState from './modulePermission/reducer'
import tour from './tour/reducers'
import notifications from './notifications/reducers'
import projectInfo from './projectInfo/reducer'
import logs from './logManagement/reducer'
import clientInfo from './clientInfo/reducer'

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu: setMenuData,
    data: fetchData,
    fetchGlobalTypeCategoryData,
    fetchMasterGlobalTypeData,
    settings: changeSettings,
    roleAndModules,
    toggle: onToggle,
    empLeaveData: fetchEmpLeaveData,
    dsrState: onDsrState,
    downTimeState: onDownTimeState,
    happyToHelp: onHappyToHelpState,
    modulePermission: onModulePermissionState,
    eventsData: fetchEevntsData,
    formQuestions: onFormQuestions,
    attendanceData,
    getDocument,
    getProfileImage,
    fetchRYGstatusEmpList,
    roster,
    exception,
    tour,
    notifications,
    projectInfo,
    logs,
    clientInfo,
  })

export default rootReducer
