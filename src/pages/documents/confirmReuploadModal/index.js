import React from 'react'
import { Modal } from 'antd'

const ConfirmReuploadModal = ({ fileName, visible, onOk, onCancel }) => {
  return (
    <Modal title="Confirmation" visible={visible} onOk={onOk} onCancel={onCancel}>
      {fileName && (
        <p>{`Are you sure you want to update previous document with ${fileName?.name}`}</p>
      )}
    </Modal>
  )
}

export default ConfirmReuploadModal
