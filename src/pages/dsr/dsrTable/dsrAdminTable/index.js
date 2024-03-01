import { Table, Space, Input, DatePicker, Select } from 'antd'
import React from 'react'

import moment from 'moment'

const { RangePicker } = DatePicker
const data = [
  {
    key: '1',
    projectName: 'MMA',
    assignedEmployee: 'Saurabh Singh',
    workingDate: moment('10-Mar-2019').format('DD-MMM-YYYY'),
    workingHours: '2 hours',
    taskStatus: 'Completed',
    taskDetails: ['nice', 'developer'],
  },
  {
    key: '2',
    projectName: 'UFC',
    assignedEmployee: 'Saurabh',
    workingDate: moment('14-APR-2019').format('DD-MMM-YYYY'),
    workingHours: '2 hours',
    taskStatus: 'Completed',
    taskDetails: ['nice', 'developer'],
  },
  {
    key: '3',
    projectName: 'NBA',
    assignedEmployee: 'Shivam',
    workingDate: moment('17-MaY-2019').format('DD-MMM-YYYY'),
    workingHours: '2 hours',
    taskStatus: 'In-progress',
    taskDetails: ['developer'],
  },
]
const EmployeeName = [
  {
    lable: 'Saurabh Singh',
    value: 'Saurabh Singh',
  },
  {
    lable: 'Shivam',
    value: 'Shivam',
  },
  {
    lable: 'Saurabh',
    value: 'Saurabh',
  },
]
const ProjectName = [
  {
    lable: 'MMA',
    value: 'MMA',
  },
  {
    lable: 'NBA',
    value: 'NBA',
  },
  {
    lable: 'UFC',
    value: 'UFC',
  },
]
const columns = [
  {
    title: 'PROJECT NAME',
    dataIndex: 'projectName',
    key: 'projecName',
  },
  {
    title: 'ASSIGNED EMPLOYEE',
    dataIndex: 'assignedEmployee',
    key: 'assignedEmployee',
  },
  {
    title: 'WORKING DATE',
    dataIndex: 'workingDate',
    key: 'workingDate',
    sorter: (a, b) => new Date(a.workingDate) - new Date(b.workingDate),
  },
  { title: 'WORKING HOURS', dataIndex: 'workingHours', key: 'workingHours' },
  { title: 'TASK STATUS', dataIndex: 'taskStatus', key: 'taskStatus' },
  { title: 'TASK DETAILS ', dataIndex: 'taskDetail', key: 'taskDetail' },
]
const DsrAdminTable = () => {
  const dateFormat = 'DD-MMM-YYYY'

  return (
    <>
      <Space>
        <RangePicker size="large" format={dateFormat} />

        <Input.Search
          placeholder="Search for Task Details"
          style={{ paddingTop: 8, paddingBottom: 8, width: 260 }}
          enterButton="Search"
          size="large"
        />
        <Select
          allowClear
          placeholder="Employee name"
          size="large"
          options={EmployeeName}
          style={{ width: 150 }}
        />
        <Select
          placeholder="Project name"
          size="large"
          options={ProjectName}
          style={{ width: 150 }}
        />
      </Space>
      <Table dataSource={data} columns={columns} />
    </>
  )
}
export default DsrAdminTable
