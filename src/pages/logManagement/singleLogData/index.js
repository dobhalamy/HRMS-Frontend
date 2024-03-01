import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Table, Card, Space, Select, Input } from 'antd'
import { history } from 'index'
import { debounce } from 'lodash'

const SingleLogData = () => {
  const logData = useSelector((state) => state?.logs?.logData)
  const [filterLogs, setFilterLogs] = useState(null)
  const logContent = logData?.content
  let logArray
  if (logContent) {
    logArray = logContent.split('}')
  }

  const logStatus = [
    { label: 'Information', value: 'info' },
    { label: 'Warning', value: 'warn' },
    { label: 'Error', value: 'error' },
  ]

  const columns = [
    {
      title: 'Log Record',
      fixed: 'left',
      key: 'content',
      render: (content) => content,
    },
  ]

  const handleBackClick = () => {
    history.push('/log-Management')
  }

  const handleStatusChange = (status) => {
    applyFilter({ status })
  }

  const handleSearchChange = debounce((searchValue) => {
    applyFilter({ searchValue })
  }, 1000)

  const applyFilter = ({ status, searchValue }) => {
    let filteredLogs = logArray
    if (status && !searchValue) {
      filteredLogs = filteredLogs?.filter((item) => item.includes(status))
    } else if (searchValue && !status) {
      filteredLogs = filteredLogs?.filter((item) => item.includes(searchValue))
    } else {
      filteredLogs = filteredLogs?.filter((item) => item.includes(searchValue && status))
    }
    setFilterLogs(filteredLogs)
  }

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
              <Select
                placeholder="Search Log Status"
                options={logStatus}
                onChange={handleStatusChange}
                style={{ width: 200 }}
              />
              <Input
                placeholder="Search Log Content"
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ width: 200 }}
              />
              <Button type="primary" onClick={handleBackClick} size="middle" id="addEmp">
                Back
              </Button>
            </Space>
          </>
        }
      >
        <Table
          columns={columns}
          dataSource={filterLogs || logArray}
          rowKey="id"
          scroll={{ x: 900, y: 450 }}
        />
      </Card>
    </>
  )
}

export default SingleLogData
