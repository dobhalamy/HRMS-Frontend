import React, { useCallback, useEffect, useState } from 'react'
import { Button, Table, Space, Select, Form } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import { EditOutlined } from '@ant-design/icons'
import { connect, useSelector } from 'react-redux'
import { fetchGTCData, handlePagination } from 'redux/globaltypecategory/actions'
import { fetchGTData } from 'redux/globalType/actions'
import { setCurrentPage } from 'redux/settings/actions'
import { defaultPagination, onPageSizeChange, resetPagination } from 'utils'
import AddGlobalTypeFormModal from './addFormModal'
import DeleteFormModal from './deleteFormModal'
import EditGlobalTypeFormModal from './editFormModal'

const GlobalTypeTableData = ({ GTCData, GTData, dispatch }) => {
  const [editform, setEditform] = useState({})
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editopen, setEditopen] = useState(false)
  const [deleteopen, setdeletopen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState(false)
  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }
  const handleCancel = (event) => {
    event.preventDefault()
    setOpen(false)
  }
  const handleClose = (event) => {
    event.preventDefault()
    setEditopen(false)
  }
  const handleClosedelete = (event) => {
    event.preventDefault()
    setdeletopen(false)
  }
  // const handleActiveChange = async (e, status, id) => {
  //   try {
  //     const response = await apiClient.put(ApiEndPoints.GLOBAL_TYPE_STATUS + id, {
  //       isActive: status,
  //     })
  //     if (response?.data?.status === true) {
  //       notification.success({
  //         message: 'Success',
  //         description: response.data.message,
  //       })
  //       setEditopen(false)
  //       dispatch(fetchGTData({ skip, limit, globalTypeCategory: categoryFilter || '' }))
  //     } else {
  //       notification.error({
  //         message: 'Error',
  //         description: response.data.message,
  //       })
  //     }
  //   } catch (error) {
  //     notification.error({
  //       message: 'Error',
  //       description: error?.response?.data?.error,
  //     })
  //   }
  // }
  const handlePageChange = (pageNumber, pageSize) => {
    const { totalCount } = GTData
    const isLastPage = Math.ceil(totalCount / pageSize)
    if (currentPage !== pageNumber && (currentPage <= isLastPage || currentPage === 2)) {
      const pageLimit = parseInt(pageNumber * oldPageSize, 10)
      const pageSkip = parseInt(pageLimit - oldPageSize, 10)
      dispatch(
        handlePagination({
          limit: pageLimit,
          skip: pageSkip,
          globalTypeCategory: categoryFilter || '',
        }),
      )
      dispatch(setCurrentPage(pageNumber))
    } else {
      dispatch(setCurrentPage(1))
    }
  }
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }
  const getListOfGlobalType = useCallback(async () => {
    dispatch(fetchGTData({ skip, limit }))
  }, [skip, limit, dispatch])

  useEffect(() => {
    return () => {
      dispatch(handlePagination(resetPagination))
    }
  }, [dispatch])
  useEffect(() => {
    if (limit >= 10) {
      if (categoryFilter) {
        dispatch(fetchGTData({ skip, limit, globalTypeCategory: categoryFilter }))
      } else {
        getListOfGlobalType()
      }
    }
  }, [skip, limit, getListOfGlobalType, categoryFilter, dispatch])

  useEffect(() => {
    dispatch(fetchGTCData())
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (value) => {
    setCategoryFilter(value)
    dispatch(fetchGTData({ skip: 0, limit: 10, globalTypeCategory: value }), handlePageChange(1))
  }

  const columns = [
    {
      title: 'Name',
      width: 200,
      dataIndex: 'displayName',
      key: 'displayName',
      fixed: 'left',
    },
    {
      title: 'Unique Value',
      width: 200,
      dataIndex: 'uniqueValue',
      key: 'uniqueValue',
    },
    {
      title: 'Global Type Category',
      width: 200,
      dataIndex: 'globalTypeCategory_uniqeValue',
      key: 'globalTypeCategory_uniqeValue',
    },
    // {
    //   title: 'Active',
    //   dataIndex: 'isActive',
    //   key: 'isActive',
    //   width: 70,
    //   render: (_, record) => (
    //     <Space className="activeInactive" size="middle">
    //       <Switch
    //         checkedChildren={<CheckOutlined />}
    //         unCheckedChildren={<CloseOutlined />}
    //         checked={record?.isActive}
    //         onChange={(e) => {
    //           handleActiveChange(e, record?.isActive, record?.id)
    //         }}
    //         data={record?.isActive}
    //       />
    //     </Space>
    //   ),
    // },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a>
            <EditOutlined
              onClick={() => {
                setEditform(record)
                setEditopen(true)
              }}
            />
          </a>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Helmet title="Ant Design" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-6">
                  <HeadersCardHeader data={{ title: 'Global Type' }} />
                </div>
                <div className="col-lg-3">
                  <Form.Item
                    name="globalTypeCategory"
                    rules={[
                      {
                        required: true,
                        message: 'Please Select Category!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Global Type Category"
                      onChange={handleChange}
                      allowClear
                    >
                      {GTCData?.globalTypeCategory?.map(({ uniqueValue, displayName }, index) => (
                        <Select.Option value={uniqueValue} key={`${uniqueValue}-${index}`}>
                          {displayName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-lg-2">
                  <Button type="primary" onClick={showModal}>
                    Add New Global Type
                  </Button>
                  {open && (
                    <AddGlobalTypeFormModal
                      handleOk={handleOk}
                      open={open}
                      setOpen={setOpen}
                      categoryFilter={categoryFilter}
                      handleCancel={handleCancel}
                      loading={loading}
                      GTCData={GTCData}
                    />
                  )}
                  {editopen && (
                    <EditGlobalTypeFormModal
                      handleOk={handleOk}
                      open={editopen}
                      setEditopen={setEditopen}
                      categoryFilter={categoryFilter}
                      handleCancel={handleClose}
                      loading={loading}
                      id={editform.id}
                      data={editform}
                      globalcategory={editform.globalTypeCategory_uniqeValue}
                      GTCData={GTCData}
                    />
                  )}
                  {deleteopen && (
                    <DeleteFormModal
                      handleOk={handleOk}
                      open={deleteopen}
                      setdeletopen={setdeletopen}
                      handleCancel={handleClosedelete}
                      loading={loading}
                      id={editform.id}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive text-nowrap">
                <Table
                  dataSource={GTData?.globalType}
                  rowKey="userPersonalEmail"
                  columns={columns}
                  pagination={{
                    defaultPageSize: oldPageSize,
                    current: parseInt(currentPage, 10),
                    total: GTData?.totalCount,
                    responsive: true,
                    onChange: handlePageChange,
                    onShowSizeChange: handlePageSizeChange,
                    showSizeChanger: true,
                    locale: { items_per_page: '' },
                    pageSizeOptions: ['10', '20', '50', '100'],
                  }}
                  scroll={{ x: 900, y: 450 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = ({ fetchGlobalTypeCategoryData, fetchMasterGlobalTypeData, dispatch }) => ({
  GTCData: fetchGlobalTypeCategoryData?.data.data,
  GTData: fetchMasterGlobalTypeData?.GTdata.data,
  dispatch,
})
export default connect(mapStateToProps)(GlobalTypeTableData)
