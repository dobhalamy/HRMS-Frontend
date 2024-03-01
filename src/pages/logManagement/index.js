import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Table, Space, Button, DatePicker, Card } from 'antd'
import { EyeFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { getAllLog, getLogData } from 'redux/logManagement/actions'
import SingleLogData from './singleLogData'

const LogManagement = () => {
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  // const oldPageSize = useSelector((state) => state.settings?.pageSize)
  // const currentPage = useSelector((state) => state.settings?.currentPage)
  const [searchData, setSearchData] = useState(null)
  const [viewLog, setShowViewLog] = useState(false)
  const logs = useSelector((state) => state?.logs?.logs)
  // const pagination = useSelector((state) => state?.LogManagement?.pagination)
  const dispatch = useDispatch()
  useEffect(() => {
    // const { skip, limit } = pagination
    dispatch(getAllLog())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const onViewHandle = (record) => {
    setShowViewLog(true)
    // setLogData(record)
    dispatch(getLogData(record))
  }

  const handleDateChange = (date, dateString) => {
    const filteredLogs = logs?.filter((item) => item.fileName.includes(dateString))
    setSearchData(filteredLogs)
  }

  const columns = [
    {
      title: 'File Name',
      fixed: 'left',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (fileName) => fileName,
    },
    {
      title: 'Date',
      fixed: 'left',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => {
        const fileName = record?.fileName
        const dateParts = fileName.split('-')
        const dayPart = dateParts[3].split('.')[0] // Extracting the day part before the dot
        if (dateParts.length === 4) {
          const formattedDate = `${dayPart}-${dateParts[2]}-${dateParts[1]}`
          return formattedDate
        }
        return null // Handle invalid fileName format
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <>
            <Link to={`/log-management/${record.fileName}`}>
              <Button type="primary" id="view" onClick={() => onViewHandle(record)}>
                <EyeFilled />
              </Button>
            </Link>
          </>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        extra={
          <>
            <Space
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <DatePicker
                style={{ width: '15rem', bottom: '5px' }}
                placeholder="Search Log"
                onChange={handleDateChange}
              />
            </Space>
          </>
        }
      >
        <Table
          columns={columns}
          // dataSource={searchData || logs}
          dataSource={(searchData || logs).slice().reverse()}
          rowKey="id"
          scroll={{ x: 900, y: 450 }}
          loading={isLoading}
          // pagination={{
          //   defaultPageSize: oldPageSize,
          //   current: parseInt(currentPage, 10),
          //   // total: totalCount,
          //   responsive: true,
          //   // onChange: handlePageChange,
          //   // onShowSizeChange: handlePageSizeChange,
          //   showSizeChanger: true,
          //   locale: { items_per_page: '' },
          //   pageSizeOptions: ['10', '20', '50', '100'],
          // }}
        />
      </Card>
      {viewLog && <SingleLogData />}
    </>
  )
}

export default LogManagement
