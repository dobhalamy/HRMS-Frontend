import React from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'

const FileUpload = ({ handleUploadFinish, isLoading, title }) => {
  const fileProps = {
    name: 'file',
    accept: '.xlsx, .xls, .csv',
    beforeUpload: (file) => {
      const isSizeValid = file.size / 1024 / 1024 < 1 // Check if file size is less than 1 MB
      if (!isSizeValid) {
        message.error('File size must be less than 1 MB.')
      }
      if (isSizeValid) {
        handleUploadFinish(file)
      }
      return false // Prevent automatic upload
    },
    disabled: isLoading,
  }
  return (
    <Upload {...fileProps} showUploadList={false}>
      <Button type="primary" icon={<UploadOutlined />} loading={isLoading} disabled={isLoading}>
        {title}
      </Button>
    </Upload>
  )
}

export default FileUpload
