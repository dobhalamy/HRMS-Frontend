import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, notification, Row, Col, Input, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { filterOption } from 'utils'
import { getNestedGlobalType } from 'services/axios/config'
import { updateRYGEmployee } from 'services/axios/rygStatus'
import { fetchRYGstatusData } from 'redux/rygStatus/action'
import { useDispatch, useSelector } from 'react-redux'

function EditRYGFormModal({
  showEditRYGForm,
  masterGlobalTypeData,
  setShowEditRYGForm,
  handleOk,
  data,
}) {
  const dispatch = useDispatch()
  const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)
  const [subStatusOptions, setSubStatusOptions] = useState([])
  const [form] = Form.useForm()
  const onFinishFailed = (errorInfo) => {
    notification?.error({
      message: 'Error',
      description: errorInfo?.errorFields[0]?.errors,
    })
  }
  const onFinish = async (values) => {
    values.empId = data?.userId
    const response = await updateRYGEmployee(values)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setShowEditRYGForm(false)
      dispatch(
        fetchRYGstatusData({
          leaveStatus: 0,
          skip,
          limit,
          employeeValue: null,
        }),
      )
    }
  }
  const handleStatusChange = async (event) => {
    const selectedValue = event
    if (data?.RYGstatus?.status !== selectedValue) {
      form.setFieldsValue({ subStatus: null })
    }
    // Make an API call to fetch data for the second dropdown based on the selected value
    try {
      if (selectedValue !== '') {
        const res = await getNestedGlobalType(selectedValue, 'ryg_sub_status')
        if (res?.data?.status && res?.data?.statusCode === 200) {
          const subStatusdata = res?.data?.data
          if (selectedValue === 94) {
            form.setFieldsValue({ subStatus: subStatusdata[0].globalTypeId })
          }
          setSubStatusOptions(subStatusdata)
        }
      } else {
        form.setFieldsValue({ subStatus: null })
        setSubStatusOptions()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    handleStatusChange(data?.RYGstatus?.status || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.RYGstatus?.status])
  return (
    <Modal
      title="Update RYG Status"
      visible={showEditRYGForm}
      onOk={handleOk}
      onCancel={() => setShowEditRYGForm(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowEditRYGForm(() => false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="editRYGForm" onClick={handleOk}>
          Submit
        </Button>,
      ]}
      className="viewLeave"
    >
      <Form
        id="editRYGForm"
        name="basic"
        form={form}
        onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 45%">
            <Form.Item
              initialValue={data?.empId}
              name="empCode"
              rules={[
                {
                  required: true,
                  message: 'Please select Employee',
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col flex="1 0 45%">
            <Form.Item
              initialValue={data?.userName}
              name="empName"
              rules={[
                {
                  required: true,
                  message: 'Please select Employee',
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 45%">
            <Form.Item
              initialValue={data?.RYGstatus?.status}
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Please select Status',
                },
              ]}
            >
              <Select
                showSearch
                filterOption={filterOption}
                onChange={handleStatusChange}
                placeholder="Pending"
              >
                <option value="">Pending</option>
                {masterGlobalTypeData?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.displayName}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col flex="1 0 45%">
            <Form.Item
              initialValue={data?.RYGstatus?.subStatus}
              name="subStatus"
              rules={[
                {
                  required: true,
                  message: 'Please select Sub Status',
                },
              ]}
            >
              <Select showSearch filterOption={filterOption} allowClear placeholder="Sub Status">
                {subStatusOptions?.map((option) => (
                  <option key={option?.globalTypeId} value={option?.globalTypeId}>
                    {option?.GlobalType?.displayName}
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item label="Remarks" name="remarks" initialValue={data?.RYGstatus?.remarks}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default EditRYGFormModal
