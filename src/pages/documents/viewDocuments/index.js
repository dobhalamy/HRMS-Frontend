import React, { useCallback, useEffect, useState } from 'react'
// import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { Card, Select, Table, Button, Upload, message, notification } from 'antd'
import { useDispatch, useSelector, connect } from 'react-redux'
import { updateDocument } from 'services/axios/media'
import { EyeFilled, EditFilled } from '@ant-design/icons'
import moment from 'moment'
import { getEmployeeList } from 'redux/employeeDsr/action'
import {
  handelDocument,
  handlePagination,
  // handleDocumentData,
  handleOpen,
  handleMediaType,
} from 'redux/media/action'
import {
  defaultPagination,
  // downloadPdf,
  onPageChange,
  onPageSizeChange,
  resetPagination,
} from 'utils'
import { setTourSteps } from 'redux/tour/actions'
import DocumentModal from '../documentModal'
import DeleteDocument from '../deleteDocument'
import ConfirmReuploadModal from '../confirmReuploadModal'

const ViewDocuments = ({ showDocumentUpload, documentNewData }) => {
  const [media, setMedia] = useState()
  const [searchEmployee, setSearchEmployee] = useState()
  const [modalVisible, setModalVisible] = useState(false) // State to control modal visibility
  const [documentUrl, setDocumentUrl] = useState('')
  const { employee } = useSelector((state) => state?.dsrState?.empList)

  const year = new Date().getFullYear()
  const documentData = useSelector((state) => state.getDocument.documentData)
  const showModal = useSelector((state) => state.getDocument.isOpen)
  const pagination = useSelector((state) => state.getDocument.pagination)
  const totalCount = useSelector((state) => state.getDocument.totalCount)
  const mediaType = useSelector((state) => state.getDocument.mediaType)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const [reUploadFile, setReUploadFile] = useState(null)
  const [previousFileData, setPreviousFileData] = useState(null)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const dispatch = useDispatch()
  const getMediaType = useCallback(async () => {
    dispatch(handleMediaType())
  }, [dispatch])

  const fetchData = useCallback(async () => {
    const { skip, limit } = pagination
    dispatch(handelDocument(media, searchEmployee, year, skip, limit))
  }, [dispatch, year, pagination, media, searchEmployee])

  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getEmployeeList({ skip: 0, limit: 0 }))
    getMediaType()
    if (showDocumentUpload === false) {
      fetchData()
    }
  }, [fetchData, showDocumentUpload, getMediaType, media, dispatch])

  useEffect(() => {
    const reUploadHandle = async (data) => {
      if (!confirmSubmit && reUploadFile) {
        setConfirmModalVisible(true)
      }
      if (confirmSubmit) {
        const formData = new FormData()
        formData.append('empId', data?.empId)
        formData.append('id', data?.key)
        formData.append('mediaType', data?.documentName)
        formData.append('file', reUploadFile)
        // eslint-disable-next-line no-await-in-loop
        const updatedDoc = await updateDocument(formData)
        if (updatedDoc?.status === 200 && updatedDoc?.data?.status) {
          notification.success({
            message: 'Success',
            description: updatedDoc?.data?.message,
          })
        }
        setConfirmModalVisible(false)
        setReUploadFile(null)
      }
      setConfirmSubmit(false)
    }
    if (reUploadFile) {
      reUploadHandle(previousFileData)
    }
    fetchData()
  }, [reUploadFile, previousFileData, confirmSubmit, fetchData])

  const viewHandle = (url) => {
    const baseURL =
      process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_DEV_BASE_URL
        : process.env.REACT_APP_PROD_BASE_URL

    const docPathUrl = baseURL.replace('/api/v1', '')
    if (process.env.NODE_ENV === 'development') {
      setDocumentUrl(`${docPathUrl}${url}`)
    } else {
      setDocumentUrl(`${docPathUrl}/${url}`)
    }
    setModalVisible(true)
  }

  const handleOkConfirm = () => {
    setConfirmSubmit(true)
    setConfirmModalVisible(false)
    fetchData()
  }
  const handleCancelConfirm = () => {
    setConfirmSubmit(false)
    setConfirmModalVisible(false)
    setReUploadFile(null)
    setPreviousFileData(null)
  }
  const fileProps = {
    accept: ['.pdf', '.jpg', '.jpeg', '.png'],
    name: 'file',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    beforeUpload: (file) => {
      const isSizeValid = file.size / 1024 / 1024 < 1 // Check if file size is less than 1 MB
      if (!isSizeValid) {
        message.error('File size must be less than 1 MB.')
      }
      if (isSizeValid) {
        setReUploadFile(file)
      }

      return false // Prevent automatic upload
    },
  }

  const reUploadClick = (data) => {
    setPreviousFileData(data)
  }
  const columns = [
    {
      title: 'DOCUMENT NAME',
      key: 'documentName',
      dataIndex: 'documentName',
    },
    {
      title: 'EMPLOYEE NAME',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (_, record) => `${record?.empId} ( ${record?.employeeName} )`,
    },
    {
      title: 'UPLOAD DATE',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a, b) => new Date(a.uploadDate) - new Date(b.uploadDate),
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div style={{ cursor: 'pointer', display: 'flex', gap: '1rem' }}>
          {/* <DownloadOutlined title="Download" onClick={() => downloadPdf(record?.mediaLink)} />
          <DeleteOutlined title="Delete" onClick={() => handleDeleteClick(record)} /> */}
          <Upload {...fileProps} showUploadList={false} multiple={false}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="primary" onClick={() => reUploadClick(record)} id="reUpload">
                <EditFilled />
              </Button>
            </div>
          </Upload>
          <Button type="primary" onClick={() => viewHandle(record?.mediaLink)} id="view">
            <EyeFilled />
          </Button>
        </div>
      ),
    },
  ]

  const handleClose = () => {
    dispatch(handleOpen(false))
  }
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
  const data = documentNewData.map((item) => ({
    key: item?.id,
    documentName: item?.mediaType,
    employeeName: item?.employee?.userName,
    empId: item?.empId,
    uploadDate: moment(item.createdAt).format('DD-MM-YYYY'),
    mediaLink: item?.mediaLink,
  }))
  const handleDeleteSuccess = useCallback(() => {
    fetchData()
  }, [fetchData])

  const handleChange = (value) => {
    dispatch(handlePagination(resetPagination))
    handlePageChange(1)
    setMedia(value)
  }
  const handleEmployeeChange = (value) => {
    dispatch(handlePagination(resetPagination))
    handlePageChange(1)
    setSearchEmployee(value)
  }

  const getSteps = [
    {
      selector: '#filterDoc',
      content: 'Get the filter documents i.e according to document type',
    },
    {
      selector: '#reUpload',
      content: 'Re-Upload document',
    },
    {
      selector: '#view',
      content: 'View documents',
    },
  ]

  const steps = getSteps

  useEffect(() => {
    dispatch(setTourSteps(steps))
  }, [steps, dispatch])

  return (
    <>
      <Card
        extra={
          <>
            <Select
              loading={isLoading}
              allowClear
              placeholder="Filter By Document Name"
              style={{
                width: 170,
                marginRight: 20,
              }}
              onChange={handleChange}
              id="filterDoc"
            >
              {mediaType?.map((type) => (
                <Select.Option key={type.uniqueValue} value={type.displayName}>
                  {type.displayName}
                </Select.Option>
              ))}
            </Select>
            <Select
              loading={isLoading}
              allowClear
              placeholder="Filter By Employee Name"
              style={{
                width: 170,
                marginRight: 20,
              }}
              onChange={handleEmployeeChange}
            >
              {employee?.map((item) => (
                <Select.Option key={item.userId} value={item.userName}>
                  {item.userName}
                </Select.Option>
              ))}
            </Select>
          </>
        }
      >
        <Table
          loading={isLoading}
          dataSource={data}
          columns={columns}
          pagination={{
            defaultPageSize: oldPageSize,
            current: parseInt(currentPage, 10),
            responsive: true,
            total: totalCount,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
            showSizeChanger: true,
            locale: { items_per_page: '' },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ y: 450 }}
        />
        <DeleteDocument
          showModal={showModal}
          empData={documentData}
          handleClose={handleClose}
          handleDeleteSuccess={handleDeleteSuccess}
        />
        <DocumentModal
          documentUrl={documentUrl}
          visible={modalVisible}
          onClose={() => setModalVisible(false)} // Close the modal
        />
        {confirmModalVisible && (
          <ConfirmReuploadModal
            fileName={reUploadFile}
            visible={confirmModalVisible}
            onOk={handleOkConfirm}
            onCancel={handleCancelConfirm}
          />
        )}
      </Card>
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    documentNewData: state.getDocument.document,
  }
}
export default connect(mapStateToProps)(ViewDocuments)
