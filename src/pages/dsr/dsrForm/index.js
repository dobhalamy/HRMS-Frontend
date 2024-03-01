import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  DatePicker,
  notification,
  Card,
  Space,
  Typography,
} from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'

import { isEmpty } from 'lodash'
import moment from 'moment'
import { getLoggedInUserInfo, TaskHours, TaskStatus, Minutes } from 'utils'
import { addEmployeeDrs, getEmployeeDsr, getAllEmployeeDsr } from 'services/axios/dsr'
import {
  handleDsrTableData,
  handleDsrTableTotalCount,
  handleLoading,
  projectList,
} from 'redux/employeeDsr/action'
// import { dsrSocket } from 'socket'

const DsrForm = ({ setOpenForm }) => {
  const { Text } = Typography

  const ProjectsMilestone = useSelector((state) => state?.dsrState?.projectsName)
  const numberOfProject = ProjectsMilestone?.length
  const defaultDate = moment()

  // const { userId } = getLoggedInUserInfo()

  const dateFormat = 'DD-MMM-YYYY'
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const pagination = useSelector((state) => state?.dsrState?.pagination)
  const userRole = getLoggedInUserInfo()?.userRole

  const getEmployeeDsrData = useCallback(async () => {
    const { skip, limit } = pagination
    let employeeDsrData
    if (userRole === 'super_admin' || userRole === 'hr') {
      employeeDsrData = await getAllEmployeeDsr({ skip, limit })
    } else {
      employeeDsrData = await getEmployeeDsr({ skip, limit })
    }
    if (employeeDsrData?.data?.status && employeeDsrData?.status) {
      dispatch(handleDsrTableData(employeeDsrData?.data?.data?.dsrList))
      dispatch(handleDsrTableTotalCount(employeeDsrData?.data?.data?.totalCount))
      dispatch(handleLoading(false))
    } else {
      dispatch(handleLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination])
  const fetchFinalData = (currentProject, currentProjectName, date, finalDsrData) => {
    for (let j = 0; j < currentProject?.tasks?.length; j += 1) {
      const task = currentProject?.tasks[j]
      let taskMinutes = 0

      if (task.workingHours === undefined || task.workingHours === 0) {
        taskMinutes += task.minutes
      } else if (task.minutes === undefined || task.minutes === 0) {
        taskMinutes += task.workingHours * 60
      } else {
        taskMinutes = task.minutes + task.workingHours * 60
      }
      delete task.minutes
      delete task.workingHours

      finalDsrData.push({
        ...task,
        projectId: currentProjectName,
        workingDate: date,
        taskMinutes,
      })
    }
  }
  const onFinish = async (values) => {
    const finalDsrData = []
    for (let i = 0; i < values?.projects?.length; i += 1) {
      const currentProjectName = values.projects[i]?.projectId
      const date = moment(values?.projects[i]?.workingDate).format('YYYY-MM-DD')
      const currentProject = values?.projects[i]
      fetchFinalData(currentProject, currentProjectName, date, finalDsrData)
    }
    if (!isEmpty(finalDsrData)) {
      const hasZeroMinutesTask = finalDsrData.some((task) => task.taskMinutes === 0)
      if (hasZeroMinutesTask) {
        notification.warning({
          message: 'Fill working hours',
        })
      } else {
        const addedEmployeeDsr = await addEmployeeDrs(finalDsrData)
        if (addedEmployeeDsr?.data?.status && addedEmployeeDsr?.data?.message === 'success') {
          // dsrSocket(addedEmployeeDsr?.data?.data, userId)
          notification.success({
            message: 'Dsr Added',
          })
          form.resetFields()
          setOpenForm(false)
          getEmployeeDsrData()
        }
      }
    }
  }
  const disabledDate = (current) => {
    const startDate = moment().subtract(4, 'days')
    const endDate = moment().endOf('day')

    return current <= startDate || current > endDate
  }

  useEffect(() => {
    dispatch(projectList())
  }, [dispatch])
  return (
    <div>
      {numberOfProject === 0 ? (
        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text strong>First assign a project</Text>
          </div>
        </Form.Item>
      ) : (
        <Form
          name="addProjects"
          style={{
            padding: '2rem',
          }}
          layout="vertical"
          form={form}
          initialValues={{
            projects: [{ workingDate: defaultDate }],
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="projects">
            {(fields, { add: addProject, remove: removeProject }) => {
              return (
                <div>
                  {fields?.length > 0 &&
                    fields.map((field) => (
                      <div key={field?.key}>
                        <Row className="row" style={{ flexDirection: 'row-reverse' }}>
                          <Col>
                            <CloseCircleOutlined
                              style={{ color: 'red', fontSize: '1.5rem' }}
                              onClick={() => {
                                removeProject(field?.name)
                              }}
                            />
                          </Col>
                        </Row>
                        <Card style={{ marginBottom: '0.5rem' }}>
                          <Row gutter={16}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                {...field}
                                name={[field?.name, 'projectId']}
                                fieldKey={[field?.fieldKey, 'projectId']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Enter your projects/milestones',
                                  },
                                ]}
                              >
                                <Select placeholder="Select Project" size="large">
                                  {ProjectsMilestone?.map((project) => (
                                    <Select.Option
                                      key={project?.projectId}
                                      value={project?.projectId}
                                    >
                                      {project?.projectName}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                {...field}
                                name={[field?.name, 'workingDate']}
                                fieldKey={[field?.fieldKey, 'workingDate']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please input working date',
                                  },
                                ]}
                              >
                                <DatePicker
                                  disabledDate={disabledDate}
                                  format={dateFormat}
                                  placeholder="Select working date"
                                  size="large"
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.List name={[field?.name, 'tasks']}>
                            {(tasks, { add: addTask, remove: removeTask }) => {
                              return (
                                <div>
                                  {tasks?.length > 0 &&
                                    tasks.map((task) => (
                                      <div key={task?.key}>
                                        <Row
                                          className="row"
                                          style={{ flexDirection: 'row-reverse' }}
                                        >
                                          <Col>
                                            <CloseCircleOutlined
                                              style={{ color: 'red', fontSize: '1rem' }}
                                              onClick={() => removeTask(task?.name)}
                                            />
                                          </Col>
                                        </Row>
                                        <Card
                                          style={{
                                            marginBottom: '1rem',
                                            backgroundColor: '#f0f2f4',
                                          }}
                                          hoverable
                                        >
                                          <Row gutter={16}>
                                            <Col className="gutter-row" span={24}>
                                              <Form.Item
                                                {...task}
                                                label="Task/Description"
                                                name={[task?.name, 'taskDetails']}
                                                fieldKey={[task?.fieldKey, 'taskDetails']}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: 'Please input task/description',
                                                  },
                                                ]}
                                              >
                                                <Input.TextArea
                                                  rows={3}
                                                  style={{ width: '100%' }}
                                                />
                                              </Form.Item>
                                            </Col>
                                          </Row>
                                          <Row gutter={16}>
                                            <Col className="gutter-row" span={8}>
                                              <Form.Item
                                                {...task}
                                                label="Task Status"
                                                name={[task?.name, 'taskStatus']}
                                                fieldKey={[task?.fieldKey, 'taskStatus']}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: 'Enter task status',
                                                  },
                                                ]}
                                              >
                                                <Select
                                                  placeholder="Select Status"
                                                  size="large"
                                                  options={TaskStatus}
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" span={8}>
                                              <Form.Item
                                                {...task}
                                                label="Task Hours"
                                                name={[task?.name, 'workingHours']}
                                                fieldKey={[task?.fieldKey, 'workingHours']}
                                                rules={[
                                                  {
                                                    required: false,
                                                    message: 'Enter task hours',
                                                  },
                                                ]}
                                              >
                                                <Select
                                                  placeholder="Select Hours"
                                                  size="large"
                                                  options={TaskHours}
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col className="gutter-row" span={8}>
                                              <Form.Item
                                                {...task}
                                                label="Minutes"
                                                name={[task?.name, 'minutes']}
                                                fieldKey={[task?.fieldKey, 'minutes']}
                                                rules={[
                                                  {
                                                    required: false,
                                                    message: 'Enter task minutes',
                                                  },
                                                ]}
                                              >
                                                <Select
                                                  placeholder="Select Minutes"
                                                  size="large"
                                                  options={Minutes}
                                                />
                                              </Form.Item>
                                            </Col>
                                          </Row>
                                        </Card>
                                      </div>
                                    ))}
                                  <Space style={{ marginBottom: '0.5rem' }}>
                                    <Button
                                      style={{ backgroundColor: '#f0f2f4' }}
                                      onClick={() => {
                                        addTask()
                                      }}
                                    >
                                      Add Task
                                    </Button>
                                  </Space>
                                </div>
                              )
                            }}
                          </Form.List>
                        </Card>
                      </div>
                    ))}

                  <Form.Item>
                    {fields?.length < numberOfProject && (
                      <Button
                        type="dashed"
                        onClick={() => {
                          addProject()
                        }}
                        block
                      >
                        <PlusOutlined /> Select Project
                      </Button>
                    )}
                  </Form.Item>
                </div>
              )
            }}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  )
}

export default DsrForm
