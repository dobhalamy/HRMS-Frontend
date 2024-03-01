import React from 'react'
import { Button, Form, Input, Modal, notification, Select, Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGTData } from 'redux/globalType/actions'
import { saveGlobalType } from 'services/axios/config'
import { InfoCircleOutlined } from '@ant-design/icons'
import { formHintBoxMessage } from 'utils'

function AddGlobalTypeFormModal({
  open,
  setOpen,
  categoryFilter,
  handleOk,
  handleCancel,
  loading,
  GTCData,
}) {
  const dispatch = useDispatch()
  const [addGlobalTypeForm] = Form.useForm()

  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const onFinish = async (values) => {
    const response = await saveGlobalType(values)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setOpen(false)
      dispatch(fetchGTData({ skip, limit, globalTypeCategory: categoryFilter || '' }))
    }
  }
  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Error',
      description: errorInfo,
    })
  }
  const handleGlobalTtypeUniqueValue = (event) => {
    const uniqueValue = event?.target?.value.replace(/ /g, '_').toLowerCase()
    addGlobalTypeForm.setFieldsValue({
      uniqueValue,
    })
  }
  return (
    <Modal
      title="Add New Global Type"
      visible={open}
      onOk={handleOk}
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
          onClick={handleOk}
          disabled={isLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={addGlobalTypeForm}
        id="myForm"
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
          label="Global Type Category"
          name="globalTypeCategory"
          rules={[
            {
              required: true,
              message: 'Please Select Category!',
            },
          ]}
        >
          <Select showSearch allowClear>
            {GTCData?.globalTypeCategory?.map(({ uniqueValue, displayName }, index) => (
              <Select.Option value={uniqueValue} key={`${uniqueValue}-${index}`}>
                {displayName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter Display Name!',
            },
          ]}
          onKeyUp={handleGlobalTtypeUniqueValue}
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
export default AddGlobalTypeFormModal
