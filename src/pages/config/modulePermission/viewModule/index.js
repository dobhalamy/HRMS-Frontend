import React from 'react'
import { Modal, Typography } from 'antd'

const { Text } = Typography

const ViewModule = ({ moduleData, setShowViewModal, showViewModal }) => {
  const onCancelModalHandler = () => {
    setShowViewModal(false)
  }

  return (
    <>
      <Modal
        title="View Module Permission"
        centered
        width={800}
        footer={false}
        visible={showViewModal}
        onCancel={onCancelModalHandler}
      >
        <p>
          <Text strong>Module Name : </Text>
          {moduleData?.moduleDisplayName}
        </p>
        <p>
          <Text strong>Permissions : </Text>
          {moduleData?.permissionDisplayName.join(', ')}
        </p>
      </Modal>
    </>
  )
}

export default ViewModule
