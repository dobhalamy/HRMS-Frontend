import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { UserOutlined, MailOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar } from 'antd'
import store from 'store'
import { history } from 'index'
import Cookies from 'js-cookie'
import { getLoggedInUserInfo } from 'utils'
import styles from './style.module.scss'

const mapStateToProps = ({ user }) => ({ user })

const ProfileMenu = () => {
  const logout = (e) => {
    e.preventDefault()
    Cookies.remove('accessToken')
    history.push('/auth/login')
    store.set('app.menu.openedKeys', [])
    store.set('app.menu.selectedKeys', [])
  }

  const { email } = getLoggedInUserInfo()

  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <div>
          {/* <MailOutlined /> {user?.userInfo?.email || '—'} */}
          <MailOutlined /> {email || '—'}
          {/* <br />
          <strong>
            <FormattedMessage id="topBar.profileMenu.phone" />:{' '}
          </strong>
          {user.phone || '—'} */}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="/profile">
          <i className="fe fe-user mr-2" />
          <FormattedMessage id="topBar.profileMenu.editProfile" />
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className={styles.dropdown} id="profile">
        <Avatar className={styles.avatar} shape="square" size="large" icon={<UserOutlined />} />
      </div>
    </Dropdown>
  )
}

export default connect(mapStateToProps)(ProfileMenu)
