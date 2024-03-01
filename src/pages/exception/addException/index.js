import React, { useEffect, useState, useCallback } from 'react'
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  TimePicker,
  DatePicker,
  notification,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import TextArea from 'antd/lib/input/TextArea'
import { getLoggedInUserInfo } from 'utils'
import {
  getListOfException,
  getRequestType,
  getExceptionListSingleEmp,
  getAttendance,
} from 'redux/exception/action'
import moment from 'moment'
import { addException } from 'services/axios/exception'
// import { exceptionRequestSocket } from 'socket'

const AddException = () => {
  const [openAddException, setAddException] = useState(false)
  const [selectedRequestType, setRequestType] = useState({
    requestId: null,
    requestValue: null,
  })
  const user = useSelector((state) => state.user)
  const { requestType } = useSelector((state) => state.exception)
  const { attendance } = useSelector((state) => state.exception)
  const userRole = getLoggedInUserInfo()?.userRole
  // const { userId } = getLoggedInUserInfo()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const empId = getLoggedInUserInfo()?.empId
  const showModal = () => {
    setAddException(true)
  }
  const attendanceList = attendance?.map((item) => {
    return {
      label: item?.GlobalType?.displayName,
      value: item?.GlobalType?.displayName,
    }
  })
  const getDepartment = useCallback(async () => {
    dispatch(getRequestType('exception'))
  }, [dispatch])
  useEffect(() => {
    getDepartment()
  }, [getDepartment])

  const onFinish = async (values) => {
    const formValues = {
      ...values,
      raiseRequest: selectedRequestType?.requestId,
    }
    const isExceptionAdded = await addException(formValues)
    if (isExceptionAdded.status === 200) {
      // exceptionRequestSocket(isExceptionAdded?.data, userId)
      notification.success({
        message: 'Exception Added',
      })
      if (userRole === 'hr' || userRole === 'super_admin') {
        dispatch(getListOfException({ skip: 0, limit: 10 }))
      } else {
        dispatch(getExceptionListSingleEmp({ skip: 0, limit: 10 }))
      }
      setAddException(false)
      form.resetFields()
    }
  }
  const handleShiftInTime = (time, timeString) => {
    const shiftOut = moment(timeString, 'HH:mm').add(9, 'hours')
    form.setFieldsValue({ shiftOut })
  }
  return (
    <>
      <Button type="primary" onClick={showModal} size="large" id="addException">
        Add Exception
      </Button>
      <Modal
        title="Add Exception"
        visible={openAddException}
        width={800}
        centered
        onCancel={() => setAddException(false)}
        footer={[
          <Button key="back" onClick={() => setAddException(() => false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="addException">
            Submit
          </Button>,
        ]}
      >
        <Form
          id="addException"
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            empId,
            empName: user?.userDetailedInfo?.userName,
            raiseRequest: 'Select Request',
          }}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item name="empName" key="empName" label="Employee Name">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item name="empId" key="empId" label="Employee ID">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item name="raiseRequest" key="raiseRequest" label="Raise Request">
                <Select
                  onChange={(_, selectedOption) => {
                    if (selectedOption?.key === '167') {
                      dispatch(getAttendance(selectedOption?.key))
                    }
                    setRequestType({
                      requestId: selectedOption?.key,
                      requestValue: selectedOption?.value,
                    })
                  }}
                >
                  {requestType?.map((request) => (
                    <Select.Option key={request.id} value={request.uniqueValue}>
                      {request.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item name="dateFrom" key="dateFrom" label="Date From">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={selectedRequestType?.requestId === null}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item name="dateTo" key="dateTo" label="Date To">
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={selectedRequestType?.requestId === null}
                />
              </Form.Item>
            </Col>
            {['shift_change', 'roster_change', 'working_on_weekoff'].includes(
              selectedRequestType?.requestValue,
            ) && (
              <Col className="gutter-row" span={12}>
                <Form.Item name="shiftIn" key="shiftIn" label="Shift IN">
                  <TimePicker
                    style={{ width: '100%' }}
                    format="h:mm"
                    minuteStep={30}
                    onChange={handleShiftInTime}
                    placeholder="Select shift IN"
                  />
                </Form.Item>
              </Col>
            )}
            {selectedRequestType?.requestValue === 'biometric_issue' && (
              <Col className="gutter-row" span={12}>
                <Form.Item
                  name="currentAttendance"
                  key="currentAttendance"
                  label="Current Attendance"
                >
                  <Select placeholder="Select Current Attendance" options={attendanceList} />
                </Form.Item>
              </Col>
            )}
          </Row>
          {['shift_change', 'roster_change', 'working_on_weekoff'].includes(
            selectedRequestType?.requestValue,
          ) && (
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <Form.Item name="shiftOut" key="shiftOut" label="Shift OUT">
                  <TimePicker
                    style={{ width: '100%' }}
                    format="h:mm"
                    minuteStep={30}
                    placeholder="Select shift OUT"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          {selectedRequestType?.requestValue === 'biometric_issue' && (
            <>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    name="updateAttendance"
                    key="updateAttendance"
                    label="Update Attendance"
                  >
                    <Select placeholder="Select Update Attendance" options={attendanceList} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item name="accessIn" key="accessIn" label="Access In">
                    <TimePicker
                      style={{ width: '100%' }}
                      format="h:mm a"
                      minuteStep={30}
                      placeholder="Select Access In"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Form.Item name="accessOut" key="accessOut" label="Access Out">
                    <TimePicker
                      style={{ width: '100%' }}
                      format="h:mm a"
                      minuteStep={30}
                      placeholder="Select Access Out"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item name="comment" key="comment" label="Comment">
            <TextArea
              showCount
              maxLength={100}
              style={{
                width: '100%',
              }}
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Enter a comment"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default AddException
