import React from 'react'
import { Modal, Typography } from 'antd'
import { utcToDate } from 'utils'

const { Text } = Typography

const ViewH2h = ({ h2hData, showViewModal, setShowViewModal }) => {
  const onCancelModalHandler = () => {
    setShowViewModal(false)
  }

  return (
    <Modal
      title="View Happy To Help"
      centered
      width={800}
      footer={false}
      visible={showViewModal}
      onCancel={onCancelModalHandler}
    >
      <p>
        <Text strong>Belongs To : </Text>
        {h2hData?.belongsToName}
      </p>
      <p>
        <Text strong>Issue : </Text>
        {h2hData?.GlobalType?.displayName}
      </p>

      <p>
        <Text strong>Communication With : </Text>
        {h2hData?.communicationWith}
      </p>
      <p>
        <Text strong>Mobile No : </Text>
        {h2hData?.mobileNo}
      </p>
      <p>
        <Text strong>Concern Of : </Text>
        {utcToDate(h2hData?.concernOf)}
      </p>
      <p>
        <Text strong>Remark : </Text>
        {h2hData?.remark}
      </p>
    </Modal>
  )
}
export default ViewH2h
