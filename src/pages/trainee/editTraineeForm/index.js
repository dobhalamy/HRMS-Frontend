import React, { useEffect, useState } from 'react'
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  notification,
  Button,
  DatePicker,
  Select,
  Tooltip,
} from 'antd'
import moment from 'moment'
import { updateTraineeData } from 'services/axios/emp'
import { getTraineeList } from 'redux/allEmployee/action'
import { connect, useSelector } from 'react-redux'
import { DateFormater, filterOption, formHintBoxMessage } from 'utils'
import { fetchMasterGTData } from 'redux/globalType/actions'
import { InfoCircleOutlined } from '@ant-design/icons'

const EditTraineeForm = ({
  showEditTraineeForm,
  setShowEditTraineeForm,
  data,
  masterGlobalTypeData,
  searchEmployee,
  dispatch,
}) => {
  const [form] = Form.useForm()

  const loading = useSelector((state) => state?.toggle?.loading)
  const { skip, limit } = useSelector((state) => state.toggle.pagination)

  const initialValues = {
    empJoinDate: moment(data?.Trainee?.traineeJoiningDate),
    trainingStartDate: data?.Trainee?.trainingStartDate
      ? moment(data.Trainee.trainingStartDate)
      : '',
    trainingEndDate: data?.Trainee?.trainingEndDate ? moment(data.Trainee.trainingEndDate) : '',
    certificationDate: data?.Trainee?.certificationDate
      ? moment(data.Trainee.certificationDate)
      : '',
    certificationStatus: data?.Trainee?.certificationStatus,
    reCertificationDate: data?.Trainee?.reCertificationDate
      ? moment(data.Trainee.reCertificationDate)
      : '',
    reCertificationStatus: data?.Trainee?.reCertificationStatus,
    remember: true,
  }
  const [startDate, setStartDate] = useState(data?.Trainee?.trainingStartDate)
  const [endDate, setEndDate] = useState(data?.Trainee?.trainingEndDate)

  const onFinish = async (values) => {
    values.userId = data?.Trainee?.userId
    values.trainingStartDate = DateFormater(values?.trainingStartDate)
    values.trainingEndDate = DateFormater(values?.trainingEndDate)
    if (values?.certificationDate) {
      values.certificationDate = DateFormater(values?.certificationDate)
    }
    if (values?.reCertificationDate) {
      values.reCertificationDate = DateFormater(values?.reCertificationDate)
    }
    const response = await updateTraineeData({ ...data, ...values })
    if (response?.data?.status && response?.status === 200) {
      notification.success({
        message: 'Success',
        description: 'Trainee updated successfully',
      })
      setShowEditTraineeForm(() => false)
      dispatch(getTraineeList({ skip, limit, employeeName: searchEmployee || null }))
    }
  }
  const onFinishFailed = () => {
    notification.error({
      message: 'Failed',
    })
  }
  useEffect(() => {
    dispatch(fetchMasterGTData('training_certification_status'))
  }, [dispatch])

  const handleStartDateChange = (date) => {
    if (date) {
      setStartDate(date)
      const endTrainingDate = moment(date, 'YYYY-mm-dd').add(15, 'days')

      const endTrainingDateUTC = moment(endTrainingDate).format('YYYY-MM-DD')
      const momentDate = moment(endTrainingDateUTC, 'YYYY-MM-DD')

      form.setFieldsValue({ trainingEndDate: momentDate })
    }
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
  }
  const disabledBeforeJoinDate = (current) => {
    return current && current < moment(data?.Trainee?.traineeJoiningDate).endOf('day')
  }
  const disabledBeforeStartDate = (current) => {
    return current && current < moment(startDate).endOf('day')
  }
  const disabledBeforeEndDate = (current) => {
    return current && current < moment(endDate).endOf('day')
  }

  return (
    <Modal
      title="Update Trainee"
      centered
      visible={showEditTraineeForm}
      width={800}
      onCancel={() => setShowEditTraineeForm(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowEditTraineeForm(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="updateTrainee"
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        name="updateTrainee"
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
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 45%">
            <Form.Item
              initialValue={data?.userName}
              label="Employee Name"
              name="userName"
              rules={[
                {
                  required: true,
                  message: 'Please input employee name',
                },
              ]}
            >
              <Input size="large" placeholder="Enter employee name" disabled />
            </Form.Item>
          </Col>
          <Col flex="1 0 45%">
            <Form.Item
              label="Joining Date"
              name="empJoinDate"
              rules={[
                {
                  required: true,
                  message: 'Please input joining date!',
                },
              ]}
            >
              <DatePicker disabled size="large" placeholder="Enter joining date" />
            </Form.Item>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 45%">
            <Form.Item
              label="Training Start Date"
              name="trainingStartDate"
              rules={[
                {
                  required: true,
                  message: 'Please select start date!',
                },
              ]}
            >
              <DatePicker
                disabled={
                  data?.Trainee?.certificationStatus === 'certified' ||
                  // data?.Trainee?.reCertificationStatus === 'certified' ||
                  data?.Trainee?.certificationDate !== null
                    ? 'disabled'
                    : ''
                }
                value={startDate}
                onChange={handleStartDateChange}
                size="large"
                placeholder="Enter start date"
                disabledDate={disabledBeforeJoinDate}
                picker="date"
              />
            </Form.Item>
          </Col>
          <Col flex="1 0 45%">
            <Form.Item
              label={
                <div>
                  Training End Date{' '}
                  <Tooltip title={formHintBoxMessage.TRAINING_END_DATE} style={{ display: 'auto' }}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              }
              name="trainingEndDate"
              rules={[
                {
                  required: true,
                  message: 'Please select end date!',
                },
              ]}
            >
              <DatePicker
                disabled={
                  data?.Trainee?.certificationStatus === 'certified' ||
                  // data?.Trainee?.reCertificationStatus === 'certified' ||
                  startDate === null ||
                  data?.Trainee?.certificationDate !== null
                    ? 'disabled'
                    : ''
                }
                size="large"
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="Enter end date"
                picker="date"
                disabledDate={disabledBeforeStartDate}
              />
            </Form.Item>
          </Col>
        </Row>
        {(data?.Trainee?.certificationStatus === 'certified' ||
          data?.Trainee?.trainingEndDate < new Date().toISOString().slice(0, 10)) && (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 45%">
              <Form.Item label="Certification Date" name="certificationDate">
                <DatePicker
                  disabled={data?.Trainee?.certificationStatus ? 'disabled' : ''}
                  size="large"
                  disabledDate={disabledBeforeEndDate}
                  placeholder="Enter certification date"
                />
              </Form.Item>
            </Col>
            <Col flex="1 0 45%">
              <Form.Item
                label="Certification Status"
                name="certificationStatus"
                className="certificateStatus"
              >
                <Select
                  showSearch
                  placeholder="Select Certification Status"
                  filterOption={filterOption}
                  disabled={data?.Trainee?.certificationStatus ? 'disabled' : ''}
                  // onChange={handleLeaveTypeFilter}
                  allowClear
                >
                  {masterGlobalTypeData?.map((item) => (
                    <option key={item.id} value={item.uniqueValue}>
                      {item.displayName}
                    </option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}
        {data?.Trainee?.certificationStatus === 're_certified' && (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 45%">
              <Form.Item label="Re-Certification Date" name="reCertificationDate">
                <DatePicker
                  disabled={data?.Trainee?.reCertificationStatus === 'certified' ? 'disabled' : ''}
                  size="large"
                  disabledDate={disabledBeforeEndDate}
                  placeholder="Enter re-certification date"
                />
              </Form.Item>
            </Col>
            <Col flex="1 0 45%">
              <Form.Item
                label="Re-Certification Status"
                name="reCertificationStatus"
                className="certificateStatus"
              >
                <Select
                  showSearch
                  placeholder="Search Leave Type"
                  filterOption={filterOption}
                  // onChange={handleLeaveTypeFilter}
                  allowClear
                  disabled={data?.Trainee?.reCertificationStatus === 'certified' ? 'disabled' : ''}
                >
                  {masterGlobalTypeData?.map((item) => (
                    <option key={item.id} value={item.uniqueValue}>
                      {item.displayName}
                    </option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  )
}
const mapStateToProps = ({ fetchMasterGlobalTypeData, dispatch }) => ({
  masterGlobalTypeData: fetchMasterGlobalTypeData?.data?.data,
  dispatch,
})
export default connect(mapStateToProps)(EditTraineeForm)
