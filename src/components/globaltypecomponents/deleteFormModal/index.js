import React from 'react'
import { Button, Form, Modal, notification } from 'antd'
import apiClient from 'services/axios'
import { useDispatch, useSelector } from 'react-redux'
import ApiEndPoints from 'utils'
import { fetchGTData } from 'redux/globalType/actions'

function DeleteFormModal({ open, setdeletopen, handleOk, handleCancel, loading, id }) {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const onFinish = async (values) => {
    try {
      const response = await apiClient.delete(ApiEndPoints.GLOBAL_TYPE + id, values)
      if (response?.data?.status === true) {
        notification.success({
          message: 'Success',
          description: response.data.message,
        })
        setdeletopen(false)
        dispatch(fetchGTData())
      } else {
        notification.error({
          message: 'Error',
          description: response.data.message,
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
      title="Delete Category"
      visible={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Return
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="myForm"
          onClick={handleOk}
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
    </Modal>
  )
}
export default DeleteFormModal
