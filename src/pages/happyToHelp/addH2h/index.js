import React, { useState } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  notification,
  DatePicker,
  Tooltip,
} from 'antd'
import { addHappyToHelp } from 'services/axios/happyToHelp'
import { getHappyToHelpList } from 'redux/happyToHelp/action'
import { useDispatch, useSelector } from 'react-redux'
import { getNestedGlobalType } from 'services/axios/config'
import { InfoCircleOutlined } from '@ant-design/icons'
import { formHintBoxMessage, filterOption } from 'utils'
// import { happyToHelpRequestSocket } from 'socket'

const AddH2h = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const communicationWith = useSelector((state) => state?.happyToHelp?.communicationWith)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [issues, setIssues] = useState([])
  const belongsToList = useSelector((state) => state?.happyToHelp?.belongsToList)
  // const {userId} = getLoggedInUserInfo()

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }
  const onChangeHandler = async (value) => {
    const res = await getNestedGlobalType(value, 'happy_to_help_issue')
    setIssues(res.data.data)
  }

  const handleFormSubmit = async (values) => {
    const addedHappyToHelp = await addHappyToHelp(values)
    if (addedHappyToHelp?.data?.status && addedHappyToHelp?.data?.message === 'success') {
      // push notification to hr for happy to help added
      // happyToHelpRequestSocket(addedHappyToHelp?.data?.data, userId)
      notification.success({
        message: 'Happy To Help Added',
      })
      form.resetFields()
      setModalVisible(false)
      dispatch(getHappyToHelpList({ skip: 0, limit: 10 }))
    }
  }

  return (
    <>
      <Button type="primary" onClick={handleOpenModal} size="large" id="addH2h">
        Add Happy To Help
      </Button>

      <Modal
        title="Add Happy To Help"
        visible={modalVisible}
        onCancel={handleCloseModal}
        centered
        width={800}
        footer={false}
      >
        <Form onFinish={handleFormSubmit} layout="vertical" autoComplete="off" form={form}>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="concernOf"
                label={
                  <div>
                    Concern Of{' '}
                    <Tooltip title={formHintBoxMessage.CONCERN_DATE}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Enter Concern Of Person',
                  },
                ]}
              >
                <DatePicker placeholder="Select date" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="mobileNo"
                label={
                  <div>
                    Mobile No{' '}
                    <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Please enter your mobile number.',
                    pattern: new RegExp(/^[6789]\d{9}$/),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="communicationWith"
                label={
                  <div>
                    Communication With{' '}
                    <Tooltip title={formHintBoxMessage.COMMUNICATION_WITH}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    message: 'Enter Communication With Person',
                  },
                ]}
              >
                <Select
                  placeholder="Select communication with"
                  filterOption={filterOption}
                  showSearch
                >
                  {communicationWith?.map((item) => (
                    <Select.Option key={item?.userId} value={item?.userName}>
                      {item?.userName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label={
                  <div>
                    Belongs To{' '}
                    <Tooltip title={formHintBoxMessage.BELONGS_TO}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="belongsTo"
                rules={[
                  {
                    required: true,
                    message: 'Select Belongs to',
                  },
                ]}
              >
                <Select onChange={onChangeHandler}>
                  {belongsToList.map((belongsTo) => (
                    <Select.Option key={belongsTo?.id} value={belongsTo?.id}>
                      {belongsTo?.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Issue"
                name="issue"
                rules={[
                  {
                    required: true,
                    message: 'Select your issue',
                  },
                ]}
              >
                <Select>
                  {issues.map((issue) => (
                    <Select.Option key={issue?.id} value={issue?.globalTypeId}>
                      {issue?.GlobalType?.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={24}>
              <Form.Item
                label="Remark"
                name="remark"
                rules={[
                  {
                    required: true,
                    message: 'Enter your remark',
                  },
                ]}
              >
                <Input.TextArea rows={2} style={{ width: '100%', resize: 'none' }} />
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

export default AddH2h
