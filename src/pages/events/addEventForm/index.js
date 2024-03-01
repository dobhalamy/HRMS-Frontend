import { Button, Form, Modal, notification, DatePicker, Row, Col, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { formatDate } from 'utils'
import TextArea from 'antd/lib/input/TextArea'

import { addNewEvent } from 'services/axios/events'
import { fetchEventsData } from 'redux/events/action'

const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'

function AddEventForm({ showEventForm, setShowEventForm, handleOk, loading, React, date }) {
  const dispatch = useDispatch()
  const onFinish = async (values) => {
    const res = await addNewEvent(values)

    if (res?.data?.status && res?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: res.data.message,
      })
      setShowEventForm(false)
      dispatch(fetchEventsData())
    }
  }

  const LeaveDate = {
    eventDate: [formatDate(date.startDate), formatDate(date.endDate)],
  }
  return (
    <Modal
      title="Add Event"
      visible={showEventForm}
      onOk={handleOk}
      onCancel={() => setShowEventForm(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowEventForm(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="applyLeaveForm"
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
      width={400}
    >
      <Form
        id="applyLeaveForm"
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
              <RangePicker disabled name="eventDate" format={dateFormat} minDate={new Date()} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              name="eventName"
              rules={[
                {
                  required: true,
                  message: 'Please enter event title!',
                },
              ]}
            >
              <Input placeholder="Event Title" />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item label="Description" name="eventDesc">
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default AddEventForm
