import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { find } from 'lodash'
import classNames from 'classnames'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Layout, Avatar } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { UserOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const { Sider } = Layout
const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  settings,
  flyoutActive:
    (settings.flyoutMenuType === 'flyout' ||
      settings.flyoutMenuType === 'compact' ||
      settings.isMenuCollapsed) &&
    !settings.isMobileView,
  role: user.role,
})

const flyoutTimers = {}
let flyoutItems = {}

const MenuLeft = ({
  dispatch,
  menuData = [],
  location: { pathname },
  settings,
  flyoutActive,
  role,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState('')
  const [activeItem, setActiveItem] = useState('')
  const [renderedFlyoutItems, setRenderedFlyoutItems] = useState({})

  useEffect(() => {
    setActiveItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const toggleMenu = (e) => {
    e.preventDefault()
    const { isMenuCollapsed } = settings
    dispatch({
      type: '',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })
  }

  const toggleMobileMenu = (e) => {
    e.preventDefault()
    const { isMobileMenuOpen } = settings
    dispatch({
      type: '',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  const handleSubmenuClick = (e, key) => {
    e.preventDefault()
    if (flyoutActive) {
      return
    }
    setActiveSubmenu(activeSubmenu === key ? '' : key)
  }

  const handleFlyoutOver = (event, key, items) => {
    if (flyoutActive) {
      clearInterval(flyoutTimers[key])
      const item = event.currentTarget
      const itemDimensions = item.getBoundingClientRect()
      const element = renderFlyoutMenu(items, key, itemDimensions)
      setRenderedFlyoutItems({
        ...renderedFlyoutItems,
        [key]: element,
      })
      flyoutItems = {
        ...renderedFlyoutItems,
        [key]: element,
      }
    }
  }

  const handleFlyoutOut = (key) => {
    if (flyoutActive) {
      flyoutTimers[key] = setTimeout(() => {
        delete flyoutItems[key]
        setRenderedFlyoutItems({
          ...flyoutItems,
        })
      }, 100)
    }
  }

  const handleFlyoutContainerOver = (key) => {
    clearInterval(flyoutTimers[key])
  }

  const renderFlyoutMenu = (items, key, itemDimensions) => {
    const left = `${itemDimensions.left + itemDimensions.width - 10}px`
    const top = `${itemDimensions.top}px`

    return (
      <div
        style={{ left, top }}
        className={classNames(style.air__menuFlyout, {
          [style.air__menuFlyoutLeft]: settings.menuLayoutType === 'left',
          [style.air__menuFlyout__black]: settings.flyoutMenuColor === 'dark',
          [style.air__menuFlyout__white]: settings.flyoutMenuColor === 'white',
          [style.air__menuFlyout__gray]: settings.flyoutMenuColor === 'gray',
        })}
        key={key}
      >
        <ul
          className={style.air__menuLeft__list}
          onMouseEnter={() => handleFlyoutContainerOver(key)}
          onMouseLeave={() => handleFlyoutOut(key)}
        >
          {items.map((item) => {
            if (item.roles && !item.roles.includes(role)) {
              return null
            }
            return (
              <li
                className={classNames(style.air__menuLeft__item, {
                  [style.air__menuLeft__item__active]: activeItem === item.key,
                })}
                key={item.key}
              >
                <Link to={item.url} className={style.air__menuLeft__link}>
                  {item.icon && <i className={`${item.icon} ${style.air__menuLeft__icon}`} />}
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const setActiveItems = () => {
    if (!menuData.length) {
      return
    }
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const currentItem = find(flattenItems(menuData, 'children'), ['url', pathname]) || {}
    const currentSubmenu = menuData.reduce((key, parent) => {
      if (Array.isArray(parent.children)) {
        parent.children.map((child) => {
          if (child.key === currentItem.key) {
            key = parent
          }
          return ''
        })
      }
      return key
    })
    setActiveItem(currentItem.key)
    setActiveSubmenu(currentSubmenu.key)
  }

  const generateMenuItems = () => {
    const menuItem = (item) => {
      const { key, title, icon, url } = item
      if (item.category) {
        return (
          <li className={style.air__menuLeft__category} key={Math.random()}>
            <span>{title}</span>
          </li>
        )
      }
      return (
        <li
          className={classNames(style.air__menuLeft__item, {
            [style.air__menuLeft__item__active]: activeItem === key,
          })}
          key={key}
        >
          {item.url && (
            <Link to={url} className={style.air__menuLeft__link}>
              {icon && <i className={`${icon} ${style.air__menuLeft__icon}`} />}
              <span>{title}</span>
            </Link>
          )}
          {!item.url && (
            <a href="#" onClick={(e) => e.preventDefault()} className={style.air__menuLeft__link}>
              {icon && <i className={`${icon} ${style.air__menuLeft__icon}`} />}
              <span>{title}</span>
            </a>
          )}
        </li>
      )
    }

    const submenuItem = (item) => {
      return (
        <li
          className={classNames(style.air__menuLeft__item, style.air__menuLeft__submenu, {
            [style.air__menuLeft__submenu__active]: activeSubmenu === item.key,
          })}
          key={item.key}
        >
          <a
            href="#"
            className={style.air__menuLeft__link}
            onClick={(e) => handleSubmenuClick(e, item.key)}
            onMouseEnter={(event) => handleFlyoutOver(event, item.key, item.children)}
            onFocus={(event) => handleFlyoutOver(event, item.key, item.children)}
            onMouseLeave={() => handleFlyoutOut(item.key)}
            onBlur={() => handleFlyoutOut(item.key)}
          >
            <i className={`${item.icon} ${style.air__menuLeft__icon}`} />
            <span>{item.title}</span>
            {item.count && (
              <span className="badge text-white bg-blue-light float-right mt-1 px-2">
                {item.count}
              </span>
            )}
          </a>
          <ul className={style.air__menuLeft__list}>
            {item.children.map((sub) => {
              if (sub.roles && !sub.roles.includes(role)) {
                return null
              }
              // TODO: multilevel menu
              // if (sub.children) {
              //   return submenuItem(sub)
              // }
              return menuItem(sub)
            })}
          </ul>
        </li>
      )
    }

    return menuData.map((item) => {
      if (item.roles && !item.roles.includes(role)) {
        return null
      }
      if (item.children) {
        return submenuItem(item)
      }
      return menuItem(item)
    })
  }

  const items = generateMenuItems()
  const menuWidthStyle = {
    flex: `0 0 ${settings.leftMenuWidth}px`,
    maxWidth: `${settings.leftMenuWidth}px`,
    minWidth: `${settings.leftMenuWidth}px`,
    width: `${settings.leftMenuWidth}px`,
  }

  return (
    <Sider width="auto">
      <TransitionGroup>
        {Object.keys(renderedFlyoutItems).map((item) => {
          return (
            <CSSTransition key={item} timeout={0} classNames="air__menuFlyout__animation">
              {renderedFlyoutItems[item]}
            </CSSTransition>
          )
        })}
      </TransitionGroup>
      <div
        className={classNames(style.air__menuLeft, {
          [style.air__menuLeft__mobileToggled]: settings.isMobileMenuOpen,
          [style.air__menuLeft__toggled]: settings.isMenuCollapsed,
          [style.air__menuLeft__unfixed]: settings.isMenuUnfixed,
          [style.air__menuLeft__shadow]: settings.isMenuShadow,
          [style.air__menuLeft__flyout]: settings.flyoutMenuType === 'flyout',
          [style.air__menuLeft__compact]: settings.flyoutMenuType === 'compact',
          [style.air__menuLeft__white]: settings.menuColor === 'white',
          [style.air__menuLeft__gray]: settings.menuColor === 'gray',
          [style.air__menuFlyout__black]:
            settings.flyoutMenuColor === 'dark' && settings.flyoutMenuType !== 'default',
          [style.air__menuFlyout__white]:
            settings.flyoutMenuColor === 'white' && settings.flyoutMenuType !== 'default',
          [style.air__menuFlyout__gray]:
            settings.flyoutMenuColor === 'gray' && settings.flyoutMenuType !== 'default',
        })}
        style={menuWidthStyle}
      >
        <div className={style.air__menuLeft__outer} style={menuWidthStyle}>
          <a
            href="#"
            className={style.air__menuLeft__mobileToggleButton}
            onClick={toggleMobileMenu}
          >
            <span />
          </a>
          <a href="#" className={style.air__menuLeft__toggleButton} onClick={toggleMenu}>
            <span />
            <span />
          </a>
          <div className={style.air__menuLeft__logo}>
            <div className={style.air__menuLeft__logo__letter}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                version="1.1"
                height="24px"
                width="24px"
              >
                <g>
                  <path
                    fill="#4b7cf3"
                    strokeWidth="1"
                    stroke="#4b7cf3"
                    d="M12,10.9c-0.1,0-0.2,0-0.2-0.1L3.5,6.1C3.4,6,3.3,5.8,3.3,5.6c0-0.2,0.1-0.3,0.2-0.4l8.2-4.7c0.2-0.1,0.3-0.1,0.5,0      l8.2,4.7c0.2,0.1,0.2,0.3,0.2,0.4S20.6,6,20.5,6.1l-8.2,4.7C12.2,10.8,12.1,10.9,12,10.9z M4.8,5.6L12,9.8l7.2-4.2L12,1.5      L4.8,5.6z"
                  />
                  <path
                    fill="#4b7cf3"
                    strokeWidth="1"
                    stroke="#4b7cf3"
                    d="M13.6,23.6c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.2-0.3-0.2-0.4v-9.5c0-0.2,0.1-0.3,0.2-0.4l8.2-4.7c0.2-0.1,0.3-0.1,0.5,0      c0.2,0.1,0.2,0.3,0.2,0.4v9.5c0,0.2-0.1,0.3-0.3,0.4l-8.2,4.7C13.8,23.6,13.7,23.6,13.6,23.6z M14.1,13.9v8.3l7.2-4.2V9.8      L14.1,13.9z"
                  />
                  <path
                    fill="#4b7cf3"
                    strokeWidth="1"
                    stroke="#4b7cf3"
                    d="M10.4,23.6c-0.1,0-0.2,0-0.2-0.1l-8.2-4.7c-0.2-0.1-0.3-0.3-0.3-0.4V8.9c0-0.2,0.1-0.3,0.2-0.4c0.2-0.1,0.3-0.1,0.5,0      l8.2,4.7c0.2,0.1,0.2,0.3,0.2,0.4v9.5c0,0.2-0.1,0.3-0.2,0.4C10.5,23.6,10.5,23.6,10.4,23.6z M2.7,18.1l7.2,4.2v-8.3L2.7,9.8      V18.1z"
                  />
                </g>
              </svg>
            </div>
            <div className={style.air__menuLeft__logo__name}>{settings.logo}</div>
            <div className={style.air__menuLeft__logo__descr}>{settings.version}</div>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()} className={style.air__menuLeft__user}>
            <Avatar
              className={style.air__menuLeft__user__avatar}
              shape="square"
              size="large"
              icon={<UserOutlined />}
            />
            <div className={style.air__menuLeft__user__name}>David Beckham</div>
            <div className={style.air__menuLeft__user__role}>Administrator</div>
          </a>
          <PerfectScrollbar>
            <div id="menu-left-container" className={style.air__menuLeft__container}>
              <ul className={style.air__menuLeft__list}>{items}</ul>
              <div className={style.air__menuLeft__banner}>
                <p>Full access, lifetime updates, github issues, and extended licenses!</p>
                <a
                  href="https://themeforest.net/item/air-ui-multi-concept-admin-template/24434456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-white text-center d-block"
                >
                  Get a license
                </a>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
      <a href="#" className={style.air__menuLeft__backdrop} onClick={toggleMobileMenu} />
    </Sider>
  )
}

export default withRouter(connect(mapStateToProps)(MenuLeft))
