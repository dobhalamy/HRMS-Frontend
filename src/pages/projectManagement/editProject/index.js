import React, { useCallback, useEffect } from 'react'
import { Modal, Form, Input, Col, Row, Button, notification, Select, DatePicker } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { updateProjectInfo } from 'services/axios/projectManagement'
import {
  getAllProjectInfo,
  getProjectBillingType,
  getTech,
  getProjectStatus,
} from 'redux/projectInfo/action'
import { projectStatusEnums } from 'enums/projectStatus'
import { getAllClientInfo } from 'redux/clientInfo/action'

const EditProject = ({ projectData, showEditForm, setShowEditForm }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const billingType = useSelector((state) => state?.projectInfo?.billingType)
  const technologies = useSelector((state) => state?.projectInfo?.technologies)
  const pagination = useSelector((state) => state?.clientInfo?.pagination)
  const clientInfo = useSelector((state) => state?.clientInfo?.clientInfoData)
  const projectStatus = useSelector((state) => state?.projectInfo?.projectStatus)
  const initialValues = {
    projectStartDate: moment(projectData?.projectStartDate),
    // description,
  }

  const projectStatusMap = {
    [projectStatusEnums.NOT_STARTED]: 'Not Started',
    [projectStatusEnums.ACTIVE]: 'Active',
    [projectStatusEnums.CANCEL]: 'Cancel',
    [projectStatusEnums.COMPLETED]: 'Completed',
    [projectStatusEnums.HOLD]: 'Hold',
  }

  const statusValueMap = {
    'Not Started': projectStatusEnums?.NOT_STARTED,
    Active: projectStatusEnums?.ACTIVE,
    Cancel: projectStatusEnums?.CANCEL,
    Completed: projectStatusEnums?.COMPLETED,
    Hold: projectStatusEnums?.HOLD,
  }

  const onFinish = async (values) => {
    const updateData = {
      ...values,
      id: projectData?.id,
    }
    // const id = projectData?.id
    const updatedProjectData = await updateProjectInfo(updateData)
    if (updatedProjectData?.status === 200) {
      notification.success({
        message: 'Project Details Updated',
      })
      dispatch(getAllProjectInfo({ skip: 0, limit: 10 }))
      setShowEditForm(false)
    }
  }

  const getBillingType = useCallback(async () => {
    dispatch(getProjectBillingType())
  }, [dispatch])
  const getTechnology = useCallback(async () => {
    dispatch(getTech())
  }, [dispatch])
  const getClientInfo = useCallback(async () => {
    const { skip, limit } = pagination
    dispatch(getAllClientInfo({ skip, limit }))
  }, [dispatch, pagination])
  const getStatus = useCallback(async () => {
    dispatch(getProjectStatus())
  }, [dispatch])

  useEffect(() => {
    getBillingType()
    getTechnology()
    getClientInfo()
    getStatus()
  }, [getBillingType, getTechnology, getClientInfo, getStatus])

  const onFinishFailed = () => {
    notification.error({
      message: 'Error',
    })
  }

  const onCancelModalHandler = () => {
    setShowEditForm(false)
  }

  return (
    <Modal
      title="Edit Project Details"
      visible={showEditForm}
      onCancel={onCancelModalHandler}
      centered
      width={800}
      footer={false}
    >
      <Form
        name="editProject"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        onFinishFailed={onFinishFailed}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="projectId"
              initialValue={projectData?.projectId}
              label={
                <div>
                  Project Id{' '}
                  {/* <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                    <InfoCircleOutlined />
                  </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input Project Id',
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="clientId"
              initialValue={projectData?.clientInfo?.id}
              label={
                <div>
                  Client Name{' '}
                  {/* <Tooltip title={formHintBoxMessage.CONCERN_DATE}>
                    <InfoCircleOutlined />
                  </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please Select Client Name',
                },
              ]}
            >
              <Select
                placeholder="Select Client Name"
                // filterOption={filterOption}
                showSearch
              >
                {clientInfo?.map((item) => (
                  <option value={item?.id} key={item}>
                    {item?.contactPersonalName} ({item?.businessName})
                  </option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="billingType"
              initialValue={projectData?.billingType}
              label={
                <div>
                  Billing Type{' '}
                  {/* <Tooltip title={formHintBoxMessage.COMMUNICATION_WITH}>
                    <InfoCircleOutlined />
                  </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please Select Billing Type',
                },
              ]}
            >
              <Select
                placeholder="Select billing type"
                // filterOption={filterOption}
                // initialValues={projectData?.billingType}
                defaultValue={projectData?.billingType}
                showSearch
              >
                {billingType?.map((item) => (
                  <Select.Option key={item?.id} value={item?.uniqueValue}>
                    {item?.displayName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="projectName"
              initialValue={projectData?.projectName}
              label={
                <div>
                  Project Name{' '}
                  {/* <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                    <InfoCircleOutlined />
                  </Tooltip> */}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input Project Name',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label="Project Start Date"
              name="projectStartDate"
              // initialValue={projectData?.projectStartDate}
              rules={[
                {
                  required: true,
                  message: 'Please Choose Project Start Date',
                },
              ]}
            >
              <DatePicker
                placeholder="Select date"
                style={{ width: '100%' }}
                defaultValue={moment(projectData?.projectStartDate)}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label="Project Status"
              name="projectStatus"
              rules={[
                {
                  required: true,
                  message: 'Please Select Billing Type',
                },
              ]}
              initialValue={projectStatusMap[projectData?.projectStatus] || 'Hold'}
            >
              <Select
                placeholder="Please Select Project Status"
                defaultValue={projectStatusMap[projectData?.projectStatus] || 'Hold'}
              >
                {projectStatus?.map((status) => (
                  <Select.Option
                    key={status?.id}
                    value={statusValueMap[status?.displayName] || projectStatusEnums?.HOLD}
                  >
                    {status?.displayName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={15}>
            <Form.Item
              label="Technology Required"
              name="technology"
              initialValue={projectData?.technology ? JSON.parse(projectData?.technology) : []}
            >
              <Select mode="multiple" placeholder="Please select Technology">
                {technologies?.map((technology) => (
                  <Select.Option key={technology?.id} value={technology?.uniqueValue}>
                    {technology?.displayName}
                  </Select.Option>
                ))}
              </Select>
              {/* <Input.TextArea rows={2} style={{ width: '100%', resize: 'none' }} /> */}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <Form.Item label="Description" name="description">
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
      {console.log('edit modal')}
    </Modal>
  )
}
export default EditProject
