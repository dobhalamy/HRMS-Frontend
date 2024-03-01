import React, { useState, useEffect, useCallback } from 'react'
import { Button, Card, Checkbox, Col, notification, Row, Select } from 'antd'
import { addRoleAndPermissions, getPermissionsByDepId } from 'services/axios/config'
import { connect, useSelector } from 'react-redux'
import { fetchNestedRoles, fetchRoles, fetchModulesPermissions } from 'redux/config/actions'
import { isEmpty } from 'lodash'
import style from './style.module.scss'

let depId
let flag = false
const RoleAndPermissions = ({ dispatch, modules, roles, nestedRoles }) => {
  const [roleAndPermissions, setRoleAndPermissions] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [depValue, setDepValue] = useState('Select department')
  const [selectRole, setSelectRole] = useState({ value: 'Select role', id: null })
  const isLoadingAPI = useSelector((state) => state?.settings?.isLoading)

  const getAllRoleAndPermissions = useCallback(
    async (id, nestedRoleId) => {
      const res = await getPermissionsByDepId(id, nestedRoleId)
      if (res && res.status === 200 && res?.data?.data && !isEmpty(modules)) {
        const updatedRoleAndPermissions = {}

        res?.data?.data.forEach((item) => {
          const roleAndPermission = {}
          const module = modules.find(
            (singleModule) => item.moduleId === singleModule?.moduleInfo?.moduleId,
          )

          if (module) {
            const moduleName = module?.moduleInfo?.uniqueValue
            roleAndPermission.moduleId = module?.moduleInfo?.moduleId
            roleAndPermission.depId = item.depId || depId
            roleAndPermission.permissions = item?.permissions?.includes(',')
              ? Array.from(item?.permissions?.split(','), Number)
              : [Number(item?.permissions)]
            roleAndPermission.nestedRoleId = item?.roleId

            if (moduleName) {
              updatedRoleAndPermissions[moduleName] = roleAndPermission
            }
          }
        })

        setRoleAndPermissions(updatedRoleAndPermissions)
      } else {
        setRoleAndPermissions({})
      }
    },
    [modules],
  )

  useEffect(() => {
    dispatch(fetchModulesPermissions())
    dispatch(fetchRoles())
  }, [dispatch])
  const handleChange = (value) => {
    depId = Number(value)
    if (roles?.length > 0) {
      roles.some((item) => {
        if (item?.id === value) {
          dispatch(fetchNestedRoles(depId, 'user_role'))
          setDepValue(item?.displayName)
          setSelectRole({ value: 'Select role', id: null })
          return true
        }
        return null
      })
    }
  }
  const handleChangeRole = (nestedRoleId) => {
    if (nestedRoleId !== selectRole?.id) {
      if (nestedRoles?.length > 0) {
        nestedRoles?.some((item) => {
          if (item?.id === nestedRoleId) {
            setSelectRole(() => ({
              value: item?.displayName,
              id: nestedRoleId,
            }))
            return true
          }
          return null
        })
      }
      getAllRoleAndPermissions(depId, nestedRoleId)
    }
  }
  const handleCheckChange = (e, uniqueValue, permissionId, moduleId) => {
    const isChecked = e.target.checked
    const oldPermissions = roleAndPermissions[`${uniqueValue}`]?.permissions || []
    if (depId === undefined) {
      notification.info({
        message: 'Warning',
        description: 'Please select department',
      })
      return
    }
    if (selectRole === 'Select role') {
      notification.info({
        message: 'Warning',
        description: 'Please select role',
      })
      return
    }
    if (isChecked) {
      setRoleAndPermissions((pre) => ({
        ...pre,
        [`${uniqueValue}`]: {
          moduleId,
          permissions: [...oldPermissions, permissionId],
          depId,
          nestedRoleId: selectRole?.id,
        },
      }))
      return
    }
    const index = oldPermissions?.findIndex((element) => Number(element) === Number(permissionId))
    oldPermissions?.splice(index, 1)
    setRoleAndPermissions((pre) => ({
      ...pre,
      [`${uniqueValue}`]: {
        moduleId,
        permissions: [...oldPermissions],
        depId,
        nestedRoleId: selectRole?.id,
      },
    }))
  }
  const handleSave = async () => {
    setIsLoading((pre) => !pre)
    if (depValue === 'Select department') {
      notification.info({
        message: 'Please select department',
      })
    }
    if (selectRole?.id === null) {
      notification.info({
        message: 'Please select role',
      })
    }
    if (!isEmpty(roleAndPermissions)) {
      const dataToSend = []
      Object.keys(roleAndPermissions).forEach((key) => {
        dataToSend.push(roleAndPermissions[key])
      })
      const res = await addRoleAndPermissions(dataToSend)
      if (res?.data?.status) {
        getAllRoleAndPermissions(depId, selectRole?.id)
        notification.success({ message: 'Permissions Updated successfully' })
      }
    }
    setIsLoading((pre) => !pre)
  }
  if (roles?.length > 0 && modules?.length > 0 && flag === false) {
    roles.some((item) => {
      if (item?.displayName?.toLowerCase() === 'admin') {
        handleChange(item?.id)
        return true
      }
      return null
    })
    flag = true
  }

  return (
    <Card>
      <div className={style.moduleContainer}>
        <div className={style.dropDownContainer}>
          <Select
            value={depValue}
            style={{
              width: 180,
            }}
            disabled={isLoadingAPI}
            loading={isLoadingAPI}
            onChange={handleChange}
            options={roles?.map((item) => {
              return {
                value: item?.id,
                label: item?.displayName,
              }
            })}
          />
          <Select
            value={selectRole?.value}
            style={{
              width: 180,
            }}
            loading={isLoadingAPI}
            disabled={nestedRoles?.length <= 0 || isLoadingAPI}
            onChange={handleChangeRole}
            options={nestedRoles?.map((item) => {
              return {
                value: item?.id,
                label: item?.displayName,
              }
            })}
          />
        </div>
        <Button
          type="primary"
          loading={isLoading}
          onClick={handleSave}
          size="middle"
          disabled={isLoadingAPI}
        >
          Save
        </Button>
      </div>
      <>
        {modules?.map((moduleName) => (
          <Row gutter={16} key={moduleName?.moduleInfo?.uniqueValue}>
            <Col className="gutter-row" span={6}>
              <h4 className={style.moduleHeading}>{`${moduleName?.moduleInfo?.displayName}`}</h4>
            </Col>
            <Col className="gutter-row" span={18}>
              {moduleName?.permissionsInfo?.map((item) => (
                <Checkbox
                  key={item?.uniqueValue}
                  onChange={(e) => {
                    handleCheckChange(
                      e,
                      moduleName?.moduleInfo?.uniqueValue,
                      item?.permissionId,
                      moduleName?.moduleInfo?.moduleId,
                    )
                  }}
                  disabled={isLoadingAPI || selectRole?.id === null}
                  checked={roleAndPermissions[
                    moduleName?.moduleInfo?.uniqueValue
                  ]?.permissions?.includes(item?.permissionId)}
                  name={item?.displayName}
                >
                  {item?.displayName}
                </Checkbox>
              ))}
            </Col>
          </Row>
        ))}
      </>
    </Card>
  )
}

const mapStateToProps = ({ roleAndModules, dispatch }) => ({
  modules: roleAndModules?.modules,
  roles: roleAndModules?.roles,
  nestedRoles: roleAndModules?.nestedRoles,
  dispatch,
})
export default connect(mapStateToProps)(RoleAndPermissions)
