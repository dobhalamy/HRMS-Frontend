import React, { useState, useCallback, useEffect } from 'react'
import { Form, Select, Button, Space, Upload, message } from 'antd'
import { filterOption } from 'utils'
import { UploadOutlined, PlusOutlined, EyeFilled, EditFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { getDocumentType } from 'redux/allEmployee/action'

const EditDocForm = ({ handleSubmit, initialDocValues, setCurrentStep, numberOfDoc }) => {
  const docType = useSelector((state) => state?.toggle?.docType)
  const [uploadedFile, setUploadedFile] = useState(null)
  const dispatch = useDispatch()

  const getDocType = useCallback(async () => {
    dispatch(getDocumentType())
  }, [dispatch])

  const baseURL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_DEV_BASE_URL
      : process.env.REACT_APP_PROD_BASE_URL

  const onView = (url) => {
    // window.open(`http://${baseURL}/${url}`, '_blank', 'noopener noreferrer')
    const docPathUrl = baseURL.replace('/api/v1', '')
    if (process.env.NODE_ENV === 'development') {
      window.open(`${docPathUrl}${url}`, '_blank', 'noopener noreferrer')
    } else {
      window.open(`${docPathUrl}/${url}`, '_blank', 'noopener noreferrer')
    }
  }
  useEffect(() => {
    getDocType()
  }, [getDocType])
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
        setUploadedFile(file)
        message.success('File added')
      }

      return false // Prevent automatic upload
    },
  }

  const onFinish = (values) => {
    values.documents[0].document = uploadedFile
    handleSubmit(values)
  }

  return (
    <Form onFinish={onFinish} initialValues={initialDocValues}>
      <Form.List name="documents">
        {(fields, { add }) => (
          <>
            {fields?.length > 0 &&
              fields.map(({ key, name, ...restField }) => (
                <div>
                  <Space key={key} align="baseline">
                    <Form.Item
                      {...restField}
                      label="Document Type"
                      name={[name, 'mediaType']}
                      rules={[
                        {
                          required: true,
                          message: 'Enter document type',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select document type"
                        filterOption={filterOption}
                        showSearch
                        allowClear
                        size="middle"
                        style={{
                          width: 200,
                        }}
                      >
                        {docType?.map((doc) => (
                          <Select.Option key={doc?.id} value={doc?.displayName}>
                            {doc?.displayName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'document']}
                      rules={[
                        {
                          required: true,
                          message: 'Enter document type',
                        },
                      ]}
                    >
                      {initialDocValues?.documents[key]?.document ? (
                        <Space>
                          <EyeFilled
                            onClick={() => onView(initialDocValues?.documents[key]?.document)}
                          />
                          <Upload {...fileProps} showUploadList={false} multiple={false}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <EditFilled />
                            </div>
                          </Upload>
                        </Space>
                      ) : (
                        <Upload {...fileProps} multiple={false}>
                          <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                      )}
                    </Form.Item>
                  </Space>
                </div>
              ))}
            <Form.Item>
              {fields?.length < numberOfDoc && (
                <Button
                  type="dashed"
                  onClick={() => {
                    add()
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Document
                </Button>
              )}
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" style={{ marginRight: '0.5em' }} onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditDocForm
