/* eslint-disable react/jsx-indent */
import React from 'react'
import { Modal, Typography, Tag } from 'antd'
import { getStatusLabel, utcToIst } from 'utils'
import moment from 'moment'

const ViewModal = ({ showViewModal, setShowViewModal, downTimeData }) => {
  const { Text } = Typography
  const { color, displayStatus } = getStatusLabel(downTimeData?.status)

  return (
    <>
      <Modal
        title="View down time"
        visible={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
      >
        <p>
          <Text strong>Name : </Text>
          {downTimeData?.userName}
        </p>
        <p>
          <Text strong>Department : </Text>
          {downTimeData?.departmentName}
        </p>
        <p>
          <Text strong>Date : </Text>
          {moment(downTimeData?.startTime).format('DD/MM/YYYY')}
        </p>
        <p>
          <Text strong>Start time : </Text>
          {utcToIst(downTimeData?.startTime)}
        </p>
        <p>
          <Text strong>End time : </Text>
          {utcToIst(downTimeData?.endTime)}
        </p>
        <p>
          <Text strong>Subject : </Text>
          {downTimeData?.subject}
        </p>
        <p>
          <Text strong>Description : </Text>
          {downTimeData?.description}
        </p>
        <p>
          <Text strong>Status: </Text>
          <Tag color={color}>{displayStatus}</Tag>
        </p>
        {downTimeData?.status === 2 && (
          <p>
            <Text strong>Remark: </Text>
            {downTimeData?.remark}
          </p>
        )}
      </Modal>
    </>
  )
}
export default ViewModal
