// import { useEffect } from 'react'
import { Button, Form, Modal, notification, Select, DatePicker, Row, Col, Radio, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { filterOption, formatDate, getLoggedInUserInfo } from 'utils'
import TextArea from 'antd/lib/input/TextArea'
// import { getUserDetailedInfo } from 'redux/user/actions'
// import { fetchEmpDayLeaveData, fetchEmpLeaveData, fetchEmpLeaveRequestData } from 'redux/empLeave/action'
import { fetchEmpLeaveData } from 'redux/empLeave/action'
import { addNewEmpLeave } from 'services/axios/empLeave'
import { getPoForSelectedEmployee } from 'services/axios/projectManagement'
import moment from 'moment'
import { userRoleEnums } from 'enums/userRole'
// import { leaveRequestSocket } from 'socket'

const { RangePicker } = DatePicker
function AddFormModal({
  isOpen,
  setOpen,
  handleOk,
  handleCancel,
  loading,
  React,
  date,
  employee,
  leaveType,
}) {
  const dispatch = useDispatch()
  const dateFormat = 'YYYY-MM-DD'
  const [form] = Form.useForm()
  // const user = useSelector((state) => state?.user?.userDetailedInfo)

  // const { userRole, empId: employeeId, userId } = useSelector((state) => state?.user?.userInfo)
  // const { userRole, userId, empId } = useSelector((state) => state?.user?.userInfo)
  const { userRole, userId, empId } = getLoggedInUserInfo()
  // const team = useSelector((state) => state?.projectInfo?.team)
  if (userRole !== userRoleEnums?.HR && userRole !== userRoleEnums?.SUPER_ADMIN) {
    // form.setFieldsValue({ empId: employeeId })
    form.setFieldsValue({ userId, empId })
  }
  // const po = user?.projects?.map((project) => {
  //   return project?.poId
  // })

  const onFinish = async (values) => {
    const date1 = values?.leaveDate[0].format('YYYY-MM-DD')
    const date2 = values?.leaveDate[1].format('YYYY-MM-DD')
    const currentTime = moment().format('HH:mm:ss')
    const dateTime1 = `${date1} ${currentTime}`
    const dateTime2 = `${date2} ${currentTime}`
    if (
      (userRole === userRoleEnums?.HR || userRole === userRoleEnums?.SUPER_ADMIN) &&
      userId !== values?.userId
    ) {
      const empPoId = await getPoForSelectedEmployee(values?.userId)
      // console.log('empPoId', empPoId)
      values = { ...values, empId, poId: empPoId, dateTime1, dateTime2 }
    } else {
      const po = await getPoForSelectedEmployee(userId)
      values = {
        ...values,
        empId,
        userId,
        poId: po,
        dateTime1,
        dateTime2,
      }
    }
    // console.log('before api hit', values)
    const res = await addNewEmpLeave(values)
    if (res?.data?.status && res?.data?.statusCode === 200) {
      // send leave request
      // leaveRequestSocket(res?.data?.data, dispatch)
      notification.success({
        message: 'Success',
        description: res.data.message,
      })
      setOpen(false)
      dispatch(fetchEmpLeaveData())
      // dispatch(fetchEmpDayLeaveData())
      // dispatch(
      //   fetchEmpLeaveRequestData({
      //     // leaveStatus: 0,
      //     skip: 0,
      //     limit: 10,
      //     employeeValue: null,
      //     team,
      //   }),
      // )
    }
  }
  const leaveStartDate = date.startDate
  const leaveEndDate = date.endDate
  const LeaveDate = {
    leaveDate: [formatDate(leaveStartDate), formatDate(leaveEndDate)],
  }
  return (
    <Modal
      title="Apply Leave"
      visible={isOpen}
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
          form="applyLeaveForm"
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        id="applyLeaveForm"
        name="basic"
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        initialValues={LeaveDate}
      >
        {/* Add radio buttons for full or half-day leave */}
        {(userRole === userRoleEnums?.HR || userRole === userRoleEnums?.SUPER_ADMIN) && (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 100%">
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
          <Col flex="1 0 35%">
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
            <Form.Item
              name="leaveDate"
              rules={[
                {
                  required: true,
                  message: 'Please select leave date!',
                },
              ]}
            >
              {/* <RangePicker disabled name="leaveDate" format={dateFormat} minDate={new Date()} /> */}
              <RangePicker
                name="leaveDate"
                format={dateFormat}
                minDate={new Date()}
                // onChange={(values) => {
                //   // console.log('values', values, leaveEnums?.SICK_AND_CASUAL_LEAVE)
                //   if (values && values.length === 2) {
                //     const startDate = values[0]
                //     const endDate = values[1]
                //     const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
                //     setNumDays(daysDifference)
                //    //  console.log('days',daysDifference, leaveEnums?.SICK_AND_CASUAL_LEAVE)
                //     if (daysDifference > leaveEnums?.SICK_AND_CASUAL_LEAVE) {
                //       setMessage(`The selected leave duration exceeds ${leaveEnums?.SICK_AND_CASUAL_LEAVE} days.`);
                //     } else {
                //       setMessage('')
                //     }
                //   }
                // }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 50%">
            <Form.Item
              name="leaveReason"
              rules={[
                {
                  required: true,
                  message: 'Please enter your reason for leave request',
                },
              ]}
            >
              <TextArea placeholder="Leave Reason" rows={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 45%">
            <Form.Item
              name="contactNum"
              key="personalMobileNumber"
              rules={[{ pattern: /^[6789]\d{9}$/, message: 'Please enter a valid mobile number.' }]}
            >
              <Input placeholder="Emergency Number" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 50%">
            <Form.Item label="Add During Leave" name="addressDuringLeave">
              <TextArea rows={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row> */}
      </Form>
    </Modal>
  )
}
export default AddFormModal
