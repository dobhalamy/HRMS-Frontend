import React from 'react'
import { Modal, notification } from 'antd'
import { deleteException } from 'services/axios/exception'
import { getLoggedInUserInfo } from 'utils'
import { getListOfException, getExceptionListSingleEmp } from 'redux/exception/action'
import { useDispatch } from 'react-redux'

const DeleteException = ({ showDeleteModal, setShowDeleteModal, data }) => {
  const dispatch = useDispatch()
  const userRole = getLoggedInUserInfo()?.userRole
  const handleOk = async () => {
    const deletedException = await deleteException(data?.id)
    if (deletedException?.status === 200) {
      notification.success({
        message: 'Exception Deleted',
      })
      setShowDeleteModal(false)
      if (userRole === 'hr' || userRole === 'super_admin') {
        dispatch(getListOfException({ skip: 0, limit: 10 }))
      } else {
        dispatch(getExceptionListSingleEmp({ skip: 0, limit: 10 }))
      }
    }
  }
  return (
    <>
      <Modal
        title="Delete Exception"
        visible={showDeleteModal}
        onOk={handleOk}
        onCancel={() => setShowDeleteModal(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete better to add one ?</p>
      </Modal>
    </>
  )
}
export default DeleteException
