import { Modal, notification } from 'antd'
import React, { useCallback } from 'react'
import { deleteDocument } from 'services/axios/media'

const DeleteDocument = ({ showModal, handleClose, empData, handleDeleteSuccess }) => {
  const id = empData?.key
  const handleDelete = useCallback(async () => {
    const res = await deleteDocument(id)
    if (res && res.status === 200) {
      notification.success({
        message: 'Success',
        description: 'Document deleted successfully',
      })
      handleClose(true)
      handleDeleteSuccess()
    }
  }, [handleClose, id, handleDeleteSuccess])

  return (
    <Modal
      title="Delete"
      visible={showModal}
      onOk={handleDelete}
      onCancel={handleClose}
      okText="Delete"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete the doc?</p>
    </Modal>
  )
}

export default DeleteDocument
