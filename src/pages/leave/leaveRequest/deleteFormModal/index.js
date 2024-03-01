import React from 'react'
import { Button, Form, Modal, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmpLeaveRequestData } from 'redux/empLeave/action'
import { deleteLeaveRequest } from 'services/axios/empLeave'

function DeleteFormModal({ open, setDeleteOpen, handleCancel, loading, id }) {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)

  const onFinish = async (values) => {
    try {
      const response = await deleteLeaveRequest(values, id)
      if (response?.data?.status && response?.data?.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: response?.data?.message,
        })
        setDeleteOpen(false)
        dispatch(
          fetchEmpLeaveRequestData({
            leaveStatus: 0,
            skip,
            limit,
            employeeValue: null,
          }),
        )
      } else {
        notification.error({
          message: 'Error',
          description: response?.data?.message,
        })
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.response?.data?.error,
      })
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      title="Delete Leave"
      visible={open}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="myForm"
          // onClick={handleOk}
          disabled={isLoading}
        >
          Delete
        </Button>,
      ]}
    >
      <Form
        id="myForm"
        name="basic"
        labelCol={{
          span: 3,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      />
      <p>Are you sure wants to delete this leave request!</p>
    </Modal>
  )
}
export default DeleteFormModal
