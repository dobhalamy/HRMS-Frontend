const userRoleEnums = {
  SUPER_ADMIN: 'super_admin',
  HR: 'hr',
  DEVELOPER: 'developer',
  TRAINEE: 'trainee',
  TL: 'tl',
  QUALITY: 'quality',
  TRAINER: 'trainer',
  PO: 'po',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
}

const raisedRequest = {
  BACK_DATE_LEAVE: 'back_date_leave',
  ROSTER_CHANGE: 'roster_change',
  SHIFT_CHANGE: 'shift_change',
  BIOMETRIC_ISSUE: 'biometric_issue',
  WORKING_ON_WEEKOFF: 'working_on_weekoff',
  WORKING_ON_LEAVE: 'working_on_leave',
}

const statusEnums = {
  APPROVED: 1,
  REJECTED: 2,
  PENDING: 0,
}
module.exports = { statusEnums, raisedRequest, userRoleEnums }
