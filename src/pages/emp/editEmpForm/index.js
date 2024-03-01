import React, { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  notification,
  Button,
  Steps,
  Tooltip,
} from 'antd'
import moment from 'moment'
import { updateEmployeeData } from 'services/axios/emp'
import {
  getEmployeeList,
  toggleLoading,
  getEmpDesignation,
  getEmpRole,
  getDep,
  // getEmpProcess,
  getDocumentType,
} from 'redux/allEmployee/action'
import { updateDocument, uploadDocument } from 'services/axios/media'
import { useDispatch, useSelector } from 'react-redux'
import PhoneNumberInput from 'components/phoneNumberInput'
import { InfoCircleOutlined } from '@ant-design/icons'
import { capitalizeFirstLetter, formHintBoxMessage } from '../../../utils/index'
import EditDocForm from '../editDocForm'

export default function EditEmployeeForm({ showEditEmpForm, setShowEditEmpForm, data }) {
  const dateFormat = 'DD/MM/YYYY'
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const Designations = useSelector((state) => state.toggle.empDesignation)
  const department = useSelector((state) => state?.toggle?.department)
  const role = useSelector((state) => state?.toggle?.empRole)
  // const process = useSelector((state) => state?.toggle?.empProcess)
  // const [showProcess, setShowProcess] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [updatedEmpInfo, setUpdatedEmpInfo] = useState(null)
  const { Step } = Steps
  const docType = useSelector((state) => state?.toggle?.docType)
  const numberOfDoc = docType?.length

  const Designation = Designations?.map((item) => {
    return {
      label: item?.displayName,
      value: item?.uniqueValue,
    }
  })
  const EmployeeType = role?.map((item) => {
    return {
      label: item?.GlobalType?.displayName,
      value: item?.globalTypeId,
    }
  })
  // const EmployeeProcess = process?.map((item) => {
  //   return {
  //     label: item?.GlobalType?.displayName,
  //     value: item?.globalTypeId,
  //   }
  // })
  const depName = department?.map((item) => {
    return {
      label: item?.displayName,
      value: item?.id,
    }
  })

  const getDesignation = useCallback(async () => {
    dispatch(getEmpDesignation())
  }, [dispatch])
  const getDocType = useCallback(async () => {
    dispatch(getDocumentType())
  }, [dispatch])
  const getRole = useCallback(async () => {
    dispatch(getEmpRole(data?.depId))
  }, [data?.depId, dispatch])
  // const getProcess = useCallback(async () => {
  //   dispatch(getEmpProcess(data?.depId))
  // }, [data?.depId, dispatch])
  const getDepartment = useCallback(async () => {
    dispatch(getDep())
  }, [dispatch])

  useEffect(() => {
    // if (data?.userProcess) {
    //   setShowProcess(true)
    // }
    getRole()
    getDesignation()
    getDepartment()
    // getProcess()
    getDocType()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRole, getDesignation, getDepartment, getDocType])

  const loading = useSelector((state) => state?.toggle?.loading)

  const initialValues = {
    userBirthday: moment(data?.userBirthday),
    empJoinDate: moment(data?.empJoinDate),
    remember: true,
  }
  const initialDocValues = {
    documents: data?.documents?.map((doc) => ({
      id: doc.id,
      mediaType: doc.mediaType,
      document: doc.mediaLink,
    })),
  }
  const onFinish = (values) => {
    setCurrentStep(currentStep + 1)
    setUpdatedEmpInfo(values)
  }
  const onFinishFailed = () => {
    notification.error({
      message: 'Failed',
    })
  }
  const handlePhoneChange = (phone) => {
    form.setFieldsValue({ empMobileNumber: phone })
    form.validateFields(['empMobileNumber'])
  }

  const disabledAfterCurrentDate = (current) => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    return current && current.valueOf() > currentDate.valueOf()
  }

  const handleSubmit = async (values) => {
    try {
      dispatch(toggleLoading(!loading))
      const empId = updatedEmpInfo?.empId
      const updatedEmp = await updateEmployeeData({ ...data, ...updatedEmpInfo })

      if (updatedEmp?.status === 200 && updatedEmp?.data?.status) {
        notification.success({
          message: 'Success',
          description: 'Employee updated successfully',
        })

        for (let i = 0; i < values?.documents?.length; i += 1) {
          const formData = new FormData()
          const { mediaType } = values?.documents[i]
          const { id } = values?.documents[i]

          if (!id) {
            const file = values?.documents[i]?.document?.file
              ? values?.documents[i]?.document?.file
              : values?.documents[i]?.document

            formData.append('empId', empId)
            formData.append('mediaType', mediaType)
            // formData.append('file', values?.documents[i]?.document)
            formData.append('file', file)
            // eslint-disable-next-line no-await-in-loop
            const addedDocument = await uploadDocument(formData)
            if (addedDocument?.status === 200 && addedDocument?.data?.statusCode === 200) {
              dispatch(getEmployeeList({ skip: 0, limit: 10 }))
              form.resetFields()
            }
          } else {
            const { document } = values?.documents[i]
            if (document) {
              formData.append('empId', empId)
              formData.append('id', id)
              formData.append('mediaType', mediaType)
              formData.append('file', document)
              // eslint-disable-next-line no-await-in-loop
              const updatedDoc = await updateDocument(formData)

              if (!(updatedDoc?.status === 200 && updatedDoc?.data?.statusCode === 200)) {
                throw new Error('Error on upload document')
              }
            } else {
              formData.append('empId', empId)
              formData.append('id', id)
              formData.append('mediaType', mediaType)
              // eslint-disable-next-line no-await-in-loop
              const updatedDoc = await updateDocument(formData)
              if (!(updatedDoc?.status === 200 && updatedDoc?.data?.statusCode === 200)) {
                throw new Error('Error on upload document')
              }
            }
          }
        }
        dispatch(toggleLoading(false))
        setShowEditEmpForm(() => false)
        dispatch(getEmployeeList({ skip: 0, limit: 10 }))
      } else {
        setCurrentStep(0)
        dispatch(toggleLoading(false))
        throw new Error('Failed to update employee')
      }
    } catch (error) {
      notification.success({
        message: 'Error',
        description: error,
      })
    }
  }
  const onChangeHandler = (value) => {
    if (value === 49 || value === 131) {
      // setShowProcess(false)
      dispatch(getEmpRole(value))
    } else {
      // setShowProcess(true)
      dispatch(getEmpRole(value))
      // dispatch(getEmpProcess(value))
    }
  }

  const steps = [
    {
      title: 'Edit Employee Details',
      content: (
        <Form
          style={{
            padding: '2rem',
          }}
          name="editEmployee"
          layout="vertical"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.empId}
                label="Employee ID"
                name="empId"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Employee Id',
                  },
                ]}
              >
                <Input size="large" placeholder="Enter employee Id" disabled />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.userName}
                label={
                  <div>
                    Employee Name{' '}
                    <Tooltip title={formHintBoxMessage.NAME}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="userName"
                rules={[
                  {
                    required: true,
                    message: 'Please input employee name',
                  },
                ]}
              >
                <Input size="large" placeholder="Enter employee name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.userPersonalEmail}
                label={
                  <div>
                    Personal Email{' '}
                    <Tooltip title={formHintBoxMessage.EMAIL}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="userPersonalEmail"
              >
                <Input placeholder="i.e. example@gmail.com" size="large" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.userPassword}
                label={
                  <div>
                    Password{' '}
                    <Tooltip title={formHintBoxMessage.PASSWORD}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="userPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Employee Password!',
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Enter password" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.userEmail}
                label={
                  <div>
                    Official Email{' '}
                    <Tooltip title={formHintBoxMessage.EMAIL}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="empEmail"
                rules={[
                  {
                    type: 'email',
                    required: true,
                    message: 'Please input official email',
                  },
                ]}
              >
                <Input size="large" placeholder="i.e. example@gmail.com" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.empMobileNumber}
                label={
                  <div>
                    Phone Number{' '}
                    <Tooltip title={formHintBoxMessage.PHONE_NUMBER}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="empMobileNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a valid phone number',
                    pattern: new RegExp(/^91[6789]\d{9}$/),
                  },
                ]}
              >
                <PhoneNumberInput
                  country="in"
                  phoneNumber={data?.empMobileNumber}
                  placeholder="Enter phone number"
                  onPhoneChange={handlePhoneChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Birth Date"
                name="userBirthday"
                rules={[
                  {
                    required: true,
                    message: 'Please input Birth date',
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  format={dateFormat}
                  placeholder="Select birth Date"
                  style={{ width: 220 }}
                  disabledDate={disabledAfterCurrentDate}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Join Date"
                name="empJoinDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input joining date',
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  format={dateFormat}
                  placeholder="Select joining date"
                  style={{ width: 220 }}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                initialValue={data?.empSalary}
                label="Employee Salary (Per Annum)"
                name="empSalary"
              >
                <Input size="large" placeholder="i.e. 1,20,000" style={{ width: 220 }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Department"
                name="depId"
                initialValue={data?.depId}
                rules={[
                  {
                    required: true,
                    message: 'Select department name',
                  },
                ]}
              >
                <Select
                  placeholder="Select department name"
                  options={depName}
                  size="large"
                  onChange={onChangeHandler}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={capitalizeFirstLetter(data?.userDesignation)}
                label="Designation"
                name="userDesignation"
                rules={[
                  {
                    required: true,
                    message: 'Please input designation',
                  },
                ]}
              >
                <Select placeholder="Designation" options={Designation} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {/* {showProcess && (
              <Col className="gutter-row" span={12}>
                <Form.Item
                  initialValue={data?.userProcess}
                  label="Process"
                  name="userProcess"
                  rules={[
                    {
                      required: true,
                      message: 'Select process of employee',
                    },
                  ]}
                >
                  <Select placeholder="Select process" size="large" options={EmployeeProcess} />
                </Form.Item>
              </Col>
            )} */}

            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.userRole}
                label="Employee Role"
                name="userRole"
                rules={[
                  {
                    required: true,
                    message: 'Enter employee role',
                  },
                ]}
              >
                <Select placeholder="Enter employee role" options={EmployeeType} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.empCurrentAddress}
                label="Employee Current Address"
                name="empCurrentAddress"
                rules={[
                  {
                    required: true,
                    message: 'Please enter employee current address',
                  },
                ]}
              >
                <Input.TextArea
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  placeholder="Enter current address"
                  style={{ width: 340 }}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                initialValue={data?.empPermanentAddress}
                label="Employee Permanent Address"
                name="empPermanentAddress"
                rules={[
                  {
                    required: true,
                    message: 'Please enter employee permanent address',
                  },
                ]}
              >
                <Input.TextArea
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  placeholder="Enter permanent address"
                  style={{ width: 340 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginTop: '1em' }}>
                Next
              </Button>
            </Form.Item>
          </Row>
        </Form>
      ),
    },

    {
      title: 'Edit Documents',
      content: (
        <EditDocForm
          setCurrentStep={setCurrentStep}
          handleSubmit={handleSubmit}
          initialDocValues={initialDocValues}
          numberOfDoc={numberOfDoc}
        />
      ),
    },
  ]
  return (
    <Modal
      title="Edit Employee"
      centered
      visible={showEditEmpForm}
      width={800}
      onCancel={() => setShowEditEmpForm(() => false)}
      footer={null}
    >
      <Steps current={currentStep} style={{ paddingBottom: '1rem' }}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
    </Modal>
  )
}
