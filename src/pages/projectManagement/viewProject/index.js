import React from 'react'
import { Modal, Typography } from 'antd'
import { projectStatusEnums } from 'enums/projectStatus'
// import { projectStatusEnums } from 'enums/projectStatus'
import moment from 'moment'

const { Text } = Typography

const ViewH2h = ({ projectData, showViewModal, setShowViewModal }) => {
  const onCancelModalHandler = () => {
    setShowViewModal(false)
  }
  let projectStatus
  if (projectData?.projectStatus === projectStatusEnums.NOT_STARTED) {
    projectStatus = 'Not Started'
  } else if (projectData?.projectStatus === projectStatusEnums.ACTIVE) {
    projectStatus = 'Active'
  } else if (projectData?.projectStatus === projectStatusEnums.CANCEL) {
    projectStatus = 'Cancel'
  } else if (projectData?.projectStatus === projectStatusEnums.COMPLETED) {
    projectStatus = 'Completed'
  } else {
    projectStatus = 'Hold'
  }

  const technologies = JSON.parse(projectData?.technology).join(', ')
  return (
    <Modal
      title="View Project Information"
      centered
      width={800}
      footer={false}
      visible={showViewModal}
      onCancel={onCancelModalHandler}
    >
      <p>
        <Text strong>Project ID : </Text>
        {projectData?.projectId}
      </p>
      <p>
        <Text strong>Client Name : </Text>
        {projectData?.clientInfo?.contactPersonalName} {' ('}
        {projectData?.clientInfo?.businessName}
        {')'}
      </p>
      <p>
        <Text strong>Project Name : </Text>
        {projectData?.projectName}
      </p>
      <p>
        <Text strong>Assigned Developers: </Text>
        {projectData?.developers.length > 0 ? (
          projectData?.developers.map((developer, index) => (
            <span key={index}>
              {developer?.employeeProjectRole === 'project_owner' && (
                <span>
                  <b>PO:- </b> {'[ '}
                  {developer.Employee.userName}
                  {' ]  '}
                </span>
              )}
              {developer.Employee.userName}
              {index !== projectData.developers.length - 1 && ', '}
            </span>
          ))
        ) : (
          // projectData?.developers.map((developer, index) => (
          //   <span key={index}>
          //     if(developers?.employeeProjectRole === "project_owner"){
          //       <span><b>PO:- </b> {developer.Employee.userName}</span>
          //     }
          //     {developer.Employee.userName}
          //     {index !== projectData.developers.length - 1 && ', '}{' '}
          //   </span>
          // ))
          <span>No developer assigned</span>
        )}
      </p>
      <p>
        <Text strong>Billing Type : </Text>
        {projectData?.billingType}
      </p>

      {/* <p>
        <Text strong>Project Source : </Text>
        {projectData?.projectSource}
      </p> */}
      <p>
        <Text strong>Project Start Date : </Text>
        {moment(projectData?.projectStartDate).format('YYYY-MM-DD')}
      </p>
      <p>
        <Text strong>Project Status: </Text>
        {projectStatus}
      </p>
      <p>
        <Text strong>Technology Required: </Text>
        {technologies}
      </p>
      {projectData?.description && (
        <p>
          <Text strong>Description: </Text>
          {projectData?.description}
        </p>
      )}
    </Modal>
  )
}
export default ViewH2h
