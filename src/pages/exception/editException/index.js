import React, { useEffect, useCallback, useState } from 'react'
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
import { updateException } from 'services/axios/exception'
import { getRequestType, getAttendance, getExceptionListSingleEmp } from 'redux/exception/action'
import moment from 'moment'
import { raisedRequest } from 'enums/userRole'

const EditException = ({ showEditForm, setShowEditForm, data }) => {
  const { requestType } = useSelector((state) => state.exception)
  const { attendance } = useSelector((state) => state.exception)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const empId = getLoggedInUserInfo()?.empId
  const [selectedRequestType, setRequestType] = useState({
    requestId: null,
    requestValue: null,
  })
  const attendanceList = attendance?.map((item) => {
    return {
      label: item?.GlobalType?.displayName,
      value: item?.GlobalType?.displayName,
    }
  })
  const getDepartment = useCallback(async () => {
    dispatch(getRequestType('exception'))
  }, [dispatch])
  const getAttendanceList = useCallback(async () => {
    dispatch(getAttendance(data?.requestType))
  }, [data?.requestType, dispatch])
  useEffect(() => {
    getDepartment()
    getAttendanceList()
  }, [getDepartment, getAttendanceList])

  const onFinish = async (values) => {
    const formValues = {
      ...values,
      id: data?.id,
      raiseRequest: selectedRequestType?.requestId,
    }
    const updatedException = await updateException(formValues)
    if (updatedException?.status === 200) {
      notification.success({
        message: 'Exception Updated',
      })
      setShowEditForm(false)
      dispatch(getExceptionListSingleEmp({ skip: 0, limit: 10 }))
    }
  }
  const handleShiftInTime = (time, timeString) => {
    const shiftOut = moment(timeString, 'HH:mm').add(9, 'hours')
    form.setFieldsValue({ shiftOut })
  }

  return (
    <>
      <Modal
        title="Edit Exception"
        visible={showEditForm}
        width={800}
        centered
        onCancel={() => setShowEditForm(false)}
        footer={[
          <Button key="back" onClick={() => setShowEditForm(() => false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="editException">
            Submit
          </Button>,
        ]}
      >
        <Form
          name="editException"
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="empName"
                key="empName"
                label="Employee Name"
                initialValue={data?.employeeName?.userName}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item name="empId" key="empId" label="Employee ID" initialValue={empId}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="raiseRequest"
                key="raiseRequest"
                label="Raise Request"
                initialValue={data?.raisedRequest?.displayName}
              >
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
                  disabled={selectedRequestType?.requestId === null}
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
              <Form.Item
                name="dateFrom"
                key="dateFrom"
                label="Date From"
                initialValue={moment(data?.dateFrom)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={selectedRequestType?.requestId === null}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="dateTo"
                key="dateTo"
                label="Date To"
                initialValue={moment(data?.dateTo)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={selectedRequestType?.requestId === null}
                />
              </Form.Item>
            </Col>
            {(['Shift Change', 'Roster Change', 'Working On WeekOff'].includes(
              data?.raisedRequest?.displayName,
            ) ||
              ['shift_change', 'roster_change', 'working_on_weekoff'].includes(
                selectedRequestType?.requestValue,
              )) &&
              (selectedRequestType?.requestValue === null ||
                selectedRequestType?.requestValue === raisedRequest.ROSTER_CHANGE ||
                selectedRequestType?.requestValue === raisedRequest.SHIFT_CHANGE ||
                selectedRequestType?.requestValue === raisedRequest.WORKING_ON_WEEKOFF) && (
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    name="shiftIn"
                    key="shiftIn"
                    label="Shift IN"
                    initialValue={data?.shiftIn ? moment(data?.shiftIn) : null}
                  >
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
            {((data?.raisedRequest?.displayName === 'Biometric Issue' &&
              (selectedRequestType?.requestValue === raisedRequest.BIOMETRIC_ISSUE ||
                selectedRequestType?.requestValue === null)) ||
              selectedRequestType?.requestValue === raisedRequest.BIOMETRIC_ISSUE) && (
              <Col className="gutter-row" span={12}>
                <Form.Item
                  name="currentAttendance"
                  key="currentAttendance"
                  label="Current Attendance"
                  initialValue={data?.currentAttendance}
                >
                  <Select placeholder="Select Current Attendance" options={attendanceList} />
                </Form.Item>
              </Col>
            )}
          </Row>
          {(['Shift Change', 'Roster Change', 'Working On WeekOff'].includes(
            data?.raisedRequest?.displayName,
          ) ||
            ['shift_change', 'roster_change', 'working_on_weekoff'].includes(
              selectedRequestType?.requestValue,
            )) &&
            (selectedRequestType?.requestValue === null ||
              selectedRequestType?.requestValue === raisedRequest.ROSTER_CHANGE ||
              selectedRequestType?.requestValue === raisedRequest.SHIFT_CHANGE ||
              selectedRequestType?.requestValue === raisedRequest.WORKING_ON_WEEKOFF) && (
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    name="shiftOut"
                    key="shiftOut"
                    label="Shift OUT"
                    initialValue={data?.shiftOut ? moment(data?.shiftOut) : null}
                  >
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
          {((data?.raisedRequest?.displayName === 'Biometric Issue' &&
            (selectedRequestType?.requestValue === raisedRequest.BIOMETRIC_ISSUE ||
              selectedRequestType?.requestValue === null)) ||
            selectedRequestType?.requestValue === raisedRequest.BIOMETRIC_ISSUE) && (
            <>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    name="updateAttendance"
                    key="updateAttendance"
                    label="Update Attendance"
                    initialValue={data?.updateAttendance}
                  >
                    <Select placeholder="Select Update Attendance" options={attendanceList} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    name="accessIn"
                    key="accessIn"
                    label="Access In"
                    initialValue={data?.accessIn ? moment(data?.accessIn) : null}
                  >
                    <TimePicker
                      style={{ width: '100%' }}
                      format="h:mm a"
                      minuteStep={30}
                      placeholder="Access In"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    name="accessOut"
                    key="accessOut"
                    label="Access Out"
                    initialValue={data?.accessOut ? moment(data?.accessOut) : null}
                  >
                    <TimePicker
                      style={{ width: '100%' }}
                      format="h:mm a"
                      minuteStep={30}
                      placeholder="Access Out"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item name="comment" key="comment" label="Comment" initialValue={data?.comment}>
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
export default EditException
