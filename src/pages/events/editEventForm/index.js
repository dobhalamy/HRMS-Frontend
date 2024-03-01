import React from 'react'
import { Button, Form, Modal, notification, DatePicker, Row, Col, Input } from 'antd'
import { formatDate } from 'utils'
import { useDispatch } from 'react-redux'
import TextArea from 'antd/lib/input/TextArea'
import { fetchEventsData } from 'redux/events/action'
import { updateEvent } from 'services/axios/events'

const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'
function EditEventFormModal({ showEditEventForm, setShowEditEventForm, handleOk, loading, data }) {
  const dispatch = useDispatch()
  const onFinish = async (values) => {
    const res = await updateEvent(values, data.id)

    if (res?.data?.status && res?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: res.data.message,
      })
      setShowEditEventForm(false)
      dispatch(fetchEventsData())
    }
  }
  const endDate = new Date(data.end)
  const LeaveDate = {
    eventDate: [formatDate(data.start), formatDate(endDate.setDate(endDate.getDate() - 1))],
  }
  return (
    <Modal
      title="Edit Event"
      visible={showEditEventForm}
      onOk={handleOk}
      onCancel={() => setShowEditEventForm(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowEditEventForm(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="editLeaveForm"
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
      width={400}
    >
      <Form
        id="editLeaveForm"
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={LeaveDate}
      >
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              name="eventDate"
              rules={[
                {
                  required: true,
                  message: 'Please select leave date!',
                },
              ]}
            >
              <RangePicker name="eventDate" format={dateFormat} minDate={new Date()} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              initialValue={data?.title}
              name="eventName"
              rules={[
                {
                  required: true,
                  message: 'Please select Employee',
                },
              ]}
            >
              <Input placeholder="Event Title" />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item name="eventDesc" initialValue={data?.eventDesc} label="Description">
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default EditEventFormModal
