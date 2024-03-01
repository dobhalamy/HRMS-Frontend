import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getListOfException,
  handlePagination,
  getExceptionListSingleEmp,
  handleStatus,
} from 'redux/exception/action'
import { updateException } from 'services/axios/exception'
import { Table, Space, Card, Select, Popconfirm, notification } from 'antd'
import { EyeFilled, EditFilled, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { getLoggedInUserInfo, onPageChange, onPageSizeChange, utcToDate } from 'utils'
import { statusEnums } from 'enums/userRole'
import { setTourSteps } from 'redux/tour/actions'
// import { exceptionApproveSocket } from 'socket'
import AddException from './addException'
import ViewException from './viewException'
import DeleteException from './deleteException'
import EditException from './editException'
import RejectRemark from './rejectRemark'

const Exception = () => {
  const exp = useSelector((state) => state.exception)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const { skip, limit } = exp?.pagination
  const totalCount = exp?.totalCount
  const dispatch = useDispatch()
  const statusFilter = useSelector((state) => state?.exceptionState?.status)
  const userRole = getLoggedInUserInfo()?.userRole
  // const { userId } = getLoggedInUserInfo()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [data, setData] = useState({})
  const [exceptionData, setExceptionData] = useState({})
  const [showRejectRemarkModal, setShowRejectRemarkModal] = useState(false)

  useEffect(() => {
    if (userRole === 'hr' || userRole === 'super_admin') {
      dispatch(getListOfException({ skip, limit }))
    } else {
      dispatch(getExceptionListSingleEmp({ skip, limit }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, skip, limit])

  const onViewHandle = (record) => {
    setShowViewModal(true)
    setData(record)
  }
  // const handleDelete = (record) => {
  //   setShowDeleteModal(true)
  //   setData(record)
  // }
  const handleEditForm = (record) => {
    setData(record)
    setShowEditForm(true)
  }
  const onChangeHandler = (value) => {
    if (value) {
      if (userRole === 'hr' || userRole === 'super_admin') {
        dispatch(handleStatus(value))
        dispatch(getListOfException({ status: value, skip: 0, limit: 10 }))
      } else {
        dispatch(handleStatus(value))
        dispatch(getExceptionListSingleEmp({ status: value, skip: 0, limit: 10 }))
      }
    }
    if (!value) {
      if (userRole === 'hr' || userRole === 'super_admin') {
        dispatch(handleStatus(0))
        dispatch(getListOfException({ status: 0, skip: 0, limit: 10 }))
      } else {
        dispatch(handleStatus(0))
        dispatch(getExceptionListSingleEmp({ status: 0, skip: 0, limit: 10 }))
      }
    }
    handlePageChange(1)
  }
  const handleApproveConfirm = async (record) => {
    const approvedData = { ...record, exceptionStatus: statusEnums.APPROVED }
    const id = approvedData?.id
    const updatedException = await updateException(approvedData, id)
    if (updatedException?.status === 200) {
      // exceptionApproveSocket(updatedException?.data?.data, userId)
      notification.success({
        message: 'Exception Accepted',
      })
      setShowViewModal(false)
      dispatch(getListOfException({ status: statusFilter, skip: 0, limit: 10 }))
    }
  }
  const rejectHandler = (record) => {
    setShowRejectRemarkModal(true)
    setExceptionData(record)
  }

  const columns = [
    {
      title: 'Employee Name',
      fixed: 'left',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (employeeName) => employeeName?.userName,
    },
    {
      title: 'Raised Request',
      dataIndex: 'raisedRequest',
      key: 'raisedRequest',
      render: (raisedRequest) => raisedRequest?.displayName,
    },
    {
      title: 'Date From',
      dataIndex: 'dateFrom',
      key: 'dateFrom',
      render: (dateFrom) => utcToDate(dateFrom),
    },
    {
      title: 'Date To',
      dataIndex: 'dateTo',
      key: 'dateTo',
      render: (dateTo) => utcToDate(dateTo),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Space size="middle">
            <a>
              <EyeFilled onClick={() => onViewHandle(record)} id="view" />
            </a>
            {userRole !== 'super_admin' &&
              userRole !== 'hr' &&
              record.exceptionStatus === statusEnums.PENDING && (
                <a>
                  <EditFilled onClick={() => handleEditForm(record)} id="edit" />
                </a>
              )}
            {(userRole === 'hr' || userRole === 'super_admin') &&
              record.exceptionStatus === statusEnums.PENDING && (
                <Space>
                  <a>
                    <Popconfirm
                      title="Approve Exception"
                      description="Are you sure to approve this exception?"
                      onConfirm={() => handleApproveConfirm(record)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <CheckCircleOutlined
                        placement="top"
                        title="Approve"
                        style={{ fontSize: '16px', color: 'green' }}
                        id="approve"
                      />
                    </Popconfirm>
                  </a>
                  <a>
                    <CloseCircleOutlined
                      onClick={() => rejectHandler(record)}
                      style={{ fontSize: '16px', color: 'red' }}
                      id="reject"
                    />
                  </a>
                </Space>
              )}
            {/* <DeleteFilled onClick={() => handleDelete(record)} /> */}
          </Space>
        </>
      ),
    },
  ]
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

  const exceptionStatus = [
    {
      label: 'Pending',
      value: 0,
    },
    {
      label: 'Accepted',
      value: 1,
    },
    {
      label: 'Rejected',
      value: 2,
    },
  ]

  const getSteps = () => {
    if (userRole === 'hr') {
      const steps = [
        {
          selector: '#addException',
          content: 'Add an exception request',
        },
      ]
      if (exp?.exceptionList && exp?.exceptionList.length > 0) {
        steps.push(
          {
            selector: '#approve',
            content: 'Approve an exception request',
          },
          {
            selector: '#reject',
            content: 'reject an exception request',
          },
        )
      }
      return steps
    }
    const steps = [
      {
        selector: '#addException',
        content: 'Add an exception request',
      },
    ]
    if (exp?.exceptionList && exp?.exceptionList?.length > 0) {
      steps.push(
        {
          selector: '#view',
          content: 'View an exception request',
        },
        {
          selector: '#edit',
          content: 'Edit an exception request',
        },
      )
    }
    return steps
  }

  const steps = getSteps()
  useEffect(() => {
    dispatch(setTourSteps(steps))
  }, [steps, dispatch])

  return (
    <>
      <Card
        extra={
          <Space>
            <Select
              allowClear
              style={{
                width: 250,
              }}
              size="large"
              placeholder="Search Exception Status"
              options={exceptionStatus}
              onChange={onChangeHandler}
            />
            <AddException />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={exp?.exceptionList || []}
          rowKey="id"
          scroll={{ x: 900, y: 450 }}
          loading={isLoading}
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
        {showRejectRemarkModal && (
          <RejectRemark
            showRejectRemarkModal={showRejectRemarkModal}
            setShowRejectRemarkModal={setShowRejectRemarkModal}
            exceptionData={exceptionData}
            setShowViewModal={setShowViewModal}
          />
        )}
      </Card>
      {showViewModal && (
        <ViewException
          data={data}
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
        />
      )}
      {showDeleteModal && (
        <DeleteException
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          data={data}
        />
      )}
      {showEditForm && (
        <EditException showEditForm={showEditForm} setShowEditForm={setShowEditForm} data={data} />
      )}
    </>
  )
}
export default Exception
