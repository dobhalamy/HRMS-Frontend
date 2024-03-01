import React from 'react'
import { Table, Tag } from 'antd'
import data from './data.json'

const columns = [
  {
    title: 'Holiday',
    dataIndex: 'holiday',
    key: 'holiday',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Day',
    key: 'day',
    dataIndex: 'day',
    render: (day) => (
      <span>
        <Tag color={Math.floor(Math.random() * 10) % 2 === 0 ? 'red' : 'green'} key={day}>
          {day.toUpperCase()}
        </Tag>
      </span>
    ),
  },
]

class TablesAntdBasic extends React.Component {
  render() {
    return (
      <div className="responsive-table text-nowrap">
        <Table columns={columns} dataSource={data} />
      </div>
    )
  }
}

export default TablesAntdBasic
