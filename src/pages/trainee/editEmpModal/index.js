import React, { useCallback, useEffect } from 'react'
import { Modal, Form, Row, Col, Button, Select, notification, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateTraineeData, updateEmployeeData } from 'services/axios/emp'
import { getTraineeList, getEmpDesignation, getEmpRole, getDep } from 'redux/allEmployee/action'

// import { capitalizeFirstLetter } from '../../../utils/index'

const EditEmpModal = ({ empData, showTraineeAssignTo, setShowTraineeAssignTo, searchEmployee }) => {
  const [form] = Form.useForm()
  const department = useSelector((state) => state?.toggle?.department)
  const Designations = useSelector((state) => state.toggle.empDesignation)
  const role = useSelector((state) => state?.toggle?.empRole)

  const loading = useSelector((state) => state?.toggle?.loading)
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const EmployeeType = role?.map((item) => {
    return {
      label: item?.GlobalType?.displayName,
      value: item?.globalTypeId,
    }
  })
  const Designation = Designations?.map((item) => {
    return {
      label: item?.displayName,
      value: item?.uniqueValue,
    }
  })
  const depName = department?.map((item) => {
    return {
      label: item?.displayName,
      value: item?.id,
    }
  })
  const dispatch = useDispatch()

  const onFinishHandler = async (values) => {
    const { userId } = empData
    const updatedEmp = await updateEmployeeData({ ...values, userId })
    if (updatedEmp?.status === 200 && updatedEmp?.data?.status) {
      const traineeDetail = empData.Trainee
      const updateData = { ...traineeDetail, status: 3 }
      const response = await updateTraineeData(updateData)
      if (response?.data?.status && response?.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Training completed',
        })
        setShowTraineeAssignTo(() => false)
        dispatch(getTraineeList({ skip, limit, employeeName: searchEmployee || null }))
      }
    }
  }
  const onChangeHandler = (value) => {
    dispatch(getEmpRole(value))
  }
  const getDesignation = useCallback(async () => {
    dispatch(getEmpDesignation())
  }, [dispatch])

  const getDepartment = useCallback(async () => {
    dispatch(getDep())
  }, [dispatch])
  useEffect(() => {
    getDesignation()
    getDepartment()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDesignation, getDepartment])
  return (
    <Modal
      title="Update Trainee"
      centered
      visible={showTraineeAssignTo}
      width={800}
      onCancel={() => setShowTraineeAssignTo(() => false)}
      footer={[
        <Button key="back" onClick={() => setShowTraineeAssignTo(() => false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          form="update trainee"
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        name="update trainee"
        style={{
          padding: '2rem',
        }}
        layout="vertical"
        form={form}
        onFinish={onFinishHandler}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              initialValue={empData?.userName}
              label="Employee Name"
              name="userName"
              rules={[
                {
                  required: true,
                  message: 'Please input employee name',
                },
              ]}
            >
              <Input size="large" disabled />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label="Department"
              name="depId"
              //   initialValue={data?.depId}
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
          <Col className="gutter-row" span={6}>
            <Form.Item
              // initialValue={capitalizeFirstLetter(data?.userDesignation)}
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
          <Col className="gutter-row" span={6}>
            <Form.Item
              //   initialValue={data?.userRole}
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
      </Form>
    </Modal>
  )
}

export default EditEmpModal
