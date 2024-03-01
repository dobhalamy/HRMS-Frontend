import React, { useState, useCallback, useEffect } from 'react'
import { Button, Select, Col, Row, Form, Input, Modal, DatePicker, notification } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProject, fetchNewProjectId } from 'services/axios/projectManagement'
import {
  getAllProjectInfo,
  getProjectBillingType,
  getTech,
  getProjectStatus,
} from 'redux/projectInfo/action'
// import { projectStatusEnums } from 'enums/projectStatus'
import { getAllClientInfo } from 'redux/clientInfo/action'

let newProjectId = null

const AddNewProject = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({})
  const dispatch = useDispatch()
  const billingType = useSelector((state) => state?.projectInfo?.billingType)
  const technology = useSelector((state) => state?.projectInfo?.technologies)
  const projectStatus = useSelector((state) => state?.projectInfo?.projectStatus)
  const clientInfo = useSelector((state) => state?.clientInfo?.clientInfoData)
  // const pagination = useSelector((state) => state?.clientInfo?.pagination)

  const handleOpenModal = async () => {
    const response = await fetchNewProjectId()
    if (response?.data?.statusCode === 200 && response?.data?.status) {
      newProjectId = response?.data?.data
      setInitialValues({ projectId: newProjectId })
      setModalVisible(true)
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const getBillingType = useCallback(async () => {
    dispatch(getProjectBillingType())
  }, [dispatch])
  const getTechnology = useCallback(async () => {
    dispatch(getTech())
  }, [dispatch])
  const getClientInfo = useCallback(async () => {
    // const { skip, limit } = pagination
    const skip = 0
    const limit = 0
    dispatch(getAllClientInfo(skip, limit))
  }, [dispatch])

  const getStatus = useCallback(async () => {
    dispatch(getProjectStatus())
  }, [dispatch])
  useEffect(() => {
    getBillingType()
    getTechnology()
    getClientInfo()
    getStatus()
    // getDocType()
  }, [getBillingType, getTechnology, getClientInfo, getStatus])

  const handleFormSubmit = async (values) => {
    const addedNewProject = await addNewProject(values)
    if (addedNewProject?.data?.status && addedNewProject?.data?.statusCode === 201) {
      // push notification to hr for happy to help added
      // happyToHelpRequestSocket(addedHappyToHelp?.data?.data, userId)
      notification.success({
        message: 'New Project Added',
      })
      setModalVisible(false)
      form.resetFields()
      dispatch(getAllProjectInfo({ skip: 0, limit: 10 }))
    }
  }

  return (
    <>
      <Button type="primary" onClick={handleOpenModal} size="large" id="addH2h">
        Add New Project
      </Button>
      <Modal
        title="Add New Project"
        visible={modalVisible}
        onCancel={handleCloseModal}
        centered
        initialValues={initialValues}
        width={800}
        footer={false}
      >
        <Form
          onFinish={handleFormSubmit}
          layout="vertical"
          autoComplete="off"
          form={form}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="projectId"
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
                label={
                  <div>
                    Client Name{''}
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
                      {item?.contactPersonName} ({item?.businessName})
                    </option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="billingType"
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
                  showSearch
                >
                  {billingType?.map((item) => (
                    <Select.Option value={item?.uniqueValue} key={item?.uniqueValue}>
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
                rules={[
                  {
                    required: true,
                    message: 'Please Choose Project Start Date',
                  },
                ]}
              >
                <DatePicker placeholder="Select date" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item label="Project Status" name="projectStatus" initialValue="Not Started">
                <Select
                  placeholder="Please Select Project Status"
                  options={projectStatus}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={15}>
              <Form.Item label="Technology Required" name="technology">
                <Select mode="multiple" placeholder="Please select Technology">
                  {technology?.map((item) => (
                    <Select.Option key={item?.id} value={item?.uniqueValue}>
                      {item?.displayName}
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
      </Modal>
    </>
  )
}

export default AddNewProject
