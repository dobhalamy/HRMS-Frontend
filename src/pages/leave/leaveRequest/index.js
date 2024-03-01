import React, { useEffect, useState, useCallback } from 'react'
import { Table, Space, Select, Form, Popconfirm, message, Tag } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
// import { getTeamForSelectedEmployee } from 'services/axios/projectManagement'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
  EyeOutlined,
} from '@ant-design/icons'
import { connect, useSelector } from 'react-redux'
import {
  changeDateFormat,
  filterOption,
  onPageChange,
  onPageSizeChange,
  defaultPagination,
  resetPagination,
  getLoggedInUserInfo,
} from 'utils'
// import { getEmployeeList } from 'redux/allEmployee/action'
import { fetchEmpLeaveRequestData, handlePagination } from 'redux/empLeave/action'
// import { handlePagination } from 'redux/empLeave/action'
import { updateLeaveStatus } from 'services/axios/empLeave'
// import { fetchMasterGTData } from 'redux/globalType/actions'
import { setTourSteps } from 'redux/tour/actions'
// import { leaveApproveSocket } from 'socket'
import { getTeamForSelectedEmployee } from 'redux/projectInfo/action'
import { statusEnums, userRoleEnums } from 'enums/userRole'
import RejectLeaveFormModal from './rejectLeaveForm'
import ViewLeaveFormModal from './viewLeaveModal'
import DeleteForm from './deleteFormModal'

const LeaveRequestTableData = ({ LeaveRequestData, masterGlobalTypeData, dispatch }) => {
  const employee = useSelector((state) => state?.toggle?.empList?.employee)
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [showViewLeaveModal, setShowViewLeaveModal] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState()
  const [leaveFilter, setLeaveFilter] = useState()
  const [isDeleted, setIsDeleted] = useState(false)
  const [deleteRecord, setDeleteRecord] = useState(null)
  // const [team, setTeam] = useState(null)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const totalCount = LeaveRequestData?.totalCount
  const team = useSelector((state) => state?.projectInfo?.team)
  // const [filteredLeaveTableData, setFilteredLeaveTableData] = useState(null);
  const pagination = useSelector((state) => state.empLeaveData.pagination)
  const { skip, limit } = pagination

  // const { userRole, userId } = useSelector((state) => state?.user?.userInfo)
  const { userRole, userId } = getLoggedInUserInfo()
  // let filteredLeaveTableData
  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  const handleDelete = (data) => {
    setDeleteRecord(Array?.isArray(data) ? data[0]?.id : data?.id)
    setIsDeleted(true)
  }

  const handleDeleteCancel = () => {
    setIsDeleted(false)
    setDeleteRecord(null)
  }

  const distinctEmpLeave = LeaveRequestData?.leaveRequest?.filter((data) => !data?.poId)

  const leaveArray = distinctEmpLeave?.map((leaveData) => {
    if (!leaveData?.poId) {
      const empLeaveArray = LeaveRequestData?.leaveRequest?.filter(
        (data) =>
          leaveData?.userId === data?.userId &&
          leaveData?.leaveFrom === data?.leaveFrom &&
          leaveData?.leaveTo === data?.leaveTo &&
          (data?.poId || !data?.poId),
      )
      return empLeaveArray
    }
    if (userId === leaveData?.poId) {
      const empLeaveArray = LeaveRequestData?.leaveRequest?.filter(
        (data) =>
          leaveData?.userId === data?.userId &&
          leaveData?.leaveFrom === data?.leaveFrom &&
          leaveData?.leaveTo === data?.leaveTo &&
          leaveData?.poId !== data?.poId,
      )
      return empLeaveArray
    }
    return null
  })
  const leaveTableData = leaveArray?.filter((data) => data !== null)
  // setFilteredLeaveTableData(leaveTableData)
  const handleApproveConfirm = async (value) => {
    const ids = Array.isArray(value?.data) && value?.data?.map((item) => item.id)
    // value.data = Array.isArray(value?.data) ? value.data[value?.data.length - 1] : value.data
    value.data = Array.isArray(value?.data) ? value.data[0] : value.data
    value.data.ids = ids
    const response = await updateLeaveStatus(value, value?.data?.id, value?.data?.userId)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      if (value?.status === statusEnums?.REJECTED) {
        message.error(response.data.message)
      } else {
        // leaveApproveSocket(response?.data?.data, response?.data?.userId, dispatch)
        message.success(response.data.message)
      }
      dispatch(
        fetchEmpLeaveRequestData({
          // leaveStatus: 0,
          skip,
          limit,
          employeeValue: null,
          team: JSON.stringify(team),
        }),
      )
    }
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

  useEffect(() => {
    dispatch(getTeamForSelectedEmployee(userId))
  }, [dispatch, userId])

  const getListOfLeaveRequest = useCallback(() => {
    dispatch(
      fetchEmpLeaveRequestData({
        // leaveStatus: 0,
        skip,
        limit,
        employeeValue: null,
        team: JSON.stringify(team),
      }),
    )
  }, [dispatch, skip, limit, team])

  useEffect(() => {
    if (limit >= 10 && team) {
      getListOfLeaveRequest()
    }
  }, [skip, limit, getListOfLeaveRequest, team])

  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEmployeeChange = (value) => {
    setEmployeeFilter(value)
    dispatch(
      fetchEmpLeaveRequestData({
        leaveStatus: leaveFilter,
        skip,
        limit,
        employeeValue: value,
        // team,
      }),
      handlePageChange(1),
    )
  }
  const handleLeaveTypeFilter = (value) => {
    setLeaveFilter(value)
    dispatch(
      fetchEmpLeaveRequestData({
        leaveStatus: value,
        skip,
        limit,
        employeeValue: employeeFilter,
        team: JSON.stringify(team),
      }),
      handlePageChange(1),
    )
  }
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }
  const columns = [
    {
      title: 'Name',
      width: 200,
      dataIndex: 'userName',
      key: 'userName',
      fixed: 'left',
      render: (_, record) => {
        // if (Array.isArray(record)) return (record[record?.length - 1]?.requestedUserName)
        // return record?.userName
        // return null
        return record[record?.length - 1]?.requestedUser?.userName
      },
    },
    {
      title: 'Leave Type',
      width: 250,
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (_, record) => {
        // if (Array.isArray(record))
        // return record[record?.length - 1]?.leaveType.replace(/_/g, ' ').toUpperCase()
        // return record?.leaveType.replace(/_/g, ' ').toUpperCase()
        return record[record?.length - 1]?.leaveType?.replace(/_/g, ' ').toUpperCase()
      },
    },
    {
      title: 'Leave From',
      width: 180,
      dataIndex: 'leaveFrom',
      key: 'leaveFrom',
      render: (_, record) => {
        // if (Array.isArray(record)) return changeDateFormat(record[record?.length - 1]?.leaveFrom)
        // return changeDateFormat(record?.leaveFrom)
        return changeDateFormat(record[record?.length - 1]?.leaveFrom)
      },
    },
    {
      title: 'Leave To',
      width: 180,
      dataIndex: 'leaveTo',
      key: 'leaveTo',
      render: (_, record) => {
        // if (Array.isArray(record)) return changeDateFormat(record[record?.length - 1]?.leaveTo)
        // return changeDateFormat(record?.leaveTo)
        return changeDateFormat(record[record?.length - 1]?.leaveTo)
      },
    },
    {
      title: 'Status',
      width: 180,
      dataIndex: 'status',
      key: 'status',
      // hidden: (userRole !== 'hr' && team?.length>0) ,
      render: (_, record) => {
        let color
        let text
        // if (empId !== LeaveRequestData?.leaveRequest[0]?.poId) {
        if (record[record.length - 1]?.universalLeaveStatus === statusEnums?.APPROVED) {
          color = 'green'
          text = 'approve'
        } else if (record[record.length - 1]?.universalLeaveStatus === statusEnums?.REJECTED) {
          color = 'volcano'
          text = 'rejected'
        } else {
          color = 'yellow'
          text = 'pending'
        }

        return (
          <Tag color={color} key={record[record.length - 1]?.id}>
            {text?.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 150,
      render: (_, record) => {
        // const recordData = Array.isArray(record) ? record[record?.length - 1] : record
        const recordData = Array.isArray(record) ? record[0] : record
        recordData.start = recordData?.leaveFrom
        recordData.end = recordData?.leaveTo
        // const leaveStartDate = new Date(recordData.leaveFrom)
        // const currentDate = new Date()
        let ls = 1
        if (userRole !== userRoleEnums?.HR && userRole !== userRoleEnums?.SUPER_ADMIN) {
          ls = record?.filter(
            (data) => data?.poId === userId && data?.leaveStatus === statusEnums?.PENDING,
          )
        }
        return (
          <Space wrap size="middle">
            {(((userRole === userRoleEnums?.HR || userRole === userRoleEnums?.SUPER_ADMIN) &&
              recordData?.leaveStatus === 0) ||
              (ls && ls[0]?.leaveStatus === 0)) && (
              <>
                <a>
                  <Popconfirm
                    title="Approve Leave"
                    description="Are you sure to approve this leave request?"
                    onConfirm={() =>
                      handleApproveConfirm({ data: record, status: statusEnums?.APPROVED })
                    }
                    okText="Yes"
                    cancelText="No"
                  >
                    <CheckCircleOutlined
                      placement="top"
                      title="Approve"
                      style={{ fontSize: '16px', color: 'green' }}
                      onClick={() => {
                        setEditForm({ data: record, status: statusEnums?.APPROVED })
                      }}
                      id="approve"
                    />
                  </Popconfirm>
                </a>
                <a>
                  <CloseCircleOutlined
                    title="Reject Leave"
                    style={{ fontSize: '16px', color: 'red' }}
                    onClick={() => {
                      setEditForm({ data: record, status: statusEnums?.REJECTED })
                      setRejectOpen(true)
                    }}
                    id="reject"
                  />
                </a>
              </>
            )}
            {record?.leaveStatus === statusEnums?.APPROVED && (
              <Tag bordered={false} color="success">
                Approved
              </Tag>
            )}
            {record?.leaveStatus === statusEnums?.REJECTED && (
              <Tag bordered={false} color="error">
                Rejected
              </Tag>
            )}
            <a>
              <EyeOutlined
                title="View Leave"
                style={{ fontSize: '16px' }}
                onClick={() => {
                  setEditForm(record)
                  setShowViewLeaveModal(true)
                }}
                id="view"
              />
            </a>
            {record[0]?.universalLeaveStatus === 0 && userId === record[0]?.userId && (
              <a>
                <DeleteFilled onClick={() => handleDelete(record)} id="delete" />
              </a>
            )}
          </Space>
        )
      },
    },
  ].filter((item) => !item.hidden)

  const getSteps = () => {
    if (userRole === userRoleEnums?.HR) {
      const steps = [
        {
          selector: '#searchEmp',
          content: 'Search employee by entering the name or alphabets',
        },
        {
          selector: '#searchStatus',
          content: 'Search leaves by the leave status i.e Pending, Approve or Reject',
        },
      ]
      if (LeaveRequestData?.leaveRequest && LeaveRequestData?.leaveRequest?.length > 0) {
        steps.push(
          {
            selector: '#approve',
            content: 'Approve the leave request',
          },
          {
            selector: '#reject',
            content: 'Reject leave request',
          },
        )
      }
      return steps
    }
    const steps = [
      {
        selector: '#searchStatus',
        content: 'Search leaves by the leave status i.e Pending, Approve or Reject',
      },
    ]
    if (LeaveRequestData?.leaveRequest && LeaveRequestData?.leaveRequest?.length > 0) {
      steps.push(
        {
          selector: '#view',
          content: 'View the leave request',
        },
        {
          selector: '#delete',
          content: 'Delete the leave request',
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
    <div>
      <Helmet title="Ant Design" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-6">
                  <HeadersCardHeader data={{ title: 'Leave Requests' }} />
                </div>
                <div className="col-lg-3">
                  {(userRole === userRoleEnums?.SUPER_ADMIN || userRole === userRoleEnums?.HR) && (
                    <Form.Item
                      name="globalTypeCategory"
                      rules={[
                        {
                          required: true,
                          message: 'Please Select employee!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Search Employee"
                        filterOption={filterOption}
                        onChange={handleEmployeeChange}
                        allowClear
                        id="searchEmp"
                      >
                        {employee?.map((item) => (
                          // <option key={item.empId} value={item.empId}>
                          <Select.Option key={item?.userId} value={item?.userId}>
                            {item?.userName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </div>
                <div className="col-lg-3">
                  <Form.Item
                    name="leaveType"
                    rules={[
                      {
                        required: true,
                        message: 'Please Select Leave Type!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Search Leave Type"
                      filterOption={filterOption}
                      onChange={handleLeaveTypeFilter}
                      allowClear
                      id="searchStatus"
                    >
                      <Select.Option key="leaveRequest" value={statusEnums?.PENDING} selected>
                        Pending Requests
                      </Select.Option>
                      <Select.Option key="approved" value={statusEnums?.APPROVED}>
                        Approved
                      </Select.Option>
                      <Select.Option key="rejected" value={statusEnums?.REJECTED}>
                        Rejected
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                {rejectOpen && (
                  <RejectLeaveFormModal
                    rejectOpen={rejectOpen}
                    setRejectOpen={setRejectOpen}
                    loading={loading}
                    leaveData={editForm}
                  />
                )}
                {showViewLeaveModal && (
                  <ViewLeaveFormModal
                    showViewLeaveModal={showViewLeaveModal}
                    setShowViewLeaveModal={setShowViewLeaveModal}
                    data={editForm}
                    loading={loading}
                    setLoading={setLoading}
                    handleOk={handleOk}
                    employee={employee}
                    leaveType={masterGlobalTypeData}
                  />
                )}
                {isDeleted && (
                  <DeleteForm
                    open={isDeleted}
                    setDeleteOpen={setIsDeleted}
                    // handleOk={handleDeleteOk}
                    handleCancel={handleDeleteCancel}
                    loading={loading}
                    id={deleteRecord}
                  />
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive text-nowrap">
                <Table
                  dataSource={leaveTableData || []}
                  rowKey="userPersonalEmail"
                  columns={columns}
                  pagination={{
                    defaultPageSize: oldPageSize,
                    current: parseInt(currentPage, 10),
                    responsive: true,
                    total: totalCount,
                    onChange: handlePageChange,
                    onShowSizeChange: handlePageSizeChange,
                    showSizeChanger: true,
                    locale: { items_per_page: '' },
                    pageSizeOptions: ['10', '20', '50', '100'],
                  }}
                  scroll={{ x: 900, y: 450 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = ({ empLeaveData, fetchMasterGlobalTypeData, dispatch }) => ({
  LeaveRequestData: empLeaveData?.leaveRequestData,
  masterGlobalTypeData: fetchMasterGlobalTypeData?.data?.data,
  dispatch,
})
export default connect(mapStateToProps)(LeaveRequestTableData)
