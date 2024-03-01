import React from 'react'
import { getLoggedInUserInfo, capitalizeFirstLetter } from 'utils'
import UserMenu from './UserMenu'
// import NotificationBell from './UserMenu/Notificaton'

// import Cart from './Cart'
import style from './style.module.scss'

const TopBar = () => {
  const user = getLoggedInUserInfo()
  return (
    <div className={style.topbar}>
      {/* <NotificationBell /> */}
      <strong className={style.userName}>
        Hello, {(user?.userName && capitalizeFirstLetter(user.userName)) || 'Anonymous'} (
        {user?.empId})
      </strong>
      <div className="mr-auto mr-md-1">
        <UserMenu />
      </div>
    </div>
  )
}

export default TopBar
