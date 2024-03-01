import React, { useEffect, useCallback, useState } from 'react'
import { Table, Card, Tag, Button, Space, notification, Select } from 'antd'
import { EyeFilled } from '@ant-design/icons'
import {
  monthNames,
  generateYears,
  onPageSizeChange,
  onPageChange,
  resetPagination,
  defaultPagination,
} from 'utils'
import { getMonthAttendance, uploadAprExcel, uploadAttendanceExcel } from 'services/axios/media'
import {
  handlePagination,
  handelNewRecord,
  handleIsOpen,
  handleYear,
  allEmpAttendance,
} from 'redux/attendance/action'
import { isEmpty } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import FileUpload from 'components/fileUpload'
import { setTourSteps } from 'redux/tour/actions'
import styles from '../style.module.scss'
import AttendanceModel from '../attendanceModal/index'
import MonthlyAttendance from '../monthlyAttendance'

const empData = {}
const AttendanceTable = () => {
  const [showMonthModal, setShowMonthModal] = useState(false)
  const totalCount = useSelector((state) => state.attendanceData.totalCount)
  const allEmployeeAttendance = useSelector((state) => state.attendanceData.empAttendance)
  const year = useSelector((state) => state.attendanceData.year)
  const isOpen = useSelector((state) => state.attendanceData.isOpen)
  const newRecord = useSelector((state) => state.attendanceData.newRecord)
  const pagination = useSelector((state) => state.attendanceData.pagination)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const years = generateYears()

  const dispatch = useDispatch()
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

  const handleClose = () => {
    dispatch(handleIsOpen(false))
  }
  const getYear = (attendanceYear) => {
    dispatch(handleYear(attendanceYear))
  }
  const handleChange = (SelectedYear) => {
    getYear(SelectedYear)
  }

  const fetchAttendanceData = useCallback(async () => {
    const { skip, limit } = pagination
    dispatch(allEmpAttendance({ skip, limit, year }))
  }, [year, pagination, dispatch])

  useEffect(() => {
    fetchAttendanceData()
  }, [year, fetchAttendanceData])
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handelRecord = (record) => {
    dispatch(handelNewRecord(record))
  }
  const renderEyeIcon = () => (
    <Space size="small">
      <Button
        className={styles.attendance_View_button}
        type="primary"
        onClick={() => {
          dispatch(handleIsOpen(true))
          dispatch(handelNewRecord(newRecord))
        }}
      >
        <EyeFilled />
        View
      </Button>
    </Space>
  )
  const getMonthlyAttendance = async (month, name, userId) => {
    const monthAttendance = await getMonthAttendance(month, year, userId)
    if (monthAttendance?.status && !isEmpty(monthAttendance?.data?.data)) {
      dispatch(handelNewRecord(monthAttendance?.data?.data))
      empData.name = name
      empData.month = month
      empData.year = year
      setShowMonthModal(true)
    }
  }
  const employeeAttendance = (employeeData) => {
    const newEmployee = employeeData?.map((item, index) => ({
      userId: item.userId,
      name: item.name,
      key: `employee-${index}`,
      data: item.data,
    }))
    return newEmployee
  }

  const handleAttendanceUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadAttendanceExcel(formData)
    if (result?.status === 200 && result?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: 'File uploaded successfully',
      })
      dispatch(allEmpAttendance({ skip: 0, limit: 10, year }))
    }
  }
  const handleUploadFinish = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadAprExcel(formData)
    if (result?.status === 200 && result?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: 'File uploaded successfully',
      })
      dispatch(allEmpAttendance({ skip: 0, limit: 10, year }))
    }
  }

  const column = [
    {
      title: 'Name',
      fixed: 'left',
      width: '10%',
      dataIndex: 'name',
      key: 'key',
    },
    ...monthNames.map((month, index) => ({
      title: month,
      width: `${80 / monthNames.length}%`,
      onCell: (record) => ({
        onClick: () => getMonthlyAttendance(month, record?.name, record?.userId),
      }),
      render: (text, record) => {
        const presentDays = record?.data[index]?.presentDays
        const workingDays = record?.data[index]?.workingDays
        const percent = (presentDays / workingDays) * 100
        return (
          <Tag className={styles.tableCell} color={percent >= 80 ? 'green' : 'red'} key={record}>
            {presentDays}/{workingDays}
          </Tag>
        )
      },
      dataIndex: `data[${index}]`,
      key: `column-${index}`,
    })),
    {
      title: 'Action',
      fixed: 'right',
      key: 'operation',
      render: renderEyeIcon,
    },
  ]
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }

  const getSteps = [
    {
      selector: '#attendance',
      content: 'Upload the Attendance excel sheet for all the member of organization.',
    },
    {
      selector: '#uploadApr',
      content: "Upload the Trainee's Performance Report.",
    },
    {
      selector: '#attendanceTable',
      content: 'Get attendance record of all the employees.',
    },
  ]

  const steps = getSteps

  useEffect(() => {
    dispatch(setTourSteps(steps))
  }, [steps, dispatch])

  return (
    <>
      <Card
        style={{ textAlign: 'center' }}
        title={`Employee View ${year}`}
        extra={
          <Space>
            <div id="attendance">
              <FileUpload
                handleUploadFinish={handleAttendanceUpload}
                isLoading={isLoading}
                title="Mark Attendance"
                id="attendance"
              />
            </div>
            <div id="uploadApr">
              <FileUpload
                handleUploadFinish={handleUploadFinish}
                isLoading={isLoading}
                title="APR Upload"
                id="uploadApr"
              />
            </div>
            <Select
              defaultValue={year}
              options={years}
              onChange={handleChange}
              style={{
                width: 100,
              }}
              dropdownStyle={{ textAlign: 'center' }}
            />
          </Space>
        }
      >
        <Table
          className={styles.attenScroll}
          dataSource={employeeAttendance(allEmployeeAttendance)}
          columns={column}
          onRow={(record, rowIndex) => ({
            onClick: () => handelRecord(record, rowIndex),
          })}
          scroll={{ x: 1500, y: 400 }}
          loading={isLoading}
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
          id="attendanceTable"
        />

        {isOpen && <AttendanceModel open={isOpen} handleCancel={handleClose} data={newRecord} />}
        {showMonthModal && (
          <MonthlyAttendance
            showMonthModal={showMonthModal}
            setShowMonthModal={setShowMonthModal}
            empData={empData}
          />
        )}
      </Card>
    </>
  )
}
export default AttendanceTable
