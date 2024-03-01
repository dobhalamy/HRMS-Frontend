import { ArrowRightOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Space,
  Table,
  Form,
  Select,
  notification, // Button
} from 'antd'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTraineeList, handlePagination } from 'redux/allEmployee/action'
import { changeDateFormat, filterOption, onPageSizeChange } from 'utils'
import { assignTrainer } from 'services/axios/emp'
// import { traineeAssign } from 'socket'
import ViewTraineeForm from '../viewTraineeModal'
import EditTraineeForm from '../editTraineeForm'
import HandoverTraineeForm from '../handOverModal'
import EditEmpModal from '../editEmpModal'
// import AddRetrainingForm from '../../retraining/addRetrainingForm'

// add empDetails in EmpTable
const EmpTable = ({ empDetails, totalCount, handlePageChange, searchEmployee }) => {
  const { userRole } = useSelector((state) => state?.user?.userInfo)
  const [empData, setEmpData] = useState({})
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const [showTraineeAssignTo, setShowTraineeAssignTo] = useState(false)
  const [showEditTraineeForm, setShowEditTraineeForm] = useState(false)
  const [showViewTraineeModal, setShowViewTraineeModal] = useState(false)
  const [showHandoverTraineeModal, setShowHandoverTraineeModal] = useState(false)
  // const [showRetrainingForm, setShowRetrainingForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const handleEmployeeChange = async (value) => {
    const { id, userId } = value
    if (userId) {
      // eslint-disable-next-line no-alert
      const confirmSubmit = window.confirm('Are you sure you want to assign trainer?')
      if (confirmSubmit) {
        const res = await assignTrainer({ id, userId })
        if (res && res.status === 200) {
          // socket.emit('agentAssign', res?.data?.data)
          // traineeAssign(res, getLoggedInUserInfo?.userId)
          dispatch(getTraineeList({ skip, limit, employeeName: searchEmployee || null }))
          notification.success({
            message: 'Success',
            description:
              'Trainer assign successfully, this trainee is now visible on trainer portal.',
          })
        }
      }
    }
  }

  const columns = [
    {
      title: 'Trainee Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userPersonalEmail',
      key: 'Email',
    },
    {
      title: 'Joining Date',
      dataIndex: 'traineeJoiningDate',
      key: 'traineeJoiningDate',
      width: 120,
      render: (_, record) => `${changeDateFormat(record?.Trainee?.traineeJoiningDate)}`,
    },
    {
      title: 'Training Handover Date',
      dataIndex: 'trainingHandoverDate',
      key: 'trainingHandoverDate',
      width: 200,
      render: (_, record) =>
        `${
          record?.Trainee?.trainingHandoverDate
            ? changeDateFormat(record?.Trainee?.trainingHandoverDate)
            : 'Assign a trainer!'
        }`,
    },
    {
      title: 'Trainer',
      dataIndex: 'trainerId',
      key: 'trainerId',
      width: 180,
      render: (_, record) => (
        <Form.Item
          style={{ margin: '0' }}
          name="trainerId"
          initialValue={record?.Trainee?.trainerId}
          rules={[
            {
              required: true,
              message: 'Please Select Trainer!',
            },
          ]}
        >
          <Select
            showSearch
            defaultValue={
              record?.Trainee?.trainerId && record?.trainerList.length > 0
                ? record?.Trainee?.trainerId
                : undefined
            }
            placeholder="Select Trainer"
            filterOption={filterOption}
            onChange={(value) => handleEmployeeChange({ id: record?.Trainee?.id, userId: value })}
            id="assignTrainer"
          >
            {record?.trainerList.map((item) => (
              <option key={item.userId} value={item.userId}>
                {item.userName}
              </option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>
            <EyeOutlined
              title="View Trainee"
              style={{ fontSize: '16px' }}
              onClick={() => {
                setEmpData(record)
                setShowViewTraineeModal(true)
              }}
              id="viewTrainee"
            />
          </a>
          {userRole === 'manager' && record?.Trainee?.status !== 3 && (
            <a>
              <EditOutlined
                style={{ fontSize: '16px' }}
                onClick={() => {
                  setEmpData(record)
                  setShowTraineeAssignTo(true)
                }}
                id="assignM"
              />
            </a>
          )}
          {/* {userRole === 'hod' && record?.Trainee?.status === 3 && (
            <Button
              type="primary"
              onClick={() => {
                setAgentData(record)
                setShowRetrainingForm(true)
              }}
              loading={loading}
              size="middle"
            >
              Retraining
            </Button>
          )}
          {showRetrainingForm && (
            <AddRetrainingForm
              agentData={agentData}
              showRetrainingForm={showRetrainingForm}
              setShowRetrainingForm={setShowRetrainingForm}
            />
          )} */}
          {userRole === 'trainer' && (
            <a>
              <EditOutlined
                title="Edit Trainee"
                style={{ fontSize: '16px' }}
                onClick={() => {
                  setEmpData(record)
                  setShowEditTraineeForm(true)
                }}
                id="editTrainee"
              />
            </a>
          )}
          {userRole === 'trainer' &&
            (record?.Trainee?.certificationStatus === 'certified' ||
              record?.Trainee?.reCertificationStatus === 'certified') &&
            record?.Trainee?.trainingEndDate < new Date().toISOString().slice(0, 10) && (
              <a>
                <ArrowRightOutlined
                  title="Hand Over to OPS"
                  style={{ fontSize: '16px' }}
                  onClick={() => {
                    setEmpData(record)
                    setShowHandoverTraineeModal(true)
                  }}
                  id="handoverToPO"
                />
              </a>
            )}
        </Space>
      ),
    },
  ]
  let showTrainerColumn = true // Set your condition here

  // Condition to show/hide columns
  if (userRole !== 'hr') {
    showTrainerColumn = false // Set your condition here
  }

  // Filter the columns based on the condition
  const filteredColumns = columns.filter((column) => {
    if (column.key === 'trainerId') {
      return showTrainerColumn
    }
    return true // Include all other columns
  })

  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }
  return (
    <>
      <Table
        dataSource={empDetails}
        rowKey="userPersonalEmail"
        columns={filteredColumns}
        pagination={{
          defaultPageSize: oldPageSize,
          current: parseInt(currentPage, 10),
          total: totalCount,
          responsive: true,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          locale: { items_per_page: '' },
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 900, y: 450 }}
      />
      {showEditTraineeForm && (
        <EditTraineeForm
          showEditTraineeForm={showEditTraineeForm}
          setShowEditTraineeForm={setShowEditTraineeForm}
          loading={loading}
          data={empData}
          setLoading={setLoading}
          searchEmployee={searchEmployee}
        />
      )}

      {showViewTraineeModal && (
        <ViewTraineeForm
          showViewTraineeModal={showViewTraineeModal}
          setShowViewTraineeModal={setShowViewTraineeModal}
          loading={loading}
          data={empData}
          setLoading={setLoading}
        />
      )}
      {showTraineeAssignTo && (
        <EditEmpModal
          empData={empData}
          showTraineeAssignTo={showTraineeAssignTo}
          setShowTraineeAssignTo={setShowTraineeAssignTo}
          searchEmployee={searchEmployee}
        />
      )}
      {showHandoverTraineeModal && (
        <HandoverTraineeForm
          showHandoverTraineeModal={showHandoverTraineeModal}
          setShowHandoverTraineeModal={setShowHandoverTraineeModal}
          loading={loading}
          data={empData}
          setLoading={setLoading}
          searchEmployee={searchEmployee}
        />
      )}
    </>
  )
}
export default EmpTable
