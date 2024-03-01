import { Table, Space, Input, DatePicker, Button, Select } from 'antd'
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  defaultPagination,
  getLoggedInUserInfo,
  resetPagination,
  hourConversion,
  onPageChange,
  onPageSizeChange,
  filterOption,
} from 'utils'
import { userRoleEnums } from 'enums/userRole'
import { SearchOutlined, EyeFilled } from '@ant-design/icons'
import {
  handleSearchText,
  handleStartDate,
  handleEndDate,
  handlePagination,
  handleLoading,
  handleDsrTableData,
  handleSearchEmployee,
  handleDsrTableTotalCount,
  getEmployeeList,
} from 'redux/employeeDsr/action'
import { setTourSteps } from 'redux/tour/actions'

import { getEmployeeDsr, getAllEmployeeDsr } from 'services/axios/dsr'
import { debounce, isEmpty } from 'lodash'
import moment from 'moment'

import TasksDrawer from './tasksDrawer'

const { RangePicker } = DatePicker

const DsrTable = () => {
  const dateFormat = 'DD-MMM-YYYY'
  const dispatch = useDispatch()
  const [showTasksDrawer, setShowTasksDrawer] = useState(false)
  const [dsrTasks, setDsrTasks] = useState({})
  const searchText = useSelector((state) => state?.dsrState?.searchText)
  const { employee } = useSelector((state) => state?.dsrState?.empList)
  const searchedEmployee = useSelector((state) => state?.dsrState?.searchedEmployee)
  const startDate = useSelector((state) => state?.dsrState?.startDate)
  const endDate = useSelector((state) => state?.dsrState?.endDate)
  const pagination = useSelector((state) => state?.dsrState?.pagination)
  const loading = useSelector((state) => state?.dsrState?.loading)
  const dsrTableData = useSelector((state) => state?.dsrState?.dsrTableData)
  const totalCount = useSelector((state) => state?.dsrState?.totalCount)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const userRole = getLoggedInUserInfo()?.userRole
  const loggedInUserId = getLoggedInUserInfo()?.userId

  const groupedTasks = dsrTableData.reduce((result, task) => {
    if (!result[task?.workingDate]) {
      result[task?.workingDate] = []
    }
    result[task?.workingDate].push(task)
    return result
  }, {})
  const newDsrListData = []
  const objectKeys = Object.keys(groupedTasks)
  const objectValues = Object.values(groupedTasks)
  for (let i = 0; i < objectValues?.length; i += 1) {
    const workingDate = objectKeys[i]
    const tasks = objectValues[i]
    let totalWorkingHours = 0
    for (let j = 0; j < tasks?.length; j += 1) {
      totalWorkingHours += tasks[j]?.workingHours
    }
    const { empId } = tasks[0]
    const { userName } = tasks[0].employee

    newDsrListData.push({
      workingDate: moment(workingDate).format(dateFormat),
      totalWorkingHours: hourConversion(totalWorkingHours),
      empId,
      userName,
      tasks,
    })
  }

  const columns = [
    userRole !== 'hr' && userRole !== 'super_admin'
      ? {
          title: 'Employee Id',
          dataIndex: 'empId',
          key: 'empId',
          render: (_, record) => `${record?.empId} (${record?.userName})`,
        }
      : null,
    {
      title: 'WORKING DATE',
      dataIndex: 'workingDate',
      key: 'workingDate',
      sorter: (a, b) => new Date(a.workingDate) - new Date(b.workingDate),
    },

    { title: 'TOTAL WORKING HOURS', dataIndex: 'totalWorkingHours', key: 'totalWorkingHours' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onClickHandler(record)} id="view">
            <EyeFilled />
          </Button>
        </Space>
      ),
    },
  ].filter(Boolean)
  const onClickHandler = (record) => {
    setDsrTasks(record)
    setShowTasksDrawer(true)
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
  const getEmployeeDsrData = useCallback(async () => {
    const { skip, limit } = pagination
    let employeeDsrData
    if (userRole === 'super_admin' || userRole === 'hr') {
      employeeDsrData = await getAllEmployeeDsr({
        skip,
        limit,
        searchText,
        searchedEmployee,
        startDate,
        endDate,
      })
    } else if (!isEmpty(employee) && searchedEmployee) {
      employeeDsrData = await getAllEmployeeDsr({
        skip,
        limit,
        searchText,
        searchedEmployee,
        startDate,
        endDate,
      })
    } else {
      employeeDsrData = await getEmployeeDsr({ skip, limit, searchText, startDate, endDate })
    }
    if (employeeDsrData?.data?.status && employeeDsrData?.status) {
      dispatch(handleDsrTableData(employeeDsrData?.data?.data?.dsrList))
      dispatch(handleDsrTableTotalCount(employeeDsrData?.data?.data?.totalCount))

      dispatch(handleLoading(false))
    } else {
      dispatch(handleLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination, searchText, searchedEmployee, startDate, endDate])
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
      dispatch(handleSearchText(null))
      dispatch(handleStartDate(null))
      dispatch(handleEndDate(null))
      dispatch(handleSearchEmployee(null))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getEmployeeList({ skip: 0, limit: 0 }))
  }, [dispatch, pagination])

  useEffect(() => {
    getEmployeeDsrData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getEmployeeDsrData])

  const onChangeHandler = debounce((text) => {
    if (text === null || text === '') {
      dispatch(handleSearchText(null))
    } else {
      dispatch(handleSearchText(text))
    }
    handlePageChange(1)
  }, 1000)
  const onChangeDateHandler = debounce((values) => {
    if (values === null) {
      dispatch(handleStartDate(null))
      dispatch(handleEndDate(null))
    } else {
      dispatch(handleStartDate(moment(values[0]).format('YYYY/MM/DD')))
      dispatch(handleEndDate(moment(values[1]).format('YYYY/MM/DD')))
    }
    handlePageChange(1)
  }, 1000)

  const handleEmployeeChange = (value) => {
    if (value === null || value === undefined) {
      dispatch(handleSearchEmployee(null))
    } else {
      dispatch(handleSearchEmployee(value))
    }
  }
  const getSteps = () => {
    if (userRole !== 'hr') {
      const steps = [
        {
          selector: '#addDsr',
          content: 'Add your daily status report from here',
        },
        {
          selector: '#searchDsr',
          content: 'Search your dsr according to date range',
        },
        {
          selector: '#searchTask',
          content: 'Search your dsr according to task',
        },
      ]
      if (dsrTableData && dsrTableData?.length > 0) {
        steps.push(
          {
            selector: '#dsrTable',
            content: 'Dsr table data',
          },
          {
            selector: '#view',
            content: 'View details of dsr',
          },
        )
      }
      return steps
    }
    if (dsrTableData && dsrTableData.length > 0) {
      return [
        {
          selector: '#addDsr',
          content: 'Add your daily status report from here',
        },
        {
          selector: '#searchDsr',
          content: 'Search dsr according to date range',
        },
        {
          selector: '#searchEmpDsr',
          content: 'Search dsr according to employee',
        },
        {
          selector: '#searchTask',
          content: 'Search dsr according to task',
        },
        {
          selector: '#dsrTable',
          content: 'Dsr table data',
        },
        {
          selector: '#view',
          content: 'View details of dsr',
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
      <Space
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <RangePicker
          id="searchDsr"
          size="large"
          format={dateFormat}
          onChange={(values) => onChangeDateHandler(values)}
        />
        <Space>
          {(userRole === userRoleEnums.SUPER_ADMIN ||
            userRole === userRoleEnums.HR ||
            !isEmpty(employee)) && (
            <Select
              id="searchEmpDsr"
              style={{
                width: 200,
              }}
              size="large"
              showSearch
              defaultValue={
                userRole === userRoleEnums.SUPER_ADMIN || userRole === userRoleEnums.HR
                  ? undefined
                  : loggedInUserId
              }
              placeholder="Search Employee"
              filterOption={filterOption}
              onChange={handleEmployeeChange}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {employee?.map((item) => (
                <Select.Option key={item.userId} value={item.userId}>
                  {item.userName}
                </Select.Option>
              ))}
            </Select>
          )}

          <Input
            id="searchTask"
            suffix={<SearchOutlined />}
            placeholder="Search for Task Details"
            style={{ paddingTop: 8, paddingBottom: 8, width: 220 }}
            onChange={(e) => onChangeHandler(e.target.value)}
            size="large"
          />
        </Space>
      </Space>

      <Table
        id="dsrTable"
        dataSource={newDsrListData}
        columns={columns}
        loading={loading}
        rowKey="workingDate"
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
      {showTasksDrawer && (
        <TasksDrawer
          dsrTasks={dsrTasks}
          showTasksDrawer={showTasksDrawer}
          setShowTasksDrawer={setShowTasksDrawer}
        />
      )}
    </>
  )
}
export default DsrTable
