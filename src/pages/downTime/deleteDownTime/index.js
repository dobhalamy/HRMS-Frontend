import React from 'react'
import { Modal, notification } from 'antd'
import { deleteDownTime } from 'services/axios/downTime'
import { getDownTimeList } from 'redux/downTime/action'
import { useSelector, useDispatch } from 'react-redux'
import { getLoggedInUserInfo } from 'utils'

const DeleteDownTime = ({ showDeleteModal, setShowDeleteModal, downTimeData }) => {
  const dispatch = useDispatch()
  const statusFilter = useSelector((state) => state?.downTimeState?.status)
  const userRole = getLoggedInUserInfo()?.userRole

  const handleOk = async () => {
    const deletedDownTime = await deleteDownTime(downTimeData?.id)
    if (deletedDownTime?.status === 200) {
      notification.success({
        message: 'Down Time Deleted',
      })
      setShowDeleteModal(false)
      if (userRole === 'po') {
        dispatch(getDownTimeList({ status: statusFilter, skip: 0, limit: 10 }))
      } else {
        dispatch(getDownTimeList({ status: 0, skip: 0, limit: 10 }))
      }
    }
  }
  return (
    <>
      <Modal
        title="Delete down time"
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
export default DeleteDownTime
