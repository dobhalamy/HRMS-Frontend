import React from 'react'
import { Button, Form, Modal, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmpLeaveRequestData } from 'redux/empLeave/action'
import TextArea from 'antd/lib/input/TextArea'
import { updateLeaveStatus } from 'services/axios/empLeave'
import { statusEnums } from 'enums/userRole'
// import { leaveRejectedSocket } from '../../../../socket'

function RejectLeaveFormModal({ rejectOpen, setRejectOpen, loading, leaveData }) {
  const [editRejectLeaveeForm] = Form.useForm()
  const dispatch = useDispatch()
  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const team = useSelector((state) => state?.projectInfo?.team)
  const onFinish = async (values) => {
    const ids = Array.isArray(leaveData.data) && leaveData.data.map((item) => item.id)
    leaveData.data = Array.isArray(leaveData?.data) ? leaveData?.data[0] : leaveData?.data
    values.data = {
      // userId: leaveData?.data?.userId,
      empId: leaveData?.data?.empId,
      leaveFrom: leaveData?.data?.leaveFrom,
      leaveTo: leaveData?.data?.leaveTo,
      leaveReason: leaveData?.data?.leaveReason,
      requestedUserId: leaveData?.data?.userId,
      // userId: leaveData?.data?.userId,
      ids,
    }
    values.status = leaveData?.status
    const response = await updateLeaveStatus(values, leaveData?.data?.id, ids)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      // leaveRejectedSocket(response?.data?.data, response?.data?.userId, dispatch)
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setRejectOpen(false)
      dispatch(
        fetchEmpLeaveRequestData({
          // leaveStatus: statusEnums?.PENDING,
          skip,
          limit,
          employeeValue: null,
          team: JSON.stringify(team),
        }),
      )
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      title={leaveData?.status === statusEnums?.APPROVED ? 'Approve Leave' : 'Reject Leave'}
      visible={rejectOpen}
      onCancel={() => setRejectOpen(() => false)}
      footer={[
        <Button key="back" onClick={() => setRejectOpen(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="editForm"
          disabled={isLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={editRejectLeaveeForm}
        id="editForm"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 18,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
  )
}
export default RejectLeaveFormModal
