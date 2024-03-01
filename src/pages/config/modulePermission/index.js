import React, { useEffect, useState } from 'react'
import { Table, Button, Space } from 'antd'
import { EditFilled, EyeFilled } from '@ant-design/icons'
import {
  getAllModulePermissions,
  getModulesList,
  getPermissions,
  handlePagination,
} from 'redux/modulePermission/action'
import { onPageChange, onPageSizeChange, resetPagination, defaultPagination } from 'utils'
import { useDispatch, useSelector, connect } from 'react-redux'
import lodash from 'lodash'
import EditModule from './editModule'
import ViewModule from './viewModule'
import AddModule from './addModule'

const ModulePermission = ({ modulePermissionList }) => {
  const dispatch = useDispatch()
  const [showEditForm, setShowEditForm] = useState(false)
  const [moduleData, setModuleData] = useState({})
  const [tableData, setTableData] = useState([])

  const [showViewModal, setShowViewModal] = useState(false)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const totalCount = modulePermissionList?.length

  const handleEditForm = (record) => {
    setModuleData(record)
    setShowEditForm(true)
  }
  const onViewHandle = (record) => {
    setShowViewModal(true)
    setModuleData(record)
  }
  const handlePageChange = (pageNumber, pageSize) => {
    onPageChange({
      totalCount,
      pageSize,
      currentPage,
      oldPageSize,
      pageNumber,
      dispatch,
      handlePagination,
    })
  }
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }
  const initData = () => {
    const newData = modulePermissionList?.map((item) => {
      const { moduleInfo, permissionsInfo } = item

      return {
        moduleDisplayName: moduleInfo?.displayName,
        moduleId: moduleInfo?.moduleId,
        moduleUniqueValue: moduleInfo?.uniqueValue,
        permissionsIds: permissionsInfo?.map((permission) => permission?.permissionId),
        permissionDisplayName: permissionsInfo?.map((permission) => permission.displayName),
      }
    })

    setTableData(newData)
  }
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    dispatch(getModulesList())
    dispatch(getPermissions())
    dispatch(getAllModulePermissions())
  }, [dispatch])
  useEffect(() => {
    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modulePermissionList])
  const columns = [
    {
      title: 'Module Display Name',
      dataIndex: 'moduleDisplayName',
      key: 'moduleDisplayName',
    },
    {
      title: 'Permission Display Name',
      dataIndex: 'permissionDisplayName',
      key: 'permissionDisplayName',
      render: (permissions) => (
        <span title={permissions.join(', ')}>
          {lodash.truncate(permissions.join(', '), { length: 30 })}
        </span>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Space size="middle">
            <>
              <Button type="primary" onClick={() => onViewHandle(record)}>
                <EyeFilled />
              </Button>
              <Button type="primary" onClick={() => handleEditForm(record)}>
                <EditFilled />
              </Button>
            </>
          </Space>
        </>
      ),
    },
  ]

  return (
    <>
      <Space style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
        <AddModule />
      </Space>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey="moduleUniqueValue"
        pagination={{
          defaultPageSize: oldPageSize,
          current: parseInt(currentPage, 10),
          total: totalCount,
          responsive: true,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          locale: { items_per_page: '' },
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
      />
      {showEditForm && (
        <EditModule
          moduleData={moduleData}
          setShowEditForm={setShowEditForm}
          showEditForm={showEditForm}
        />
      )}
      {showViewModal && (
        <ViewModule
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          moduleData={moduleData}
        />
      )}
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    modulePermissionList: state?.modulePermission?.modulePermissionList,
  }
}

export default connect(mapStateToProps)(ModulePermission)
