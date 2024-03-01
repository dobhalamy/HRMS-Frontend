import React from 'react'
import { Modal, notification } from 'antd'
import { deleteHappyToHelp } from 'services/axios/happyToHelp'
import { getHappyToHelpList, getAllHappyToHelpList } from 'redux/happyToHelp/action'
import { useDispatch } from 'react-redux'
import { getLoggedInUserInfo } from 'utils'

const DeleteH2H = ({ showDeleteModal, setShowDeleteModal, h2hData }) => {
  const dispatch = useDispatch()
  const userRole = getLoggedInUserInfo()?.userRole

  const handleOk = async () => {
    const deletedHappyToHelp = await deleteHappyToHelp(h2hData?.id)
    if (deletedHappyToHelp?.status === 200) {
      notification.success({
        message: 'Happy To Help Deleted',
      })
      setShowDeleteModal(false)
      if (userRole === 'hr') {
        dispatch(getAllHappyToHelpList({ skip: 0, limit: 10 }))
      } else {
        dispatch(getHappyToHelpList({ skip: 0, limit: 10 }))
      }
    }
  }
  return (
    <>
      <Modal
        title="Delete Happy To Help"
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
export default DeleteH2H
