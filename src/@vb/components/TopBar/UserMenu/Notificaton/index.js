import React, { useState } from 'react'
import { Badge, Dropdown, List, Button, Space } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { allNotifications } from 'redux/notifications/action'
import { readUserNotification } from 'services/axios/notification'
// import { loggedInSocket } from 'socket'
import { getLoggedInUserInfo } from 'utils'
import { formatDistanceToNow } from 'date-fns'
// import io from 'socket.io-client'
import styles from './style.module.scss'

// const url =
//   process.env.NODE_ENV === 'development'
//     ? 'http://localhost:5000'
//     : 'https://ileads-api2.azurewebsites.net'
// const socket = io(url, {
//   secure: true,
//   transports: ['websocket', 'polling'],
// })

const NotificationBell = () => {
  const dispatch = useDispatch()
  const [showNotificationList, setShowNotificationList] = useState(false)
  const { userId } = getLoggedInUserInfo()
  const notifications = useSelector((state) => state?.notifications?.notifications)
  // useEffect(() => {
  //   loggedInSocket(dispatch)
  //   // eslint-disable-next-line
  // }, [dispatch])

  // socket.on('newNotification', () => {
  //   loggedInSocket(dispatch)
  // })

  const toggleNotificationList = () => {
    setShowNotificationList(!showNotificationList)
  }
  const removeNotificationList = async () => {
    readUserNotification(userId)
    dispatch(allNotifications([]))
    setShowNotificationList(!showNotificationList)
  }

  const dropdownContent = (
    <div className={styles.dropdown}>
      {notifications?.length > 0 && (
        <Button type="primary" onClick={removeNotificationList} style={{ marginBottom: '0.5em' }}>
          Mark all as read
        </Button>
      )}
      <List
        style={{
          padding: '4px',
          maxHeight: 300,
          width: 300,
          overflowY: 'auto',
        }}
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <div>
              <div style={{ fontSize: '1em' }}>{item?.notification}</div>
              <div style={{ fontSize: '0.5em' }}>
                {' '}
                {formatDistanceToNow(new Date(item?.createdAt))}{' '}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )

  return (
    <div>
      <Dropdown
        overlay={dropdownContent}
        visible={showNotificationList}
        placement="bottomRight"
        trigger={['click']}
        onClick={toggleNotificationList}
      >
        <Space style={{ padding: '8px' }}>
          <Badge count={notifications?.length} style={{ top: '20px', right: '12px' }}>
            <BellOutlined
              style={{ fontSize: '24px', margin: '15px', marginTop: '25px', cursor: 'pointer' }}
            />
          </Badge>
        </Space>
      </Dropdown>
    </div>
  )
}

export default NotificationBell
