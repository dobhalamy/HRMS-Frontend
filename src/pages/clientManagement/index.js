import React, { useEffect, useState, useCallback } from 'react'
import { Table, Card, Button, Space, Input } from 'antd'
import { EditFilled, EyeFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { getAllClientInfo, handleSearchCustomer, handlePagination } from 'redux/clientInfo/action'
import { debounce } from 'lodash'
import { onPageChange, onPageSizeChange } from 'utils'
import AddNewClient from './addNewClient'
import ViewClient from './viewClient'
import EditClient from './editClient'

const ClientManagement = () => {
  const dispatch = useDispatch()
  const clientInfo = useSelector((state) => state?.clientInfo?.clientInfoData)
  const totalCount = useSelector((state) => state?.clientInfo?.totalCount)
  const searchedCustomer = useSelector((state) => state?.clientInfo?.searchedCustomer)
  const pagination = useSelector((state) => state?.clientInfo?.pagination)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const [clientData, setClientData] = useState()
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const onViewHandle = (record) => {
    setShowViewModal(true)
    setClientData(record)
  }

  const handleEditForm = (record) => {
    setShowEditForm(true)
    setClientData(record)
  }
  const getAllClientData = useCallback(async () => {
    const { skip, limit } = pagination
    dispatch(
      getAllClientInfo({
        skip,
        limit,
        searchedCustomer,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination, searchedCustomer])
  useEffect(() => {
    getAllClientData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getAllClientData])
  const handleSearchChange = debounce((searchCustomer) => {
    if (searchCustomer === null || searchCustomer === '') {
      dispatch(handleSearchCustomer(null))
    } else {
      dispatch(handleSearchCustomer(searchCustomer))
    }
    // handlePageChange(1)
  }, 1000)

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

  const columns = [
    {
      title: 'Business Name ',
      dataIndex: 'businessName',
      render: (_, record) => record?.businessName,
    },
    {
      title: 'Business Address',
      dataIndex: 'businessAddress',
      render: (_, record) => record?.businessAddress,
    },
    {
      title: 'Business Phone Number',
      dataIndex: 'businessPhoneNumber',
      render: (_, record) => <span>+{record?.businessPhoneNumber}</span>,
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      render: (_, record) => record?.contactPersonName,
    },
    {
      title: 'Client Email',
      dataIndex: 'contactPersonEmail',
      render: (_, record) => record?.contactPersonEmail,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Space size="middle">
            <>
              <Button type="primary" onClick={() => onViewHandle(record)} id="view">
                <EyeFilled />
              </Button>
              <Button type="primary" onClick={() => handleEditForm(record)} id="edit">
                <EditFilled />
              </Button>
            </>
          </Space>
        </>
      ),
    },
  ]
  return (
    <>
      <Card
        extra={
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <Space className="searchClient">
              <Input
                placeholder="Search Client"
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ width: 200 }}
              />
            </Space>
            <AddNewClient />
          </Space>
        }
      >
        <Table
          dataSource={clientInfo || []}
          columns={columns}
          rowKey="id"
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
          scroll={{ x: 900, y: 450 }}
        />
        {showViewModal && (
          <ViewClient
            showViewModal={showViewModal}
            setShowViewModal={setShowViewModal}
            clientData={clientData}
          />
        )}
        {showEditForm && (
          <EditClient
            showEditForm={showEditForm}
            setShowEditForm={setShowEditForm}
            clientData={clientData}
          />
        )}
      </Card>
    </>
  )
}

export default ClientManagement
