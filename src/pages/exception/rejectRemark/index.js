import React from 'react'
import { Modal, Button, Form, Input, notification } from 'antd'
import { updateException } from 'services/axios/exception'
import { useDispatch, useSelector } from 'react-redux'
import { getListOfException } from 'redux/exception/action'
import { statusEnums } from 'enums/userRole'
// import { getLoggedInUserInfo } from 'utils'
// import { exceptionRejectSocket } from 'socket'

const RejectRemark = ({
  showRejectRemarkModal,
  setShowRejectRemarkModal,
  exceptionData,
  setShowViewModal,
}) => {
  const [form] = Form.useForm()
  const { TextArea } = Input
  const dispatch = useDispatch()
  const statusFilter = useSelector((state) => state?.exceptionState?.status)
  // const { userId } = getLoggedInUserInfo()
  const handleCancel = () => {
    setShowRejectRemarkModal(false)
  }
  const onFinish = async (values) => {
    const rejectedData = {
      ...exceptionData,
      exceptionStatus: statusEnums.REJECTED,
      exceptionRemark: values?.rejectReason,
    }
    const id = rejectedData?.id
    const updatedException = await updateException(rejectedData, id)
    if (updatedException?.status === 200) {
      // exceptionRejectSocket(updatedException?.data?.data, userId)
      notification.success({
        message: 'Exception Rejected',
      })
      setShowViewModal(false)
      dispatch(getListOfException({ status: statusFilter, skip: 0, limit: 10 }))
    }
    setShowRejectRemarkModal(false)
  }
  return (
    <>
      <Modal
        title="Reject Exception"
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
