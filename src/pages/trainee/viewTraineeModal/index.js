import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Tag, Select, Table } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getTraineeHistory } from 'redux/allEmployee/action'
import { changeDateFormat, getStatusLabel } from 'utils'
import style from './style.module.scss'

const ViewTraineeForm = ({
  TraineeHistory,
  showViewTraineeModal,
  setShowViewTraineeModal,
  data,
}) => {
  const { skip, limit } = useSelector((state) => state?.toggle?.pagination)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTraineeHistory({ skip, limit, userId: data?.Trainee?.userId || null }))
  }, [data?.Trainee?.userId, dispatch, limit, skip])

  const getDistinctObjects = (array, key) => {
    const groupedArrays = []
    const seen = new Set()

    array?.forEach((obj) => {
      const value = obj[key]

      if (!seen.has(value)) {
        seen.add(value)
        groupedArrays.push(array.filter((item) => item[key] === value))
      }
    })
    return groupedArrays
  }

  const newArr = getDistinctObjects(TraineeHistory?.traineeHistory, 'startDate')
  const [selectedTraining, setSelectedTraining] = useState(null)

  const columns = [
    {
      title: 'Attempt',
      dataIndex: 'attempt',
      key: 'attempt',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Certification Date',
      dataIndex: 'certificationDate',
      key: 'certificationDate',
      render: (_, record) => changeDateFormat(record?.certificationDate),
    },
    {
      title: 'Certification Status',
      dataIndex: 'certificationStatus',
      key: 'certificationStatus',
      render: (_, record) => {
        return record?.certificationStatus === 'certified' ? (
          <Tag color="green">Certified</Tag>
        ) : (
          <Tag color="red">Re-Certified</Tag>
        )
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (_, record) => changeDateFormat(record?.createdAt),
    },
  ]

  // const { color: color1, displayStatus: displayStatus1 } = getStatusLabel(
  //   data?.Trainee?.certificationStatus
  // )

  // const certificateStatusTag = <Tag color={color1}>{displayStatus1}</Tag>

  const { color, displayStatus } = getStatusLabel(data?.Trainee?.reCertificationStatus)
  const reCertificateStatusTag = <Tag color={color}>{displayStatus}</Tag>

  const onChangeHandler = (value) => {
    if (value) {
      setSelectedTraining(value)
    } else {
      setSelectedTraining(null)
    }
  }
  let trainingHandoverDate
  if (newArr.length > 1) {
    trainingHandoverDate = selectedTraining
      ? changeDateFormat(newArr[selectedTraining][0]?.trainingHandoverDate)
      : newArr[newArr?.length - 1][0]?.trainingHandoverDate
  } else {
    trainingHandoverDate = data?.Trainee?.trainingHandoverDate
      ? changeDateFormat(data?.Trainee?.trainingHandoverDate)
      : 'N/A'
  }

  let trainingStartDate
  if (newArr.length > 1) {
    trainingStartDate = selectedTraining
      ? changeDateFormat(newArr[selectedTraining][0]?.startDate)
      : newArr[newArr?.length - 1][0]?.startDate
  } else {
    trainingStartDate = data?.Trainee?.trainingStartDate
      ? changeDateFormat(data?.Trainee?.trainingStartDate)
      : 'N/A'
  }

  let trainingEndDate
  if (newArr.length > 1) {
    trainingEndDate = selectedTraining
      ? changeDateFormat(newArr[selectedTraining][0]?.endDate)
      : newArr[newArr?.length - 1][0]?.endDate
  } else {
    trainingEndDate = data?.Trainee?.trainingEndDate
      ? changeDateFormat(data?.Trainee?.trainingEndDate)
      : 'N/A'
  }

  let certificationDate
  if (newArr.length > 1) {
    certificationDate = selectedTraining
      ? changeDateFormat(newArr[selectedTraining][0]?.certificationDate)
      : newArr[newArr?.length - 1][0]?.certificationDate
  } else {
    certificationDate = data?.Trainee?.certificationDate
      ? changeDateFormat(data?.Trainee?.certificationDate)
      : 'N/A'
  }

  let certificationHistory
  if (TraineeHistory?.totalCount >= 1) {
    certificationHistory = selectedTraining ? newArr[selectedTraining] : newArr[newArr?.length - 1]
  } else {
    certificationHistory = TraineeHistory?.traineeHistory
  }

  let certificateStatusTag
  if (newArr.length >= 1) {
    const trainingIndex = selectedTraining || newArr.length - 1
    const certificationStatus = newArr[trainingIndex][0]?.certificationStatus
    const { color: color1, displayStatus: displayStatus1 } = getStatusLabel(certificationStatus)
    certificateStatusTag = <Tag color={color1}>{displayStatus1}</Tag>
  }
  // const certificationHistory = AgentHistory?.totalCount > 1
  // ? (selectedTraining && newArr[selectedTraining])
  // : AgentHistory?.agentHistory
  return (
    <Modal
      title="View Trainee Details"
      centered
      visible={showViewTraineeModal}
      width={800}
      onCancel={() => setShowViewTraineeModal(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowViewTraineeModal(() => false)}>
          Cancel
        </Button>,
      ]}
    >
      <Row className={`${style}`} style={{ gap: '1rem', marginBottom: '1rem' }}>
        <Col flex="1 0 50%">
          {TraineeHistory?.totalCount > 1 && (
            <Select
              allowClear
              style={{
                width: 250,
              }}
              size="large"
              placeholder="Status"
              defaultActiveFirstOption
              onChange={onChangeHandler}
            >
              {newArr &&
                newArr?.map(({ uniqueValue }, index) =>
                  index > 0 ? (
                    <Select.Option value={uniqueValue} key={`${index}`}>
                      Retraining {index}
                    </Select.Option>
                  ) : (
                    <Select.Option value={uniqueValue} key={`${index}`}>
                      Training
                    </Select.Option>
                  ),
                )}
            </Select>
          )}
        </Col>
      </Row>
      <Row className="row" style={{ gap: '2rem', marginBottom: '1rem' }}>
        <Col flex="1 0 25%">
          <b> Employee Name : </b>
          {data?.userName}
        </Col>
        <Col flex="1 0 25%">
          <b>Joining Date : </b>
          {changeDateFormat(data?.Trainee?.traineeJoiningDate)}
        </Col>
        <Col flex="1 0 25%">
          <b>Training Handover: </b>
          {trainingHandoverDate}
        </Col>
      </Row>
      <Row className="row" style={{ gap: '2rem', marginBottom: '1rem' }}>
        <Col flex="1 0 25%">
          <b> Training Start Date : </b>
          {trainingStartDate}
        </Col>
        <Col flex="1 0 25%">
          <b>Training End Date : </b>
          {trainingEndDate}
        </Col>
        <Col flex="1 0 25%">
          <b>Certification Date : </b>
          {certificationDate}
        </Col>
      </Row>
      <Row className="row" style={{ gap: '2rem', marginBottom: '1rem' }}>
        <Col flex="1 0 25%">
          <b> Certification Status : </b>
          {/* {data?.Trainee?.certificationStatus ? certificateStatusTag : 'N/A'} */}
          {certificateStatusTag || 'N/A'}
        </Col>
        {data?.Trainee?.certificationStatus === 're_certified' && (
          <>
            <Col flex="1 0 25%">
              <b>Re-Certification Date : </b>
              {data?.Trainee?.reCertificationDate
                ? changeDateFormat(data?.Trainee?.reCertificationDate)
                : 'N/A'}
            </Col>
            <Col flex="1 0 25%">
              <b> Re-Certification Status : </b>
              {data?.Trainee?.reCertificationStatus ? reCertificateStatusTag : 'N/A'}
            </Col>
          </>
        )}
      </Row>
      {TraineeHistory?.totalCount >= 1 && (
        <>
          <Row className="row" style={{ gap: '1rem', marginBottom: '1rem', marginTop: '2rem' }}>
            <Col flex="1 0 70%">
              <h5>Certification History</h5> <hr />
            </Col>
            <h5>
              Attempts: <span>{TraineeHistory?.totalCount}</span> <hr />
            </h5>
          </Row>
          <Table
            dataSource={certificationHistory}
            rowKey="traineeHistoryInfo"
            columns={columns}
            pagination={false}
            scroll={{ y: 150 }}
          />
        </>
      )}
    </Modal>
  )
}
const mapStateToProps = ({ toggle, dispatch }) => ({
  TraineeHistory: toggle?.traineeHistory,
  dispatch,
})
export default connect(mapStateToProps)(ViewTraineeForm)
