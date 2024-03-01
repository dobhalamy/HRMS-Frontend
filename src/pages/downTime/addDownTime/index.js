import React, { useEffect, useState, useCallback } from 'react'
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Select,
  TimePicker,
  Input,
  notification,
  Tooltip,
} from 'antd'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { getLoggedInUserInfo, formHintBoxMessage, utcToIst } from 'utils'
import { InfoCircleOutlined } from '@ant-design/icons'
import { addDownTime } from 'services/axios/downTime'
import { isEmpty } from 'lodash'
import { getDep, getDownTimeList } from 'redux/downTime/action'

const AddDowntime = () => {
  const currentDate = moment().format('DD-MM-YYYY')
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [openAddDownTime, setAddOpenDownTime] = useState(false)
  // const userDetailedInfo = useSelector((state) => state?.user?.userDetailedInfo)
  const { userName } = getLoggedInUserInfo()
  // const userName = userDetailedInfo?.userName
  //   ? capitalizeFirstLetter(userDetailedInfo?.userName)
  //   : ''
  const departmentList = useSelector((state) => state?.downTimeState?.department)
  const statusFilter = useSelector((state) => state?.downTimeState?.status)
  const userRole = getLoggedInUserInfo()?.userRole
  // const [loading, setLoading] = useState(true)
  const showModal = () => {
    setAddOpenDownTime(true)
  }

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      startTime: moment(values.startTime).utc(),
      endTime: moment(values.endTime).utc(),
    }
    if (utcToIst(values.startTime) === utcToIst(values.endTime)) {
      notification.error({
        message: 'Same start and end time',
      })
    } else if (!isEmpty(formattedValues)) {
      const markedDownTime = await addDownTime(formattedValues)
      if (markedDownTime?.data?.status) {
        notification.success({
          message: 'Down Time Added',
        })
        form.resetFields()
        setAddOpenDownTime(false)
        if (userRole === 'po') {
          dispatch(getDownTimeList({ status: statusFilter, skip: 0, limit: 10 }))
        } else {
          dispatch(getDownTimeList({ status: 0, skip: 0, limit: 10 }))
        }
      }
    }
  }

  const getDepartment = useCallback(async () => {
    dispatch(getDep())
  }, [dispatch])

  useEffect(() => {
    getDepartment()
  }, [getDepartment])

  // useEffect(() => {
  //   if (!userDetailedInfo) {
  //     setLoading(false)
  //   }
  // }, [userDetailedInfo])

  // if (loading) {
  //   ;<div>loading</div>
  // }
  // useEffect(() => {
  //   dispatch(getDep())
  // },[dispatch])

  return (
    <>
      <Button type="primary" onClick={showModal} size="large">
        Add Down Time
      </Button>
      <Modal
        title="Add down time"
        visible={openAddDownTime}
        onCancel={() => setAddOpenDownTime(false)}
        footer={[
          <Button key="back" onClick={() => setAddOpenDownTime(() => false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="addDownTime">
            Submit
          </Button>,
        ]}
      >
        <Form
          id="addDownTime"
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ name: userName, date: currentDate }}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item name="name" key="name">
                <Select disabled />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item name="date" key="date">
                <Select disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="startTime"
                key="startTime"
                rules={[
                  {
                    required: true,
                    message: 'Please input start time',
                  },
                ]}
              >
                <TimePicker use12Hours format="h:mm a" placeholder="Start time" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="endTime"
                key="endTime"
                rules={[
                  {
                    required: true,
                    message: 'Please input end time',
                  },
                ]}
              >
                <TimePicker use12Hours format="h:mm a" placeholder="End time" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="departmentId"
                key="departmentId"
                rules={[
                  {
                    required: true,
                    message: 'Select your department',
                  },
                ]}
              >
                <Select placeholder="Department">
                  {departmentList.map((department) => (
                    <Select.Option key={department?.id} value={department?.id}>
                      {department?.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label={
                  <div>
                    Subject{' '}
                    <Tooltip title={formHintBoxMessage.DOWN_TIME}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="subject"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your subject',
                  },
                ]}
              >
                <Input width={120} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={24}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Please enter you reason',
                  },
                ]}
              >
                <Input.TextArea rows={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
export default AddDowntime
