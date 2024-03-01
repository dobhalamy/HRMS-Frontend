import React from 'react'
import { Modal, Row, Col, Button, notification } from 'antd'
import { getTraineeList } from 'redux/allEmployee/action'
import { useDispatch, useSelector } from 'react-redux'
import { updateTraineeStatus } from 'services/axios/emp'

export default function HandoverTraineeForm({
  showHandoverTraineeModal,
  setShowHandoverTraineeModal,
  data,
  searchEmployee,
}) {
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const dispatch = useDispatch()

  const onFinish = async () => {
    const values = []
    values.id = data?.Trainee?.id
    values.status = 2
    const response = await updateTraineeStatus({ ...data, ...values })
    if (response?.data?.status && response?.status === 200) {
      notification.success({
        message: 'Success',
        description:
          'Trainee Handover to Manager successfully, this trainee is now visible on Manager side.',
      })
      setShowHandoverTraineeModal(() => false)
      dispatch(getTraineeList({ skip, limit, employeeName: searchEmployee || null }))
    }
  }
  return (
    <Modal
      title="Handover Trainee to OPS"
      centered
      visible={showHandoverTraineeModal}
      width={400}
      onCancel={() => setShowHandoverTraineeModal(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowHandoverTraineeModal(() => false)}>
          No
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={onFinish}
          form="updateTrainee"
        >
          Yes
        </Button>,
      ]}
    >
      <Row className="row" style={{ gap: '1rem', marginBottom: '1rem' }}>
        <Col flex="1 0 25%">
          <center>Are you sure you want to hand over this trainee to Manager?</center>
        </Col>
      </Row>
    </Modal>
  )
}
