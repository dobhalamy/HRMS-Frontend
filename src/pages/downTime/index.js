import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Card, Select, Popconfirm, notification } from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { updateDownTime } from 'services/axios/downTime'
import {
  getStatusLabel,
  utcToIst,
  getLoggedInUserInfo,
  CheckPermission,
  ModuleUniqueValues,
  Permissions,
  onPageChange,
  onPageSizeChange,
  resetPagination,
  defaultPagination,
} from 'utils'
import { useSelector, useDispatch } from 'react-redux'
import { getDownTimeList, handleStatus, handlePagination } from 'redux/downTime/action'
import { setTourSteps } from 'redux/tour/actions'
import AddDowntime from './addDownTime'
import DeleteDownTime from './deleteDownTime'
import ViewModal from './viewDownTime'
import RejectRemark from './rejectRemark'

const DownTime = () => {
  const dispatch = useDispatch()
  // const userDetailedInfo = useSelector((state) => state?.user?.userDetailedInfo)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [downTimeData, setDownTimeData] = useState({})
  const [showRejectRemarkModal, setShowRejectRemarkModal] = useState(false)
  const downTimeList = useSelector((state) => state?.downTimeState?.downTimeData)
  const totalCount = useSelector((state) => state?.downTimeState?.totalCount)
  const pagination = useSelector((state) => state?.downTimeState?.pagination)
  const statusFilter = useSelector((state) => state?.downTimeState?.status)
  const userRole = getLoggedInUserInfo()?.userRole
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)

  const downTimeStatus = [
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'empId',
      render: (startTime) => utcToIst(startTime),
    },

    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime) => utcToIst(endTime),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { color, displayStatus } = getStatusLabel(status)

        return <Tag color={color}>{displayStatus}</Tag>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>
            <EyeOutlined onClick={() => onViewHandle(record)} id="viewDownTime" />
          </a>
          {userRole !== 'hr' &&
            statusFilter === 0 && [
              <a>
                <DeleteOutlined onClick={() => onHandleDelete(record)} id="deleteDowntime" />
              </a>,
            ]}
          {statusFilter === 0 &&
            userRole === 'hr' && [
              <a>
                <Popconfirm
                  title="Approve Down Time"
                  description="Are you sure to approve this down time?"
                  onConfirm={() => handleApproveConfirm(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <CheckCircleOutlined
                    placement="top"
                    title="Approve"
                    style={{ fontSize: '16px', color: 'green' }}
                    id="approveDownTime"
                  />
                </Popconfirm>
              </a>,
              <a>
                <CloseCircleOutlined
                  onClick={() => rejectHandler(record)}
                  style={{ fontSize: '16px', color: 'red' }}
                  id="rejectDownTime"
                />
              </a>,
            ]}
        </Space>
      ),
    },
  ]
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
    dispatch(getDownTimeList({ skip, limit }))
  }, [dispatch, pagination])
  const onViewHandle = (record) => {
    setShowViewModal(true)
    setDownTimeData(record)
  }

  const onHandleDelete = (record) => {
    setShowDeleteModal(true)
    setDownTimeData(record)
  }
  const onChangeHandler = (value) => {
    if (value) {
      dispatch(handleStatus(value))
      dispatch(getDownTimeList({ status: value, skip: 0, limit: 10 }))
    } else {
      dispatch(handleStatus(0))
      dispatch(getDownTimeList({ status: 0, skip: 0, limit: 10 }))
    }
    handlePageChange(1)
  }
  const handleApproveConfirm = async (record) => {
    const approvedData = { ...record, status: 1 }
    const id = approvedData?.id
    const updatedDownTime = await updateDownTime(approvedData, id)
    if (updatedDownTime?.status === 200) {
      notification.success({
        message: 'Down Time Accepted',
      })
      setShowViewModal(false)
      dispatch(getDownTimeList({ status: statusFilter, skip: 0, limit: 10 }))
    }
  }
  const rejectHandler = (record) => {
    setShowRejectRemarkModal(true)
    setDownTimeData(record)
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

  const getSteps = () => {
    if (userRole === 'po') {
      const steps = [
        {
          selector: '#downTimeStatus',
          content:
            'Get the down time requests according to their status i.e Pending, Approve and Rejected',
        },
        {
          selector: '#downTimeData',
          content: 'Find all the down time raised request data here',
        },
      ]
      if (downTimeList?.downTime && downTimeList?.downTime?.length > 0) {
        steps.push(
          {
            selector: '#viewDownTime',
            content: 'View DownTime details',
          },
          {
            selector: '#approveDownTime',
            content: 'Approve the requested down time',
          },
          {
            selector: '#rejectDownTime',
            content: 'Reject the requested down time',
          },
        )
      }
      return steps
    }
    return [
      {
        selector: '#addDownTime',
        content: 'Add a down time request',
      },
      {
        selector: '#downTimeStatus',
        content:
          'Get the down time requests according to their status i.e Pending, Approve and Rejected',
      },
      {
        selector: '#downTimeData',
        content: 'Find all the down time raised request data here',
      },
    ]
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
              placeholder="Search Down Time Status"
              options={downTimeStatus}
              onChange={onChangeHandler}
              id="downTimeStatus"
            />
            <CheckPermission
              moduleUniqueValue={ModuleUniqueValues.DOWN_TIME}
              permission={Permissions.ADD}
            >
              <AddDowntime />
            </CheckPermission>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={downTimeList?.downTime}
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
          id="downTimeData"
        />
        {showDeleteModal && (
          <DeleteDownTime
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            downTimeData={downTimeData}
          />
        )}
        {showViewModal && (
          <ViewModal
            showViewModal={showViewModal}
            setShowViewModal={setShowViewModal}
            downTimeData={downTimeData}
          />
        )}
        {showRejectRemarkModal && (
          <RejectRemark
            showRejectRemarkModal={showRejectRemarkModal}
            setShowRejectRemarkModal={setShowRejectRemarkModal}
            downTimeData={downTimeData}
            setShowViewModal={setShowViewModal}
          />
        )}
      </Card>
    </>
  )
}
export default DownTime
