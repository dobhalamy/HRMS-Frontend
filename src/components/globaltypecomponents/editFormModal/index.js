import React from 'react'
import { Button, Form, Input, Modal, notification, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGTData } from 'redux/globalType/actions'
import { updateGlobalType } from 'services/axios/config'

function EditGlobalTypeFormModal({
  open,
  setEditopen,
  categoryFilter,
  handleOk,
  handleCancel,
  loading,
  id,
  data,
  globalcategory,
  GTCData,
}) {
  const [editGlobalTypeForm] = Form.useForm()
  const dispatch = useDispatch()
  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)

  const isLoading = useSelector((state) => state?.settings?.isLoading)
  const onFinish = async (values) => {
    const response = await updateGlobalType(values, id)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setEditopen(false)
      dispatch(fetchGTData({ skip, limit, globalTypeCategory: categoryFilter || '' }))
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const handleGlobalTtypeUniqueValue = (event) => {
    const uniqueValue = event?.target?.value.replace(/ /g, '_').toLowerCase()
    editGlobalTypeForm.setFieldsValue({
      uniqueValue,
    })
  }
  return (
    <Modal
      title="Edit Global Type"
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
          form="editForm"
          onClick={handleOk}
          disabled={isLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        form={editGlobalTypeForm}
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
          label="Global Type Category"
          name="globalTypeCategory"
          initialValue={globalcategory}
          rules={[
            {
              required: true,
              message: 'Please Select Global Type Category!',
            },
          ]}
        >
          <Select showSearch allowClear>
            {GTCData?.globalTypeCategory?.map(({ uniqueValue, displayName }) => (
              <Select.Option key={globalcategory} value={uniqueValue}>
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
          initialValue={data.displayName}
          onBlur={handleGlobalTtypeUniqueValue}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditGlobalTypeFormModal
