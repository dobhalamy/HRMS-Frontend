import React from 'react'
import { Modal, Typography } from 'antd'

const { Text } = Typography
const ViewClient = ({ showViewModal, setShowViewModal, clientData }) => {
  const onCancelModalHandler = () => {
    setShowViewModal(false)
  }

  return (
    <Modal
      title="View Client Information"
      centered
      width={800}
      visible={showViewModal}
      footer={false}
      onCancel={onCancelModalHandler}
    >
      <p>
        <Text strong>Business Name: </Text>
        {clientData?.businessName}
      </p>
      <p>
        <Text strong>Business Address: </Text>
        {clientData?.businessAddress}
      </p>
      <p>
        <Text strong>Business Email: </Text>
        {clientData?.businessEmail}
      </p>
      <p>
        <Text strong>Business Phone no.: </Text>
        {clientData?.businessPhoneNumber}
      </p>
      <p>
        <Text strong>Contact Personal Name: </Text>
        {clientData?.contactPersonName}
      </p>
      <p>
        <Text strong>Contact Personal Email: </Text>
        {clientData?.contactPersonEmail}
      </p>
    </Modal>
  )
}

export default ViewClient
