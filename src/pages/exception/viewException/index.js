import React from 'react'
import { Modal, Typography, Row, Col } from 'antd'
import { utcToDate, utcToIst } from 'utils'

const { Text } = Typography

const ViewException = ({ data, showViewModal, setShowViewModal }) => {
  const onCancelModalHandler = () => {
    setShowViewModal(false)
  }

  return (
    <Modal
      title="View Exception"
      centered
      width={800}
      footer={false}
      visible={showViewModal}
      onCancel={onCancelModalHandler}
    >
      <Row className="row" style={{ gap: '1rem', marginBottom: '1rem', marginLeft: '1rem' }}>
        <Col flex="1 0 37%">
          <Text strong>Employee Name : </Text>
          {data?.employeeName?.userName}
        </Col>
        <Col flex="1 0 37%">
          <Text strong>Raised Request : </Text>
          {data?.raisedRequest?.displayName}
        </Col>
      </Row>
      <Row className="row" style={{ gap: '1rem', marginBottom: '1rem', marginLeft: '1rem' }}>
        <Col flex="1 0 37%">
          <Text strong>Date From : </Text>
          {utcToDate(data?.dateFrom)}
        </Col>
        <Col flex="1 0 37%">
          <Text strong>Date To : </Text>
          {utcToDate(data?.dateTo)}
        </Col>
      </Row>
      <Row className="row" style={{ gap: '1rem', marginLeft: '1rem' }}>
        {data?.shiftIn && (
          <>
            <Col flex="1 0 37%" style={{ marginBottom: '1rem' }}>
              <Text strong>Shift In : </Text>
              {utcToIst(data?.shiftIn)}
            </Col>
            <Col flex="1 0 37%" style={{ marginBottom: '1rem' }}>
              <Text strong>Shift Out : </Text>
              {utcToIst(data?.shiftOut)}
            </Col>
          </>
        )}
      </Row>
      <Row className="row" style={{ gap: '1rem', marginLeft: '1rem' }}>
        {data?.accessIn && (
          <>
            <Col flex="1 0 37%" style={{ marginBottom: '1rem' }}>
              <Text strong>Access In : </Text>
              {utcToIst(data?.accessIn)}
            </Col>
            <Col flex="1 0 37%" style={{ marginBottom: '1rem' }}>
              <Text strong>Access Out : </Text>
              {utcToIst(data?.accessOut)}
            </Col>
          </>
        )}
      </Row>
      <Row className="row" style={{ gap: '1rem', marginLeft: '1rem' }}>
        {data?.raisedRequest?.displayName === 'Biometric Issue' && (
          <>
            <Col flex="1 0 37%" style={{ marginBottom: '1rem' }}>
              <Text strong>Current Attendance : </Text>
              {data?.currentAttendance}
            </Col>
            <Col flex="1 0 37%" style={{ marginBottom: '1rem' }}>
              <Text strong>Updated Attendance : </Text>
              {data?.updateAttendance}
            </Col>
          </>
        )}
      </Row>
      <Row className="row" style={{ gap: '1rem', marginBottom: '1rem', marginLeft: '1rem' }}>
        <Col flex="1 0 37%">
          <Text strong>Comment : </Text>
          {data?.comment}
        </Col>
        {data?.exceptionRemark && (
          <Col flex="1 0 37%">
            <Text strong>Rejected Remark : </Text>
            {data?.exceptionRemark}
          </Col>
        )}
      </Row>
    </Modal>
  )
}
export default ViewException
