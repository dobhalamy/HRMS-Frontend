import React, { useCallback, useEffect, useState } from 'react'
import { Table, Space, Select, Form } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import { EditOutlined } from '@ant-design/icons'
import { connect, useSelector } from 'react-redux'
import { handlePagination } from 'redux/globaltypecategory/actions'
import {
  filterOption,
  onPageSizeChange,
  onPageChange,
  defaultPagination,
  resetPagination,
} from 'utils'
import { fetchMasterGTData } from 'redux/globalType/actions'
import { getEmployeeList } from 'redux/allEmployee/action'
import { fetchRYGstatusData } from 'redux/rygStatus/action'
import { rygStatusEnums } from 'enums/rygStatus'
import { setTourSteps } from 'redux/tour/actions'
import EditRYGFormModal from './editFormModal'

const RYGStatusTableData = ({ RYGstatusData, masterGlobalTypeData, dispatch }) => {
  const totalCount = RYGstatusData?.totalCount
  const [editform, setEditform] = useState({})
  const [showEditRYGForm, setShowEditRYGForm] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState(null)
  const [leaveFilter, setLeaveFilter] = useState(null)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)

  const employee = useSelector((state) => state?.toggle?.empList?.employee)
  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)
  const { userRole } = useSelector((state) => state?.user?.userInfo)
  const { Option } = Select

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
    dispatch(fetchMasterGTData('ryg_status'))
  }, [dispatch])
  const getListOfLeaveRequest = useCallback(async () => {
    dispatch(
      fetchRYGstatusData({
        StatusFilter: leaveFilter,
        skip,
        limit,
        EmployeeFilter: employeeFilter,
      }),
    )
  }, [dispatch, leaveFilter, skip, limit, employeeFilter])

  useEffect(() => {
    if (limit >= 10) {
      getListOfLeaveRequest()
    }
  }, [skip, limit, getListOfLeaveRequest])

  useEffect(() => {
    dispatch(getEmployeeList({ skip: 0, limit: 0 }))
  }, [dispatch, limit, skip])

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
    handlePageChange(1)
  }
  const handleLeaveTypeFilter = (value) => {
    setLeaveFilter(value)
    handlePageChange(1)
  }
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }

  const statusFind = (value) => {
    if (value?.status === rygStatusEnums.RED) {
      return 'Red'
    }
    if (value?.status === rygStatusEnums.YELLOW) {
      return 'Yellow'
    }
    return 'Green'
  }
  const columns = [
    {
      title: 'Employee Name',
      width: 200,
      dataIndex: 'userName',
      key: 'userName',
      render: (_, record) => `${record?.empId} (${record?.userName})`,
    },
    {
      title: 'Status',
      width: 150,
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <div>{record?.RYGstatus !== null ? statusFind(record?.RYGstatus) : <p>Pending</p>}</div>
        )
      },
    },

    {
      title: 'Sub Status',
      width: 250,
      dataIndex: 'subStatus',
      key: 'subStatus',
      render: (_, record) => {
        return (
          <div>
            {record?.RYGstatus !== null ? (
              record?.RYGstatus?.GlobalType?.displayName
            ) : (
              <p>Pending</p>
            )}
          </div>
        )
      },
    },
    {
      title: 'Remarks',
      width: 220,
      dataIndex: 'remarks',
      key: 'remarks',
      render: (_, record) => {
        return <div>{record?.RYGstatus?.remarks ? record?.RYGstatus?.remarks : <p>N/A</p>}</div>
      },
    },
    // {
    //   title: 'Process',
    //   width: 180,
    //   dataIndex: 'process',
    //   key: 'process',
    //   render: (_, record) => {
    //     return record?.processName?.displayName ? (
    //       <div>{record?.processName?.displayName}</div>
    //     ) : (
    //       <div>N/A</div>
    //     )
    //   },
    // },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        return (
          <Space wrap size="middle">
            <a>
              <EditOutlined
                title="Edit"
                style={{ fontSize: '16px' }}
                onClick={() => {
                  setEditform(record)
                  setShowEditRYGForm(true)
                }}
                id="edit"
              />
            </a>
          </Space>
        )
      },
    },
  ]

  const getSteps = [
    {
      selector: '#searchEmp',
      content: 'Search Employee here',
    },
    {
      selector: '#searchStatus',
      content: 'Search employee by color status assigned to them (Red, Yellow, Green)',
    },
    {
      selector: '#edit',
      content: 'Assign the color status to employee according to their termination',
    },
  ]

  const steps = getSteps

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
                  <HeadersCardHeader data={{ title: 'RYG Status' }} />
                </div>
                <div className="col-lg-3">
                  {(userRole === 'super_admin' || userRole === 'po' || userRole === 'hr') && (
                    <Form.Item
                      name="empId"
                      rules={[
                        {
                          required: true,
                          message: 'Please Select Employee!',
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
                          <Option key={item.empId} value={item.userId}>
                            {item.userName}
                          </Option>
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
                        message: 'Please Select Status!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Search Status"
                      filterOption={filterOption}
                      onChange={handleLeaveTypeFilter}
                      allowClear
                      id="searchStatus"
                    >
                      {masterGlobalTypeData?.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.displayName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                {showEditRYGForm && (
                  <EditRYGFormModal
                    showEditRYGForm={showEditRYGForm}
                    setShowEditRYGForm={setShowEditRYGForm}
                    data={editform}
                    masterGlobalTypeData={masterGlobalTypeData}
                  />
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive text-nowrap">
                <Table
                  dataSource={RYGstatusData?.employee}
                  rowKey="userName"
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
const mapStateToProps = ({ fetchRYGstatusEmpList, fetchMasterGlobalTypeData, dispatch }) => ({
  RYGstatusData: fetchRYGstatusEmpList?.data,
  masterGlobalTypeData: fetchMasterGlobalTypeData?.data?.data,
  dispatch,
})
export default connect(mapStateToProps)(RYGStatusTableData)
