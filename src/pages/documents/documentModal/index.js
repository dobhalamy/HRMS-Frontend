import React from 'react'
import { Modal } from 'antd'

const DocumentModal = ({ documentUrl, visible, onClose }) => {
  return (
    <Modal
      title="Document Preview"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      height={1000}
    >
      <iframe title="Document Preview" src={documentUrl} width="100%" height="500" />
    </Modal>
  )
}

export default DocumentModal
