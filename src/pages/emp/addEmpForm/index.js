import React, { useEffect, useState, memo, useCallback } from 'react'
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
  Checkbox,
  Steps,
  Space,
  message,
  Upload,
  Tooltip,
} from 'antd'
import { addNewEmployee } from 'services/axios/emp'
import { filterOption, formHintBoxMessage } from 'utils'
import { uploadDocument } from 'services/axios/media'
import { getNestedGlobalType } from 'services/axios/config'
import {
  getEmployeeList,
  getEmpDesignation,
  getDep,
  getDocumentType,
} from 'redux/allEmployee/action'
import { useDispatch, useSelector } from 'react-redux'
import PhoneNumberInput from 'components/phoneNumberInput'
import {
  CloseCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import style from './style.module.scss'

const AddEmployeeForm = ({ showEmpForm, setShowEmpForm, newEmpId }) => {
  const dateFormat = 'DD/MM/YYYY'
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { Step } = Steps
  const [userRole, setUserRole] = useState([])
  // const [userProcess, setUserProcess] = useState([])
  const [showSubmitButton, setShowSubmitButton] = useState(false)
  const [addedEmpInfo, setAddedEmpInfo] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCheckBoxDisabled, setCheckBoxDisabled] = useState(true)
  const [initialValues, setInitialValues] = useState({
    empID: newEmpId,
    empPermanentAddress: null,
  })
  const Designations = useSelector((state) => state.toggle.empDesignation)
  const department = useSelector((state) => state?.toggle?.department)
  const docType = useSelector((state) => state?.toggle?.docType)
  const numberOfDoc = docType?.length
  const employeeDesignations = Designations?.map((item) => {
    return {
      label: item?.displayName,
      value: item?.displayName,
    }
  })
  const employeeRoles = userRole?.map((item) => {
    return {
      label: item?.GlobalType?.displayName,
      value: item?.globalTypeId,
    }
  })
  // const employeeProcess = userProcess?.map((process) => {
  //   return {
  //     label: process?.GlobalType?.displayName,
  //     value: process?.globalTypeId,
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
  const getDepartment = useCallback(async () => {
    dispatch(getDep())
  }, [dispatch])

  const getDocType = useCallback(async () => {
    dispatch(getDocumentType())
  }, [dispatch])

  useEffect(() => {
    getDesignation()
    getDepartment()
    getDocType()
  }, [getDesignation, getDepartment, getDocType])

  const onFinish = async (values) => {
    setAddedEmpInfo(values)
    setCurrentStep(currentStep + 1)
  }
  const onFinishFailed = (error) => {
    notification.error({
      message: 'Error',
      description: error?.errorFields[0]?.errors[0],
    })
  }
  const onCheckBoxChange = (e) => {
    const isChecked = e.target.checked
    if (isChecked) {
      const currentAddress = form.getFieldValue('empCurrentAddress')
      form.setFieldsValue({
        empPermanentAddress: currentAddress,
      })
      setInitialValues((pre) => ({
        ...pre,
        empPermanentAddress: currentAddress,
      }))
    } else {
      form.setFieldsValue({
        empPermanentAddress: null,
      })
      setInitialValues((pre) => ({
        ...pre,
        empPermanentAddress: null,
      }))
    }
  }
  const handleCurrentAddressChange = (e) => {
    const currentAddress = e?.target.value

    if (currentAddress === '') {
      setCheckBoxDisabled(() => true)
    } else if (currentAddress?.length === 1 && isCheckBoxDisabled) {
      setCheckBoxDisabled(() => false)
    }
  }
  const handlePhoneChange = (phone) => {
    form.setFieldsValue({ empMobileNumber: phone.trim() })
    form.validateFields(['empMobileNumber'])
  }

  const disabledAfterCurrentDate = (current) => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    return current && current.valueOf() > currentDate.valueOf()
  }

  const handleSubmit = async (values) => {
    try {
      let isDocumentValid = false
      const empId = addedEmpInfo?.empID
      const mediaTypes = new Set() // Set to store unique media types
      values?.documents?.forEach((item) => {
        if (item.document !== undefined) {
          if (mediaTypes.has(item.mediaType)) {
            throw new Error('Same document type')
          }
          mediaTypes.add(item?.mediaType)
          isDocumentValid = true
          if (item.document.file.type !== 'application/pdf') {
            throw new Error('Only PDF files are allowed.')
          }
        }
      })
      if (isDocumentValid) {
        const addedEmp = await addNewEmployee(addedEmpInfo)
        if (addedEmp?.data?.status && addedEmp?.data?.statusCode === 200) {
          notification.success({
            message: 'Success',
            description: 'Employee added successfully',
          })
          for (let i = 0; i < values?.documents?.length; i += 1) {
            const formData = new FormData()
            const { mediaType } = values?.documents[i]
            formData.append('empId', empId)
            formData.append('mediaType', mediaType)
            formData.append('file', values?.documents[i]?.document?.file)
            // eslint-disable-next-line no-await-in-loop
            const addedDocumet = await uploadDocument(formData)
            if (addedDocumet?.status === 200 && addedDocumet?.data?.statusCode === 200) {
              dispatch(getEmployeeList({ skip: 0, limit: 10 }))
              form.resetFields()
              setShowSubmitButton(false)
              setShowEmpForm(() => false)
              setAddedEmpInfo(null)
            }
          }
        } else {
          setCurrentStep(0)
        }
      } else {
        notification.error({
          message: 'Error',
          description: 'Document is not valid',
        })
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error?.message,
      })
    }
  }
  const onChangeHandler = async (value) => {
    const role = await getNestedGlobalType(value, 'user_role')
    setUserRole(role?.data?.data)
    // const process = await getNestedGlobalType(value, 'process')
    // setUserProcess(process?.data?.data)
  }

  const fileProps = {
    accept: ['.pdf', '.jpg', '.jpeg', 'png'],
    name: 'file',
    beforeUpload: (file) => {
      const isSizeValid = file.size / 1024 / 1024 < 1 // Check if file size is less than 1 MB
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        return false
      }

      if (!isSizeValid) {
        message.error('File size must be less than 1 MB.')
      }
      if (isSizeValid) {
        message.success('File added')
      }
      return false // Prevent automatic upload
    },
  }

  const steps = [
    {
      title: 'Add Employee Details',
      content: (
        <Form
          name="addEmployee"
          style={{
            padding: '2rem',
          }}
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
                label="Employee ID"
                name="empID"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Employee Id',
                  },
                ]}
              >
                <Input size="large" placeholder="Enter employee Id" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label={
                  <div>
                    Employee Name{' '}
                    <Tooltip title={formHintBoxMessage.NAME}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="empName"
                rules={[
                  {
                    required: true,
                    message: 'Please input Employee Name',
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
                label={
                  <div>
                    Personal Email{' '}
                    <Tooltip title={formHintBoxMessage.EMAIL}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="empPersonalEmail"
              >
                <Input size="large" placeholder="i.e. example@gmail.com" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label={
                  <div>
                    Password{' '}
                    <Tooltip title={formHintBoxMessage.PASSWORD}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                name="empPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Employee Password!',
                  },
                  {
                    min: 6, // Minimum password length
                    message: 'Password must be at least 6 characters long.',
                  },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, // Password complexity regex
                    message:
                      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Enter password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <Form.Item
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
                    message: 'Please enter a valid Phone Number',
                    pattern: new RegExp(/^91[6789]\d{9}$/),
                  },
                ]}
              >
                <PhoneNumberInput
                  country="in"
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
                name="empDob"
                rules={[
                  {
                    required: true,
                    message: 'Please input Birth date',
                  },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  placeholder="Select date of birth"
                  size="large"
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
                  format={dateFormat}
                  placeholder="Select joining date"
                  size="large"
                  style={{ width: 220 }}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Employee Salary (Per Annum)"
                name="empSal"
                rules={[
                  {
                    required: false,
                    message: 'Please enter salary!',
                  },
                ]}
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
                label="Designation"
                name="empDesignation"
                rules={[
                  {
                    required: true,
                    message: 'Please enter designation',
                  },
                ]}
              >
                <Select placeholder="Designation" options={employeeDesignations} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {/* {employeeProcess?.length !== 0 && (
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Process"
                  name="userProcess"
                  rules={[
                    {
                      required: true,
                      message: 'Select process of employee',
                    },
                  ]}
                >
                  <Select placeholder="Select process" size="large" options={employeeProcess} />
                </Form.Item>
              </Col>
            )} */}
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Employee Role"
                name="userRole"
                rules={[
                  {
                    required: true,
                    message: 'Select employee role',
                  },
                ]}
              >
                <Select placeholder="Select employee role" options={employeeRoles} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Form.Item
              label="Employee Current Address"
              name="empCurrentAddress"
              style={{ marginBottom: '1rem', width: '100%' }}
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
                onChange={handleCurrentAddressChange}
              />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Checkbox
              className={style?.squareCheckbox}
              onChange={onCheckBoxChange}
              disabled={isCheckBoxDisabled}
            >
              Same as current address{' '}
            </Checkbox>
          </Row>
          <Row gutter={16}>
            <Form.Item
              label="Employee Permanent Address"
              name="empPermanentAddress"
              style={{ marginBottom: 0, marginTop: '1rem', width: '100%' }}
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
                disabled={initialValues?.empPermanentAddress !== null}
              />
            </Form.Item>
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
      title: 'Upload Documents',
      content: (
        <Form onFinish={handleSubmit}>
          <Form.List name="documents">
            {(fields, { add, remove }) => (
              <>
                {fields?.length > 0 &&
                  fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline">
                      <Form.Item
                        {...restField}
                        label="Document Type"
                        name={[name, 'mediaType']}
                        rules={[
                          {
                            required: true,
                            message: 'Enter document type',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select document type"
                          filterOption={filterOption}
                          showSearch
                          allowClear
                          size="middle"
                          style={{
                            width: 200,
                          }}
                        >
                          {docType?.map((doc) => (
                            <Select.Option key={doc?.id} value={doc?.displayName}>
                              {doc?.displayName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'document']}
                        rules={[
                          {
                            required: true,
                            message: 'Enter document type',
                          },
                        ]}
                      >
                        <Upload {...fileProps} multiple={false}>
                          <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                      </Form.Item>
                      <CloseCircleOutlined
                        style={{ color: 'red', fontSize: '1rem' }}
                        onClick={() => {
                          remove(name)
                          if (fields?.length === 1) {
                            setShowSubmitButton(false)
                          }
                        }}
                      />
                    </Space>
                  ))}

                <Form.Item>
                  {fields?.length < numberOfDoc && (
                    <Button
                      type="dashed"
                      onClick={() => {
                        add()
                        setShowSubmitButton(true)
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Document
                    </Button>
                  )}
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button
              type="primary"
              style={{ marginRight: '0.5em' }}
              onClick={() => setCurrentStep(0)}
            >
              Back
            </Button>
            {showSubmitButton && (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div>
      <Modal
        title="Add Employee"
        centered
        visible={showEmpForm}
        width={900}
        onCancel={() => setShowEmpForm(() => false)}
        footer={null}
      >
        <Steps current={currentStep} style={{ paddingBottom: '1rem' }}>
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[currentStep].content}</div>
      </Modal>
    </div>
  )
}
export default memo(AddEmployeeForm, () => true)
