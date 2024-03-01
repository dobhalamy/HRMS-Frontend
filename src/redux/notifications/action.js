export const actions = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
}

export const allNotifications = (data) => {
  return {
    type: actions.SET_NOTIFICATIONS,
    payload: data,
  }
}
