import React from 'react'
import { Button, Form, Input, Modal, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGTCData } from 'redux/globaltypecategory/actions'
import { updateGlobalTypeCategory } from 'services/axios/config'

function EditFormModal({ open, setEditopen, handleOk, handleCancel, loading, data, id }) {
  const [editGlobalTypeCategoryForm] = Form.useForm()

  const dispatch = useDispatch()
  const { skip, limit } = useSelector((state) => state.fetchGlobalTypeCategoryData.pagination)
  const onFinish = async (values) => {
    const response = await updateGlobalTypeCategory(values, id)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setEditopen(false)
      dispatch(fetchGTCData({ skip, limit }))
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const handleGlobalTypeCategoryUniqueValue = (event) => {
    const uniqueValue = event?.target?.value.replace(/ /g, '_').toLowerCase()
    editGlobalTypeCategoryForm.setFieldsValue({
      uniqueValue,
    })
  }
  return (
    <Modal
      title="Edit Category"
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
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={editGlobalTypeCategoryForm}
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
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input Display Name!',
            },
          ]}
          initialValue={data.displayName}
          onBlur={handleGlobalTypeCategoryUniqueValue}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditFormModal
