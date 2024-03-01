import React, { useCallback, useEffect } from 'react'
import FileUpload from 'components/fileUpload'
import { Card, Space, Table, notification } from 'antd'
import { uploadRoster } from 'services/axios/roster'
import { useDispatch, useSelector } from 'react-redux'
import { getListOfRoster, handlePagination } from 'redux/roster/action'
import { setTourSteps } from 'redux/tour/actions'
import {
  CheckPermission,
  ModuleUniqueValues,
  Permissions,
  onPageChange,
  onPageSizeChange,
  resetPagination,
  defaultPagination,
} from 'utils'
import styles from './style.module.scss'

const Roster = () => {
  const { rosterList, totalCount, pagination } = useSelector((state) => state.roster)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const dispatch = useDispatch()
  const { skip, limit } = pagination

  const column = [
    {
      title: 'Employee ID',
      dataIndex: 'empId',
      key: 'empId',
      width: 150,
      render: (_, record) => `${record?.empId} (${record?.employee?.userName})`,
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      width: 100,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 100,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: 'Shift Timings',
      dataIndex: 'shiftTimings',
      key: 'shiftTimings',
      width: 400,
      render: (_, record) => {
        const parsedShiftTimings = JSON.parse(record.shiftTimings)
        return (
          <div className={styles.shifttTimingsContainer}>
            <div className={styles.shiftTimings}>
              {Object.keys(parsedShiftTimings).map((day) => (
                <div key={day} className={styles.shiftTiming}>
                  <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{' '}
                  {parsedShiftTimings[day]}
                </div>
              ))}
            </div>
          </div>
        )
      },
    },

    // {
    //   title: 'Process',
    //   dataIndex: 'process',
    //   key: 'process',
    // },
  ]
  const normalizeRosterList = rosterList?.map((item) => ({ ...item, ...item?.shiftTimings }))

  useEffect(() => {
    dispatch(getListOfRoster({ skip, limit }))
  }, [dispatch, skip, limit, pagination])
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRosterUpload = useCallback(
    async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadRoster(formData)
      if (result?.status === 200 && result?.data?.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: 'File uploaded successfully',
        })
        dispatch(getListOfRoster({ skip: 0, limit: 10 }))
      }
    },
    [dispatch],
  )

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

  const getSteps = [
    {
      selector: '#uploadRoster',
      content: 'Upload Roster file',
    },
    {
      selector: '#rosterTable',
      content: 'Roster data',
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
        title="Roster upload"
        extra={
          <CheckPermission
            permission={Permissions.UPLOAD_DATA}
            moduleUniqueValue={ModuleUniqueValues.ROSTER}
          >
            <Space>
              <div id="uploadRoster">
                <FileUpload handleUploadFinish={handleRosterUpload} title="Roster Upload" />
              </div>
            </Space>
          </CheckPermission>
        }
      >
        <Table
          dataSource={normalizeRosterList || []}
          columns={column}
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
          scroll={{ y: 450 }}
          rowKey="empId"
          id="rosterTable"
        />
      </Card>
    </>
  )
}

export default Roster
