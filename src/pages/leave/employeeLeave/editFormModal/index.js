import React from 'react'
import { Button, Form, Modal, notification, Select, DatePicker, Row, Col } from 'antd'
import { filterOption, formatDate, getLoggedInUserInfo } from 'utils'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmpLeaveData } from 'redux/empLeave/action'
import TextArea from 'antd/lib/input/TextArea'
import { updateEmpLeave } from 'services/axios/empLeave'
import { userRoleEnums } from 'enums/userRole'

const { RangePicker } = DatePicker

const dateFormat = 'YYYY-MM-DD'
function EditLeaveFormModal({
  showEditLeaveForm,
  setShowEditLeaveForm,
  handleOk,
  loading,
  data,
  employee,
  leaveType,
}) {
  const dispatch = useDispatch()
  const leaveStartDate = new Date(data.start)
  const leaveEndDate = new Date(data.end)
  const { userRole } = getLoggedInUserInfo()
  const isLoading = useSelector((state) => state?.settings?.isLoading)
  // const { skip, limit } = useSelector((state) => state.fetchMasterGlobalTypeData.pagination)
  const LeaveDate = {
    leaveDate: [
      formatDate(leaveStartDate),
      formatDate(leaveEndDate.setDate(leaveEndDate.getDate())),
    ],
  }
  // const { userRole } = useSelector((state) => state?.user?.userInfo)

  const onFinish = async (values) => {
    const response = await updateEmpLeave(values, data?.id)
    if (response?.data?.status && response?.data?.statusCode === 200) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setShowEditLeaveForm(false)
      dispatch(fetchEmpLeaveData())
      // dispatch(
      //   fetchEmpLeaveRequestData({
      //     leaveStatus: 0,
      //     skip,
      //     limit,
      //     employeeValue: null,
      //   }),
      // )
    }
  }
  const onFinishFailed = (errorInfo) => {
    notification?.error({
      message: 'Error',
      description: errorInfo?.errorFields[0]?.errors,
    })
  }

  return (
    <Modal
      title="Edit Leave"
      visible={showEditLeaveForm}
      onOk={handleOk}
      onCancel={() => setShowEditLeaveForm(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowEditLeaveForm(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="editLeaveForm"
          onClick={handleOk}
          disabled={isLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        id="editLeaveForm"
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={LeaveDate}
      >
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              name="leaveDate"
              rules={[
                {
                  required: true,
                  message: 'Please select leave date!',
                },
              ]}
            >
              <RangePicker name="leaveDate" format={dateFormat} minDate={new Date()} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          {(userRole === 'hr' || userRole === 'super_admin') && (
            <Col flex="1 0 45%">
              <Form.Item
                // initialValue={data?.empId}
                initialValue={data?.userId}
                // name="empId"
                name="userId"
                rules={[
                  {
                    required: true,
                    message: 'Please select Employee',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Employee"
                  disabled={
                    userRole !== userRoleEnums?.HR && userRole !== userRoleEnums?.SUPER_ADMIN
                      ? 'disabled'
                      : ''
                  }
                  filterOption={filterOption}
                  allowClear
                >
                  {employee?.map((item) => (
                    <Select.Option key={item?.userId} value={item?.userId}>
                      {item?.userName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col flex="1 0 45%">
            <Form.Item
              name="leaveType"
              initialValue={data?.leaveType}
              rules={[
                {
                  required: true,
                  message: 'Please select leave type!',
                },
              ]}
            >
              <Select placeholder="Leave Type" disabled>
                {leaveType?.map((item) => (
                  <Select.Option key={item?.id} value={item?.uniqueValue}>
                    {item?.displayName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item label="Leave Reason" name="leaveReason" initialValue={data?.leaveReason}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default EditLeaveFormModal
