import { Button, Form, Modal, Row, Col } from 'antd'
import { formatDate, getLoggedInUserInfo } from 'utils'

import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
// import { useSelector } from 'react-redux'
import { userRoleEnums } from 'enums/userRole'
import styles from './style.module.scss'

function EventTypeModal({
  showEventTypeForm,
  setShowEventTypeForm,
  setShowEventForm,
  handleOk,
  React,
  date,
  setOpen,
  setShowWFHForm,
}) {
  const showAddLeaveModal = () => {
    setShowEventTypeForm(false)
    setOpen(true)
  }
  const showAddEventModal = () => {
    setShowEventTypeForm(false)
    setShowEventForm(true)
  }
  const showAddWFH = () => {
    setShowEventTypeForm(false)
    setShowWFHForm(true)
  }
  // const userRole = useSelector((state) => state?.user?.userInfo?.userRole)
  const { userRole } = getLoggedInUserInfo()
  const LeaveDate = {
    leaveDate: [
      formatDate(date?.startDate),
      formatDate(date?.endDate.setDate(date?.endDate.getDate() - 1)),
    ],
  }

  return (
    <Modal
      visible={showEventTypeForm}
      onOk={handleOk}
      onCancel={() => setShowEventTypeForm(() => false)}
      width="12vw"
      style={{ textAlign: 'center', borderRadius: '0' }}
      closable={false}
      className={styles.eventTypeForm}
      mask={false}
      footer={false}
      bodyStyle={{ padding: '21px 0px 0px 0px' }}
      centered
    >
      <Form id="applyLeaveForm" name="basic" autoComplete="off" initialValues={LeaveDate}>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              name="leaveDate"
              rules={[
                {
                  required: true,
                  message: 'Please select leave date!',
                },
              ]}
            >
              <Button
                style={{ width: '10vw' }}
                className={styles.eventButton}
                icon={<PlusOutlined />}
                onClick={showAddLeaveModal}
              >
                Apply Leave
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              name="leaveDate"
              rules={[
                {
                  required: true,
                  message: 'Please select leave date!',
                },
              ]}
            >
              <Button
                style={{ width: '10vw' }}
                className={styles.eventButton}
                icon={<PlusOutlined />}
                onClick={showAddWFH}
              >
                Apply WFH
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {(userRole === userRoleEnums?.HR || userRole === userRoleEnums?.SUPER_ADMIN) && (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 100%">
              <Form.Item>
                <Button
                  style={{ width: '10vw' }}
                  icon={<PlusCircleOutlined />}
                  className={styles.eventButton}
                  onClick={showAddEventModal}
                >
                  Add Events
                </Button>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  )
}
export default EventTypeModal
