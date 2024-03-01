import React, { useEffect, useState } from 'react'
import { Table, Space, Button } from 'antd'
import { FileDoneOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const PersonalDocuments = ({ userDetailedInfo }) => {
  const [loading, setLoading] = useState(true)

  const baseURL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_DEV_BASE_URL
      : process.env.REACT_APP_PROD_BASE_URL

  useEffect(() => {
    if (userDetailedInfo) {
      setLoading(false)
    }
  }, [userDetailedInfo])

  if (loading) {
    return <div>Loading...</div>
  }

  const column = [
    {
      title: 'Document Type',
      dataIndex: 'mediaType',
      key: 'mediaType',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              const docPath = baseURL?.replace('/api/v1', '')
              if (process.env.NODE_ENV === 'development') {
                window.open(`${docPath}${record?.mediaLink}`, '_blank')
              } else {
                window.open(`${docPath}/${record?.mediaLink}`, '_blank')
              }
            }}
          >
            <FileDoneOutlined />
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        rowClassName={() => style['custom-row-class']}
        dataSource={userDetailedInfo?.documents || []}
        columns={column}
        pagination={false}
      />
    </>
  )
}

export default PersonalDocuments
