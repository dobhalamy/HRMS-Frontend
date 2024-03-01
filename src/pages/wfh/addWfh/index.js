// import { useEffect } from 'react'
import { Button, Form, Modal, notification, Select, DatePicker, Row, Col, Radio } from 'antd'
import { useDispatch } from 'react-redux'
import { filterOption, formatDate, getLoggedInUserInfo } from 'utils'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import { userRoleEnums } from 'enums/userRole'

// import { fetchEmpDayLeaveData, fetchEmpLeaveData } from 'redux/empLeave/action'
import { fetchEmpLeaveData } from 'redux/empLeave/action'
import { addNewEmpLeave } from 'services/axios/empLeave'
// import { leaveRequestSocket } from 'socket'
// import { getUserDetailedInfo } from 'redux/user/actions'
import { getPoForSelectedEmployee } from 'services/axios/projectManagement'

const { RangePicker } = DatePicker

function AddWfh({
  showWFHForm,
  setShowWFHForm,
  handleOk,
  handleCancel,
  loading,
  React,
  date,
  employee,
}) {
  const dispatch = useDispatch()
  const dateFormat = 'YYYY-MM-DD'
  const [form] = Form.useForm()
  // const user = useSelector((state) => state?.user?.userDetailedInfo)

  // const { userRole, userId, empId } = useSelector((state) => state?.user?.userInfo)
  const { userId, userRole, empId } = getLoggedInUserInfo()
  // const team = useSelector((state) => state?.projectInfo?.team)
  if (userRole !== userRoleEnums?.HR && userRole !== userRoleEnums?.SUPER_ADMIN) {
    form.setFieldsValue({ userId, empId })
  }
  const onFinish = async (values) => {
    const leaveType = 'work_from_home'
    const date1 = values?.leaveDate[0].format('YYYY-MM-DD')
    const date2 = values?.leaveDate[1].format('YYYY-MM-DD')
    const currentTime = moment().format('HH:mm:ss')
    const dateTime1 = `${date1} ${currentTime}`
    const dateTime2 = `${date2} ${currentTime}`
    let empUserId
    let poId
    if (values?.userId) {
      const empPoId = await getPoForSelectedEmployee(values?.userId)
      poId = empPoId
      empUserId = values?.userId
    } else {
      poId = await getPoForSelectedEmployee(userId)
      empUserId = userId
      // poId = po
    }
    const updatedValues = { ...values, leaveType, poId, userId: empUserId, dateTime1, dateTime2 }
    const res = await addNewEmpLeave(updatedValues)
    if (res?.data?.statusCode === 200 && res.data.message !== 'APPLY_TIME_OVER') {
      // send leave request
      // leaveRequestSocket(res?.data?.data, dispatch)
      notification.success({
        message: 'Success',
        description: res.data.message,
      })
      setShowWFHForm(false)
      dispatch(fetchEmpLeaveData())
      // dispatch(fetchEmpDayLeaveData())
    } else {
      notification.error({
        message: res.data.message,
        description:
          'WFH request shall be applied before 8:30am. (for any emergency please contact Hr)  ',
      })
      setShowWFHForm(false)
      dispatch(fetchEmpLeaveData())
      // dispatch(
      //   fetchEmpLeaveRequestData({
      //     // leaveStatus: 0,
      //     skip: 0,
      //     limit: 10,
      //     employeeValue: null,
      //     team,
      //   }),
      // )
      // dispatch(fetchEmpDayLeaveData())
    }
  }
  const leaveStartDate = date.startDate
  const leaveEndDate = date.endDate
  const leaveDate = {
    leaveDate: [formatDate(leaveStartDate), formatDate(leaveEndDate)],
  }
  return (
    <Modal
      title="Apply WFH"
      visible={showWFHForm}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false} // Set to false to prevent closing on click outside
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="applyWFHForm"
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        id="applyWFHForm"
        name="basic"
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        initialValues={leaveDate}
      >
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              name="leaveDate"
              rules={[
                {
                  required: true,
                  message: 'Please select WFH date!',
                },
              ]}
            >
              {/* <RangePicker disabled name="leaveDate" format={dateFormat} minDate={new Date()} /> */}
              <RangePicker name="leaveDate" format={dateFormat} minDate={new Date()} />
            </Form.Item>
          </Col>
        </Row>
        {(userRole === userRoleEnums?.HR || userRole === userRoleEnums?.SUPER_ADMIN) && (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 45%">
              <Form.Item
                name="userId"
                rules={[
                  {
                    required: true,
                    message: 'Please select Employee!',
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
            {/* <Col flex="1 0 45%">
            <Form.Item
              name="leaveType"
              rules={[
                {
                  required: true,
                  message: 'Please select leave type!',
                },
              ]}
            >
              <Select placeholder="Leave Type">
                {leaveType?.map((item) => (
                  <option value={item.uniqueValue}>{item.displayName}</option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
          </Row>
        )}
        <Row className="row" style={{ gap: '1rem' }}>
          <Col flex="1 0 50%">
            <Form.Item
              name="leaveDuration"
              initialValue="fullDay"
              rules={[
                {
                  required: true,
                  message: 'Please select leave duration!',
                },
              ]}
            >
              <Radio.Group initialValues="fullDay">
                <Radio value="short">Short</Radio>
                <Radio value="fullDay">Full Day</Radio>
                <Radio value="halfDay">Half Day</Radio>
                {/* <Radio>WFH</Radio> */}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            <Form.Item
              label="WFH Reason"
              name="leaveReason"
              rules={[
                {
                  required: true,
                  message: 'Please enter your reason for WFH request',
                },
              ]}
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default AddWfh
