import React from 'react'
import { Table, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const columns = [
  {
    title: 'Name',
    width: 300,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Created at',
    width: 100,
    dataIndex: 'createdat',
    key: 'age',
    // fixed: 'left',
  },
  {
    title: 'Is Active',
    dataIndex: 'isactive',
    key: '1',
    width: 150,
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => (
      <a>
        <EditOutlined /> <DeleteOutlined />
      </a>
    ),
  },
]

const data = []
for (let i = 0; i < 20; i += 1) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    createdat: 32,
    isactive: <Tag color="#f50">No</Tag>,
  })
}

class TablesAntdFixed extends React.Component {
  render() {
    return (
      <div className="table-responsive text-nowrap">
        <Table columns={columns} dataSource={data} scroll={{ x: 900, y: 300 }} />
      </div>
    )
  }
}

export default TablesAntdFixed
