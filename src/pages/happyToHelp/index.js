import React, { useEffect, useState } from 'react'
import { Table, Button, Space } from 'antd'
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons'
import {
  getLoggedInUserInfo,
  onPageChange,
  onPageSizeChange,
  resetPagination,
  defaultPagination,
  CheckPermission,
  ModuleUniqueValues,
  Permissions,
  utcToDate,
} from 'utils'

import {
  getAllHappyToHelpList,
  getHappyToHelpList,
  getHappyToHelpBelongsTo,
  handlePagination,
} from 'redux/happyToHelp/action'
import { useDispatch, useSelector } from 'react-redux'
import { setTourSteps } from 'redux/tour/actions'
import DeleteH2H from './deleteH2h'
import ViewH2h from './viewH2h'
import EditH2h from './editH2h'
import AddH2h from './addH2h'

const HappyToHelp = () => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const userRole = getLoggedInUserInfo()?.userRole
  const dispatch = useDispatch()
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const happyToHelpList = useSelector((state) => state?.happyToHelp?.happyToHelpData)
  const totalCount = useSelector((state) => state?.happyToHelp?.totalCount)
  const pagination = useSelector((state) => state?.happyToHelp?.pagination)
  const [h2hData, setH2hData] = useState({})

  const handleDelete = (record) => {
    setShowDeleteModal(true)
    setH2hData(record)
  }
  const onViewHandle = (record) => {
    setShowViewModal(true)
    setH2hData(record)
  }

  const handleEditForm = (record) => {
    setH2hData(record)
    setShowEditForm(true)
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
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const { skip, limit } = pagination
    if (userRole === 'hr') {
      dispatch(getAllHappyToHelpList({ skip, limit }))
    } else {
      dispatch(getHappyToHelpList({ skip, limit }))
    }

    dispatch(getHappyToHelpBelongsTo())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination])

  const columns = [
    { title: 'Belongs To', dataIndex: 'belongsTo', render: (_, record) => record?.belongsToName },
    { title: 'Issue', dataIndex: 'issue', render: (_, record) => record?.GlobalType?.displayName },
    { title: 'Communication With', dataIndex: 'communicationWith' },
    { title: 'Mobile No', dataIndex: 'mobileNo' },
    { title: 'Concern Of', dataIndex: 'concernOf', render: (concernOf) => utcToDate(concernOf) },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Space size="middle">
            <>
              <Button type="primary" onClick={() => onViewHandle(record)} id="view">
                <EyeFilled />
              </Button>
              <Button type="primary" onClick={() => handleEditForm(record)} id="edit">
                <EditFilled />
              </Button>
              <Button type="primary" onClick={() => handleDelete(record)} id="delete">
                <DeleteFilled />
              </Button>
            </>
          </Space>
        </>
      ),
    },
  ]

  const getSteps = () => {
    if (userRole !== 'hr') {
      const steps = [
        {
          selector: '#addH2h',
          content: 'Add your happy to help request',
        },
      ]
      if (happyToHelpList && happyToHelpList?.length > 0) {
        steps.push(
          {
            selector: '#view',
            content: 'View details of raised request',
          },
          {
            selector: '#edit',
            content: 'Edit raised request',
          },
          {
            selector: '#delete',
            content: 'Delete the raised request',
          },
        )
      }
      return steps
    }
    if (happyToHelpList && happyToHelpList.length > 0) {
      return [
        {
          selector: '#view',
          content: 'View details of raised request',
        },
        {
          selector: '#edit',
          content: 'Edit raised request',
        },
        {
          selector: '#delete',
          content: 'Delete the raised request',
        },
      ]
    }
    return 0
  }

  const steps = getSteps()
  useEffect(() => {
    dispatch(setTourSteps(steps))
  }, [steps, dispatch])

  return (
    <>
      <CheckPermission
        moduleUniqueValue={ModuleUniqueValues.HAPPY_TO_HELP}
        permission={Permissions.ADD}
      >
        <Space style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '0.5rem' }}>
          <AddH2h />
        </Space>
      </CheckPermission>
      <Table
        dataSource={happyToHelpList}
        columns={columns}
        rowKey="id"
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
      {showDeleteModal && (
        <DeleteH2H
          setShowDeleteModal={setShowDeleteModal}
          showDeleteModal={showDeleteModal}
          h2hData={h2hData}
        />
      )}
      {showViewModal && (
        <ViewH2h
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          h2hData={h2hData}
        />
      )}
      {showEditForm && (
        <EditH2h showEditForm={showEditForm} setShowEditForm={setShowEditForm} h2hData={h2hData} />
      )}
    </>
  )
}

export default HappyToHelp
