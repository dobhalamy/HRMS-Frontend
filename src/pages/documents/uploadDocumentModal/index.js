import React, { useEffect, useCallback, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Modal, Row, Select, Upload, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployeeList } from 'redux/allEmployee/action'
import { handleMediaType } from 'redux/media/action'
import { uploadDocument } from 'services/axios/media'
import { monthNames } from 'utils'

const UploadDocumentModal = ({ showDocumentUpload, setShowDocumentUpload }) => {
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  const [documentType, setDocumentType] = useState(null)
  const [form] = Form.useForm()
  const mediaType = useSelector((state) => state?.getDocument?.mediaType)

  const dispatch = useDispatch()
  const employee = useSelector((state) => state?.toggle?.empList?.employee)
  const uploadInitialValues = {
    empId: 'Select employee',
    mediaType: 'Select Document',
    monthName: 'Select month',
  }
  const getMediaType = useCallback(async () => {
    dispatch(handleMediaType())
  }, [dispatch])

  useEffect(() => {
    if (showDocumentUpload) {
      dispatch(getEmployeeList({ skip: 0, limit: 100 }))
      getMediaType()
    }
  }, [dispatch, getMediaType, showDocumentUpload])

  const handleUploadFinish = async (values) => {
    if (!fileList[0]) {
      notification.error({
        message: 'Error',
        description: 'Please select a file to upload',
      })
    } else {
      setUploading(true)
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key])
      })
      formData.append('media', fileList[0])
      const result = await uploadDocument(formData)
      if (result?.status === 200 && result?.data?.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: 'Media uploaded successfully uploaded',
        })
      }
      setUploading(false)
      setShowDocumentUpload((pre) => !pre)
    }
  }

  const handleUploadFinishFailed = (error) => {
    notification.error({ message: 'Error', description: error?.errorFields[0]?.errors[0] })
  }

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    listType: 'picture-card',
    accept: 'application/pdf',
    fileList,
  }

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  )

  return (
    <>
      <Modal
        visible={showDocumentUpload}
        centered
        title="Upload Document"
        width={700}
        onCancel={() => setShowDocumentUpload(() => false)}
        footer={[
          <Button key="back" onClick={() => setShowDocumentUpload(() => false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="uploadDocument"
            loading={uploading}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          name="uploadDocument"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          layout="vertical"
          form={form}
          initialValues={uploadInitialValues}
          onFinish={handleUploadFinish}
          onFinishFailed={handleUploadFinishFailed}
          autoComplete="off"
        >
          <Row className="row" style={{ gap: '2rem' }}>
            <Col>
              <Form.Item
                label="Document type"
                name="mediaType"
                rules={[
                  {
                    message: 'Please select document type',
                    validator: (_, value) => {
                      if (value !== uploadInitialValues?.mediaType) {
                        return Promise.resolve()
                      }
                      return Promise.reject()
                    },
                  },
                ]}
              >
                <Select
                  defaultActiveFirstOption
                  style={{
                    width: 200,
                  }}
                  onChange={(value) => {
                    setDocumentType(value)
                  }}
                >
                  {mediaType?.map((type) => (
                    <Select.Option key={type.uniqueValue} value={type.uniqueValue}>
                      {type.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* {(documentType?.includes('salary') || documentType?.includes('offer')) && ( */}
            <>
              <Col>
                <Form.Item
                  label="Employee name"
                  name="empId"
                  rules={[
                    {
                      message: 'Please select employee name',
                      validator: (_, value) => {
                        if (value !== uploadInitialValues?.empId) {
                          return Promise.resolve()
                        }
                        return Promise.reject()
                      },
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: 200,
                    }}
                  >
                    {employee?.map((emp) => (
                      <Select.Option key={emp.empId} value={emp.empId}>
                        {emp.userName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {documentType?.includes('salary') && (
                <Col>
                  <Form.Item
                    label="Month"
                    name="monthName"
                    rules={[
                      {
                        message: 'Please select month name',
                        validator: (_, value) => {
                          if (value !== uploadInitialValues?.monthName) {
                            return Promise.resolve()
                          }
                          return Promise.reject()
                        },
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: 200,
                      }}
                    >
                      {monthNames?.map((month, index) => (
                        <Select.Option key={`month${index}`} value={month}>
                          {month}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </>
            {/* )} */}
          </Row>

          <Row className="row" style={{ gap: '2rem' }}>
            <Upload {...uploadProps}>{fileList?.length < 1 ? uploadButton : null}</Upload>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default UploadDocumentModal
