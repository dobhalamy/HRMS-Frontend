import React from 'react'
import { Button, Form, Input, Modal, notification, Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGTCData } from 'redux/globaltypecategory/actions'
import { saveGlobalTypeCategory } from 'services/axios/config'
import { InfoCircleOutlined } from '@ant-design/icons'
import { formHintBoxMessage } from 'utils'

function AddFormModal({ open, setOpen, handleOk, handleCancel, loading }) {
  const [addGlobalTypeCategoryForm] = Form.useForm()
  const dispatch = useDispatch()
  const { skip, limit } = useSelector((state) => state.fetchGlobalTypeCategoryData.pagination)

  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const onFinish = async (values) => {
    const response = await saveGlobalTypeCategory(values)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setOpen(false)
      dispatch(fetchGTCData({ skip, limit }))
    }
  }
  const handleGlobalTypeCategoryUniqueValue = (event) => {
    const uniqueValue = event?.target?.value.replace(/ /g, '_').toLowerCase()
    addGlobalTypeCategoryForm.setFieldsValue({
      uniqueValue,
    })
  }
  return (
    <Modal
      title="Add New Category"
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
          Submit
        </Button>,
      ]}
    >
      <Form
        form={addGlobalTypeCategoryForm}
        id="myForm"
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 20,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter name!',
            },
          ]}
          onKeyUp={handleGlobalTypeCategoryUniqueValue}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={
            <div>
              Unique Value{' '}
              <Tooltip title={formHintBoxMessage.UNIQUE_VALUE}>
                <InfoCircleOutlined />
              </Tooltip>
            </div>
          }
          name="uniqueValue"
          rules={[
            {
              required: true,
              message: 'Please enter unique Value!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AddFormModal
