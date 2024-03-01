import React, { useCallback, useEffect, useState } from 'react'
import { Button, Table, Space } from 'antd'
import { Helmet } from 'react-helmet'
import HeadersCardHeader from '@vb/widgets/Headers/CardHeader'
import { EditOutlined } from '@ant-design/icons'
import { connect, useSelector } from 'react-redux'
import { fetchGTCData, handlePagination } from 'redux/globaltypecategory/actions'
import { defaultPagination, onPageChange, onPageSizeChange, resetPagination } from 'utils'
import AddFormModal from './addFormModal'
import EditFormModal from './editFormModal'
import DeleteFormModal from './deleteFormModal'

const GlobalTypeTable = ({ categoryData, dispatch }) => {
  const [editform, setEditform] = useState({})
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { skip, limit } = useSelector((state) => state.fetchGlobalTypeCategoryData.pagination)
  const [editopen, setEditopen] = useState(false)
  const [deleteopen, setDeletopen] = useState(false)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)

  const handlePageChange = (pageNumber, pageSize) => {
    const { totalCount } = categoryData
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
  const getListOfGlobalTypeCategory = useCallback(async () => {
    dispatch(fetchGTCData({ skip, limit }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, dispatch])

  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (limit >= 10) {
      getListOfGlobalTypeCategory()
    }
  }, [skip, limit, getListOfGlobalTypeCategory])

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
    setDeletopen(false)
  }
  // const handleActiveChange = async (e, isActive, id) => {
  //   const status = isActive ? 1 : 0
  //   try {
  //     const response = await apiClient.put(ApiEndPoints.GLOBAL_TYPE_CATEGORY_STATUS + id, {
  //       isActive: status,
  //     })
  //     if (response?.data?.status === true) {
  //       notification.success({
  //         message: 'Success',
  //         description: response.data.message,
  //       })
  //       setEditopen(false)
  //       dispatch(fetchGTCData({ skip, limit }))
  //     } else {
  //       notification.error({
  //         message: 'Error',
  //         description: response.data.message,
  //       })
  //     }
  //   } catch (error) {
  //     handelError(error)
  //   }
  // }
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
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
    // {
    //   title: 'Active',
    //   dataIndex: 'isActive',
    //   key: 'isActive',
    //   width: 150,
    //   render: (_, record) => (
    //     <Space size="middle">
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
      title: 'Actions',
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
      <Helmet title="Global Type Table" />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-lg-9">
                  <HeadersCardHeader data={{ title: 'Global Type Category' }} />
                </div>
                <div className="col-lg-3">
                  <Button type="primary" onClick={showModal}>
                    Add New Category
                  </Button>
                  {open && (
                    <AddFormModal
                      handleOk={handleOk}
                      open={open}
                      setOpen={setOpen}
                      handleCancel={handleCancel}
                      loading={loading}
                    />
                  )}
                  {editopen && (
                    <EditFormModal
                      handleOk={handleOk}
                      open={editopen}
                      setEditopen={setEditopen}
                      handleCancel={handleClose}
                      loading={loading}
                      data={editform}
                      id={editform.id}
                    />
                  )}
                  {deleteopen && (
                    <DeleteFormModal
                      handleOk={handleOk}
                      open={deleteopen}
                      setDeletopen={setDeletopen}
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
                  dataSource={categoryData?.globalTypeCategory}
                  rowKey="userPersonalEmail"
                  columns={columns}
                  pagination={{
                    defaultPageSize: oldPageSize,
                    current: parseInt(currentPage, 10),
                    total: categoryData?.totalCount,
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
const mapStateToProps = ({ fetchGlobalTypeCategoryData, dispatch }) => ({
  categoryData: fetchGlobalTypeCategoryData?.data.data,
  dispatch,
})
export default connect(mapStateToProps)(GlobalTypeTable)
