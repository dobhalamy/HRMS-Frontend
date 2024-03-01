import React from 'react'
import { Button, Modal, Form, Input, Select, Col, Row, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateModulePermissions } from 'services/axios/modulePermissions'
import { getAllModulePermissions } from 'redux/modulePermission/action'
import { filterOption } from 'utils'

const EditModule = ({ moduleData, setShowEditForm, showEditForm }) => {
  const permissionsList = useSelector((state) => state.modulePermission?.permissionsList)
  const initialValues = {
    moduleName: moduleData?.moduleDisplayName,
    permissionsIds: moduleData?.permissionsIds,
  }
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const handleCloseModal = () => {
    setShowEditForm(false)
  }
  const handleFormSubmit = async (values) => {
    const updateData = {
      ...values,
      moduleId: moduleData?.moduleId,
    }

    const updatedPermissions = await updateModulePermissions(updateData)
    if (updatedPermissions?.data?.status && updatedPermissions?.data?.message === 'success') {
      notification.success({
        message: 'Permissions updated',
      })
      form.resetFields()
      setShowEditForm(false)
      dispatch(getAllModulePermissions())
    }
  }

  return (
    <>
      <Modal
        title="Edit Module Permission"
        visible={showEditForm}
        onCancel={handleCloseModal}
        centered
        width={500}
        footer={false}
      >
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          initialValues={initialValues}
          onFinish={handleFormSubmit}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="moduleName"
                label="Module Name"
                rules={[{ required: true, message: 'Select module name' }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="permissionsIds"
                label="Permission"
                rules={[
                  {
                    required: true,
                    message: 'Select permission',
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Please select permissions"
                  filterOption={filterOption}
                >
                  {permissionsList?.map((permission) => (
                    <Select.Option key={permission?.id} value={permission?.id}>
                      {permission?.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditModule
