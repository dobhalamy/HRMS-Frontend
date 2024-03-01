import React, { useEffect, useCallback } from 'react'
import { Button, Col, Row, Form, Input, Modal, Card, Select, notification } from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { filterOption } from 'utils'
import { useSelector, useDispatch } from 'react-redux'
import { getEmployeeList } from 'redux/employeeDsr/action'
import { getEmployeeProjectRole, getAllProjectInfo } from 'redux/projectInfo/action'
import { assignEmployee } from 'services/axios/projectManagement'

const AssignDeveloper = ({ projectData, showAssignModal, setShowAssignModal }) => {
  const { employee } = useSelector((state) => state?.toggle?.empList)
  const projectRole = useSelector((state) => state?.projectInfo?.employeeProjectRole)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const initialValuesForDevelopers = projectData.developers.map((developer) => ({
    assignDeveloper: developer.Employee.userName,
    employeeProjectRole: developer.employeeProjectRole,
  }))
  useEffect(() => {
    dispatch(getEmployeeList({ skip: 0, limit: 100 }))
  }, [dispatch])

  const handleCloseModal = () => {
    setShowAssignModal(false)
  }

  const getProjectRole = useCallback(async () => {
    dispatch(getEmployeeProjectRole())
  }, [dispatch])

  useEffect(() => {
    getProjectRole()
  }, [getProjectRole])

  const handleFormSubmit = async (values) => {
    const res = await assignEmployee(values)
    if (res && res.status === 201) {
      // socket.emit('agentAssign', res?.data?.data)
      // agentAssign(res, getLoggedInUserInfo?.userId)
      notification.success({
        message: 'Success',
        description: 'Project assign to employee',
      })
      setShowAssignModal(false)
      dispatch(getAllProjectInfo({ skip: 0, limit: 10 }))
    }
  }

  return (
    <>
      <Modal
        title="Assign Developer"
        visible={showAssignModal}
        onCancel={handleCloseModal}
        centered
        width={800}
        footer={false}
      >
        <Form
          onFinish={handleFormSubmit}
          layout="vertical"
          autoComplete="off"
          form={form}
          initialValues={{
            projects: [
              { projectId: projectData?.projectId, projectName: projectData?.projectName },
            ],
            developers: initialValuesForDevelopers,
          }}
          style={{
            padding: '2rem',
          }}
        >
          <Form.List name="developers">
            {(fields, { add: addEmployee, remove: removeProject }) => (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Row className="row" style={{ flexDirection: 'row-reverse' }}>
                      <Col>
                        <CloseCircleOutlined
                          style={{ color: 'red', fontSize: '1.5rem' }}
                          onClick={() => {
                            removeProject(field.name)
                          }}
                        />
                      </Col>
                    </Row>
                    <Card style={{ marginBottom: '0.5rem' }}>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'projectId']}
                            fieldKey={[field.fieldKey, 'projectId']}
                            rules={[
                              {
                                required: true,
                                message: 'Enter projectId',
                              },
                            ]}
                            initialValue={projectData?.projectId}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'projectName']}
                            fieldKey={[field.fieldKey, 'projectName']}
                            rules={[
                              {
                                required: true,
                                message: 'Enter project name',
                              },
                            ]}
                            initialValue={projectData?.projectName}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'assignDeveloper']}
                            fieldKey={[field.fieldKey, 'assignDeveloper']}
                            rules={[
                              {
                                required: true,
                                message: 'Select Developer',
                              },
                            ]}
                          >
                            <Select
                              id={`assignDeveloper-${index}`} // Unique ID for each Select
                              showSearch
                              placeholder="Assign Employee"
                              filterOption={filterOption}
                              allowClear
                            >
                              {employee?.map((item) => (
                                <Select.Option key={item.empId} value={item.userName}>
                                  {item.userName}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'employeeProjectRole']}
                            fieldKey={[field.fieldKey, 'employeeProjectRole']}
                            rules={[
                              {
                                required: true,
                                message: 'Choose employee role for the project',
                              },
                            ]}
                          >
                            <Select placeholder="Select Project Role">
                              {projectRole?.map((item) => (
                                <Select.Option key={item?.id} value={item?.uniqueValue}>
                                  {item?.displayName}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      addEmployee()
                    }}
                    block
                  >
                    <PlusOutlined /> Select Employee
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
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

export default AssignDeveloper
