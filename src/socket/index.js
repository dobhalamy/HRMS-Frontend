// import io from 'socket.io-client'
// import { getLoggedInUserInfo } from 'utils'
// import { allNotifications } from 'redux/notifications/action'

// const url =
//   process.env.NODE_ENV === 'development'
//     ? 'http://localhost:5000'
//     : 'https://ileads-api2.azurewebsites.net'

// const socket = io(url, {
//   withCredentials: true,
//   transports: ['websocket', 'polling'],
//   // timeout: 10000,
//   secure: true,
// })

// // logged in socket
// export const loggedInSocket = (dispatch) => {
//   const loggedInData = getLoggedInUserInfo()
//   socket.emit('loggedInData', loggedInData)
//   socket.on('notifications', (data) => {
//     dispatch(allNotifications(data))
//   })
// }

// // leave request
// export const leaveRequestSocket = (data) => {
//   const { userId } = getLoggedInUserInfo()
//   socket.emit('applyForLeave', data, userId)
// }
// // leave reject
// export const leaveRejectedSocket = (data, userId) => {
//   socket.emit('leaveRejected', data, userId)
// }
// // leave approve
// export const leaveApproveSocket = (data, userId) => {
//   socket.emit('leaveApproved', data, userId)
// }
// // exception request
// export const exceptionRequestSocket = (data, userId) => {
//   socket.emit('exceptionRequest', data, userId)
// }
// // exception reject
// export const exceptionRejectSocket = (data, userId) => {
//   socket.emit('rejectException', data, userId)
// }
// // exception approve
// export const exceptionApproveSocket = (data, userId) => {
//   socket.emit('approveException', data, userId)
// }
// // happy to help request
// export const happyToHelpRequestSocket = (data, userId) => {
//   socket.emit('happyToHelpAdded', data, userId)
// }

// // dsr
// export const dsrSocket = (data, userId) => {
//   socket.emit('dsrAdded', data, userId)
// }

// // agent assign
// export const agentAssign = (data, userId) => {
//   socket.emit('agentAssign', data, userId)
// }

// // Add an error event listener
// socket.on('error', (error) => {
//   console.error('Socket.IO Error:', error)
//   // Handle the error as needed
// })

// // Example of handling a specific error event
// socket.on('connect_error', (error) => {
//   console.error('Socket.IO Connection Error:', error)
//   // Handle the connection error as needed
// })
