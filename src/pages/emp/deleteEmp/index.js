import { Modal, notification } from 'antd'
import React from 'react'
import { deleteEmployee } from 'services/axios/emp'

const DeleteEmp = ({ showModal, setShowModal, empData, handleDeleteSuccess }) => {
  const { userId, empId } = empData || {}
  const handleOk = async () => {
    const res = await deleteEmployee({ userId, empId })
    if (res && res.status === 200) {
      notification.success({
        message: 'Success',
        description: 'User deleted successfully',
      })
      setShowModal(false)
      handleDeleteSuccess()
    }
  }

  return (
    <Modal
      title="Delete"
      visible={showModal}
      onOk={handleOk}
      onCancel={() => setShowModal(false)}
      okText="Delete"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete better to add one ?</p>
    </Modal>
  )
}
export default DeleteEmp
