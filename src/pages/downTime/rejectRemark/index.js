import React from 'react'
import { Modal, Button, Form, Input, notification } from 'antd'
import { updateDownTime } from 'services/axios/downTime'
import { useDispatch, useSelector } from 'react-redux'
import { getDownTimeList } from 'redux/downTime/action'

const RejectRemark = ({
  showRejectRemarkModal,
  setShowRejectRemarkModal,
  downTimeData,
  setShowViewModal,
}) => {
  const [form] = Form.useForm()
  const { TextArea } = Input
  const dispatch = useDispatch()
  const statusFilter = useSelector((state) => state?.downTimeState?.status)
  const handleCancel = () => {
    setShowRejectRemarkModal(false)
  }
  const onFinish = async (values) => {
    const rejectedData = { ...downTimeData, status: 2, remark: values?.rejectReason }
    const id = rejectedData?.id
    const updatedDownTime = await updateDownTime(rejectedData, id)
    if (updatedDownTime?.status === 200) {
      notification.success({
        message: 'Down Time Rejected',
      })
      setShowViewModal(false)
      dispatch(getDownTimeList({ status: statusFilter, skip: 0, limit: 10 }))
    }
    setShowRejectRemarkModal(false)
  }
  return (
    <>
      <Modal
        title="Reject Down Time"
        visible={showRejectRemarkModal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={() => setShowRejectRemarkModal(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="rejectForm">
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          id="rejectForm"
          name="basic"
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 18,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Please specify a reason:"
            name="rejectReason"
            rules={[
              {
                required: true,
                message: 'Please enter reject reason!',
              },
            ]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default RejectRemark
