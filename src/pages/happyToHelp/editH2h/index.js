import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  notification,
  Modal,
  DatePicker,
  Tooltip,
} from 'antd'
import { updateHappyToHelp } from 'services/axios/happyToHelp'
import { useDispatch, useSelector } from 'react-redux'
import { getHappyToHelpList, getAllHappyToHelpList } from 'redux/happyToHelp/action'
import { InfoCircleOutlined } from '@ant-design/icons'
import { getNestedGlobalType } from 'services/axios/config'
import moment from 'moment'
import { getLoggedInUserInfo, formHintBoxMessage } from 'utils'

const EditH2h = ({ h2hData, showEditForm, setShowEditForm }) => {
  const [form] = Form.useForm()
  const communicationWith = useSelector((state) => state?.happyToHelp?.communicationWith)
  const userRole = getLoggedInUserInfo()?.userRole
  const dispatch = useDispatch()
  const [issues, setIssues] = useState([])
  const belongsToList = useSelector((state) => state?.happyToHelp?.belongsToList)
  const initialValues = {
    belongsTo: h2hData?.belongsToName,
    issue: h2hData?.GlobalType?.displayName,
    communicationWith: h2hData?.communicationWith,
    mobileNo: h2hData?.mobileNo,
    concernOf: moment(h2hData?.concernOf, 'YYYY-MM-DD'),
    remark: h2hData?.remark,
  }
  const onFinish = async (values) => {
    let updateData
    if (
      values?.issue === h2hData?.GlobalType?.displayName &&
      values?.belongsTo === h2hData?.belongsToName
    ) {
      updateData = {
        ...values,
        id: h2hData?.id,
        belongsTo: h2hData?.belongsTo,
        issue: h2hData?.issue,
      }
    } else {
      updateData = {
        ...values,
        id: h2hData?.id,
      }
    }

    const id = h2hData?.id
    const updatedHappyToHelp = await updateHappyToHelp(updateData, id)
    if (updatedHappyToHelp?.status === 200) {
      notification.success({
        message: 'Happy To Help Updated',
      })
      if (userRole === 'hr') {
        dispatch(getAllHappyToHelpList({ skip: 0, limit: 10 }))
      } else {
        dispatch(getHappyToHelpList({ skip: 0, limit: 10 }))
      }

      setShowEditForm(false)
    }
  }

  const onFinishFailed = () => {
    notification.error({
      message: 'Error',
    })
  }
  const onCancelModalHandler = () => {
    setShowEditForm(false)
  }
  const onChangeHandler = async (value) => {
    form.setFieldsValue({ issue: null })

    const res = await getNestedGlobalType(value, 'happy_to_help_issue')
    setIssues(res.data.data)
  }

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await getNestedGlobalType(h2hData?.belongsTo, 'happy_to_help_issue')
        setIssues(res.data.data)
      } catch (error) {
        // Handle any errors that occur during the data fetching process
        console.error(error)
      }
    }

    fetchIssues()
  }, [h2hData?.belongsTo])

  return (
    <Modal
      title="Edit Happy To Help"
      centered
      visible={showEditForm}
      onCancel={onCancelModalHandler}
      width={800}
      footer={false}
    >
      <Form
        name="editH2h"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={initialValues}
        layout="vertical"
      >
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
                  message: 'Enter Concern Of',
                },
              ]}
            >
              <DatePicker
                disabled={userRole === 'hr'}
                placeholder="Select date"
                style={{ width: '100%' }}
              />
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
                { required: true, message: 'Please enter your mobile number.' },
                { pattern: /^\d{1,10}$/, message: 'Please enter a valid mobile number.' },
              ]}
            >
              <Input disabled={userRole === 'hr'} />
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
              <Select disabled={userRole === 'hr'}>
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
              <Select
                onChange={onChangeHandler}
                initialValues={h2hData?.belongsToName}
                disabled={userRole === 'hr'}
              >
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
              <Select initialValues={h2hData?.GlobalType?.displayName} disabled={userRole === 'hr'}>
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
  )
}
export default EditH2h
