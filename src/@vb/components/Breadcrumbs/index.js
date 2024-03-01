import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { reduce } from 'lodash'
import { Button } from 'antd'
import { getLoggedInUserInfo } from 'utils'
import styles from './style.module.scss'
import TutorialComponent from '../Tutorial'

const mapStateToProps = ({ menu, tour }) => ({
  menuData: menu.menuData,
  tourSteps: tour.tourSteps,
})

const Breadcrumbs = (props) => {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [tourStepsFetched, setTourStepsFetched] = useState(false)

  const {
    location: { pathname },
    menuData = [],
  } = props
  const { tourSteps } = props
  const { userRole } = getLoggedInUserInfo()

  useEffect(() => {
    setBreadcrumbs(() => getBreadcrumbs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const getPath = (data, url, parents = []) => {
    const items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        }
        if (entry.url === url) {
          return [entry].concat(parents)
        }
        if (entry.children) {
          const nested = getPath(entry.children, url, [entry].concat(parents))
          return (result || []).concat(nested.filter((e) => !!e))
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : [false]
  }

  const toUpper = (str) => str.replace(/\b\w/g, (l) => l.toUpperCase())

  const getBreadcrumbs = () => {
    const [activeMenuItem] = getPath(menuData, pathname)
    const pathUrl = pathname.split('/')

    if (activeMenuItem && pathUrl.length > 1) {
      return pathUrl.map((item, index) => {
        if (index === 0) {
          return null
        }

        if (index === pathUrl.length - 1) {
          return (
            <span key={item}>
              <span className={styles.arrow} />
              <strong className={styles.current}>{toUpper(activeMenuItem.title)}</strong>
            </span>
          )
        }
        return null
      })
    }

    return (
      <span>
        <span className={styles.arrow} />
        <strong className={styles.current}>{activeMenuItem.title}</strong>
      </span>
    )
  }

  useEffect(() => {
    // Check if tourSteps are fetched
    if (tourSteps === 0) {
      setTourStepsFetched(false)
    }
  }, [tourSteps])

  const handleTourClick = () => {
    if (tourSteps !== 0) {
      setTourStepsFetched(true)
    }
  }

  return (
    <>
      {tourStepsFetched && <TutorialComponent steps={tourSteps} />}
      {breadcrumbs &&
        (breadcrumbs.length ? (
          <div className={styles.breadcrumbs}>
            <div className={styles.path}>
              <Link to="/">Home</Link>
              {breadcrumbs}
            </div>
            <div>
              {userRole !== 'super_admin' && (
                <Button type="primary" onClick={() => handleTourClick()}>
                  Tour
                </Button>
              )}
            </div>
          </div>
        ) : null)}
    </>
  )
}

export default withRouter(connect(mapStateToProps)(Breadcrumbs))
