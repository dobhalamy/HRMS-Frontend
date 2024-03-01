import React from 'react'
import { Drawer, Card, Typography, Tag } from 'antd'
import { hourConversion, getLoggedInUserInfo } from 'utils'

const { Text } = Typography

const TasksDrawer = ({ dsrTasks, showTasksDrawer, setShowTasksDrawer }) => {
  const { tasks } = dsrTasks
  const userRole = getLoggedInUserInfo()?.userRole
  const onCloseDrawer = () => {
    setShowTasksDrawer(false)
  }
  return (
    <>
      <Drawer
        title="DSR Tasks"
        placement="right"
        width={700}
        onClose={onCloseDrawer}
        visible={showTasksDrawer}
      >
        {tasks?.length > 0 &&
          tasks.map((singleTask) => (
            <Card
              hoverable
              style={{ marginBottom: '1em', backgroundColor: '#f0f2f4' }}
              key={singleTask?.id}
            >
              {(userRole === 'hr' || userRole === 'super_admin') && (
                <p>
                  <Text strong>Employee Name:</Text> {singleTask?.employee.userName}
                </p>
              )}

              {singleTask.taskStatus === 'Completed' ? (
                <p>
                  <Text strong>
                    Task Status:
                    <Tag color="success" style={{ marginLeft: '0.5em' }}>
                      {singleTask?.taskStatus}
                    </Tag>
                  </Text>
                </p>
              ) : (
                <p>
                  <Text strong>
                    Task Status:
                    <Tag color="warning" style={{ marginLeft: '0.5em' }}>
                      {singleTask?.taskStatus}
                    </Tag>
                  </Text>
                </p>
              )}
              <p>
                <Text strong>Project Name:</Text> {singleTask?.projectName.projectName}
              </p>

              <p>
                <Text strong>Working Hour:</Text> {hourConversion(singleTask?.workingHours)}
              </p>
              <p>
                <Text strong>Task Detail:</Text> {singleTask?.taskDetail}
              </p>
            </Card>
          ))}
      </Drawer>
    </>
  )
}
export default TasksDrawer
