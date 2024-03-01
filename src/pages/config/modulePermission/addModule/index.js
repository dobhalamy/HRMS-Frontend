import React, { useState } from 'react'
import { Button, Modal, Form, Select, Col, Row, notification } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { filterOption } from 'utils'
import {
  addModulePermissions,
  getSingleModulePermission,
  updateModulePermissions,
} from 'services/axios/modulePermissions'
import { getAllModulePermissions } from 'redux/modulePermission/action'

const AddModule = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const permissionsList = useSelector((state) => state.modulePermission?.permissionsList)
  const modulesList = useSelector((state) => state?.modulePermission?.modulesList)
  const [checkFormType, setCheckFormType] = useState('add')

  const dispatch = useDispatch()

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleFormSubmit = async (values) => {
    const formType = { checkFormType }
    let addedPermissions
    if (formType === 'add') {
      addedPermissions = await addModulePermissions(values)
    } else {
      addedPermissions = await updateModulePermissions(values)
    }
    if (addedPermissions?.data?.status && addedPermissions?.data?.message === 'success') {
      notification.success({
        message: 'Permissions added',
      })
      form.resetFields()
      setModalVisible(false)
      dispatch(getAllModulePermissions())
    } else {
      form.resetFields()
    }
  }
  const handleChange = async (value) => {
    const moduleId = value
    if (!moduleId) {
      form.setFieldsValue({ permissionsIds: undefined })
    } else {
      const response = await getSingleModulePermission({ moduleId })
      const newData = response?.data?.data?.map((item) => {
        const { permissionsInfo } = item
        return {
          permissionsIds: permissionsInfo?.map((permission) => permission?.permissionId),
        }
      })
      if (newData) {
        form.setFieldsValue({ permissionsIds: newData[0]?.permissionsIds })
        setCheckFormType('update')
      } else {
        form.setFieldsValue({ permissionsIds: undefined })
        setCheckFormType('add')
      }
    }
  }

  return (
    <>
      <Button type="primary" onClick={handleOpenModal} size="middle">
        Add Module Permissions
      </Button>

      <Modal
        title="Add Module Permissions"
        visible={modalVisible}
        onCancel={handleCloseModal}
        centered
        width={500}
        footer={false}
      >
        <Form onFinish={handleFormSubmit} layout="vertical" autoComplete="off" form={form}>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="moduleId"
                label="Module Name"
                rules={[{ required: true, message: 'Select module name' }]}
              >
                <Select
                  placeholder="Select module"
                  filterOption={filterOption}
                  showSearch
                  allowClear
                  onChange={handleChange}
                >
                  {modulesList?.map((module) => (
                    <Select.Option key={module?.id} value={module?.id}>
                      {module?.displayName}
                    </Select.Option>
                  ))}
                </Select>
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
                  allowClear
                >
                  {permissionsList?.map((permission) => (
                    <Select.Option key={permission?.id} value={permission?.id}>
                      {permission?.displayName}
                    </Select.Option>
                  ))}{' '}
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

export default AddModule
