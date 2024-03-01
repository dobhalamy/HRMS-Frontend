import React from 'react'
import { Form, Modal, notification, Row, Col, Table, Tag } from 'antd'
import { formatDate } from 'utils'
import moment from 'moment'

function ViewLeaveFormModal({ showViewLeaveModal, setShowViewLeaveModal, handleOk, data }) {
  const leaveStartDate = new Date(data.start)
  const leaveEndDate = new Date(data.end)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (record?.poUser?.userName ? `${record?.poUser?.userName} (Po)` : 'Hr'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        if (
          record?.leaveStatus &&
          record?.leaveStatus === 1
          // record?.leaveStatus &&
          // (userId !== record.poId ||
          // record?.universalLeaveStatus === 1 ||
          // record?.leaveStatus === 1)
        ) {
          return (
            <Tag bordered="false" color="success">
              Approved
            </Tag>
          )
        }
        if (record?.leaveStatus === 2) {
          return (
            <Tag bordered="false" color="error">
              Rejected
            </Tag>
          )
        }
        return (
          <Tag bordered="false" color="warning">
            Pending
          </Tag>
        )
      },
    },
    {
      title: 'Rejected Reason',
      dataIndex: 'rejectedReason',
      key: 'reason',
      render: (_, record) => record?.rejectReason || '--',
    },
  ]
  const LeaveDate = {
    leaveDate: [
      formatDate(leaveStartDate),
      formatDate(leaveEndDate.setDate(leaveEndDate.getDate())),
    ],
  }

  const onFinishFailed = (errorInfo) => {
    notification?.error({
      message: 'Error',
      description: errorInfo?.errorFields[0]?.errors,
    })
  }

  return (
    <Modal
      title="View Leave Details"
      visible={showViewLeaveModal}
      onOk={handleOk}
      width={600}
      height={200}
      onCancel={() => setShowViewLeaveModal(() => false)}
      // footer={[
      //   <Button key="back" onClick={() => setShowViewLeaveModal(() => false)}>
      //     Cancel
      //   </Button>,
      // ]}
      footer={false}
      className="viewLeave"
    >
      <Form
        id="viewLeaveForm"
        name="basic"
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={LeaveDate}
      >
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 50%">
            <b>
              {Array.isArray(data)
                ? data[0]?.requestedUser?.userName
                : data?.requestedUser?.userName}
            </b>
          </Col>
          <Col flex="1 0 30%">
            <b>
              {Array.isArray(data)
                ? data[0]?.leaveType?.replace(/_/g, ' ').toUpperCase()
                : data?.leaveType?.replace(/_/g, ' ').toUpperCase()}
            </b>
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 50%">
            <b>Leave Date (Form-To):</b> <br />
            {moment(data[0]?.leaveFrom).format('YYYY/MM/DD')} To{' '}
            {moment(data[0]?.leaveTo).format('YYYY/MM/DD')}
          </Col>
          <Col flex="1 0 30%">
            <b>Leave Duration:</b> <br />
            {Array.isArray(data)
              ? data[0]?.leaveDuration.charAt(0).toUpperCase() + data[0]?.leaveDuration.slice(1)
              : data?.leaveDuration.charAt(0).toUpperCase() + data?.leaveDuration.slice(1)}
          </Col>
        </Row>
        <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="2 2 50%">
            <b>Leave Reason:</b> <br />
            {Array.isArray(data) ? data[0]?.leaveReason : data?.leaveReason}
          </Col>
        </Row>
        {/* <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            Employee ID: <b>#{Array.isArray(data) ? data[0]?.empId : data?.empId}</b>
          </Col>
        </Row> */}
        {/* <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            Employee Name: <b>{Array.isArray(data) ? data[0]?.userName : data?.userName}</b>
          </Col>
        </Row> */}
        {/* <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            Leave Type:{' '}
            {Array.isArray(data)
              ? data[0]?.leaveType?.replace(/_/g, ' ').toUpperCase()
              : data?.leaveType?.replace(/_/g, ' ').toUpperCase()}
          </Col>
        </Row> */}
        {/* <Row className="row" style={{ gap: '2rem' }}>
          <Col flex="1 0 100%">
            Leave Duration: {Array.isArray(data) ? data[0]?.leaveDuration : data?.leaveDuration}
          </Col>
        </Row>
        {data?.leaveReason && (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 100%">Leave Reason: {data?.leaveReason}</Col>
          </Row>
        )} */}
        {/* {Array.isArray(data) && (
          <Row className="row" style={{ gap: '2rem' }}>
            {data.map((leaveData) => (
              <Col flex="1 0 100%" key={leaveData?.id}>
                <span> Leave Status:</span>
                <span className="statusTag">
                  {leaveData?.leaveStatus === 1 && (
                    <Tag bordered={false} color="success">
                      Approved
                    </Tag>
                  )}
                  {leaveData?.leaveStatus === 0 && (
                    <Tag bordered={false} color="warning">
                      Pending Request
                    </Tag>
                  )}
                  {leaveData?.leaveStatus === 2 && (
                    <Tag bordered={false} color="error">
                      Rejected
                    </Tag>
                  )}
                </span>
                {leaveData?.poId && (
                  <Col className="row" style={{ gap: '2rem' }}>
                    <Col flex="1 0 100%">Project Owner: {leaveData?.poId}</Col>
                  </Col>
                )}
              </Col>
            ))}
          </Row>
        ) : (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 100%">
              <span> Leave Status:</span>
              <span className="statusTag">
                {data?.leaveStatus === 1 && (
                  <Tag bordered={false} color="success">
                    Approved
                  </Tag>
                )}
                {data?.leaveStatus === 0 && (
                  <Tag bordered={false} color="warning">
                    Pending Request
                  </Tag>
                )}
                {data?.leaveStatus === 2 && (
                  <Tag bordered={false} color="error">
                    Rejected
                  </Tag>
                )}
              </span>
            </Col>
            {data?.poId && (
              <Col className="row" style={{ gap: '2rem' }}>
                <Col flex="1 0 100%">Project Owner: {data?.poId}</Col>
              </Col>
            )}
          </Row>
        )} */}
        {/* <> */}
        <Table
          dataSource={data || []}
          columns={columns}
          rowKey="id"
          // scroll={{ x: 300, y: 550 }}
          pagination={false}
        />
        {/* {Array.isArray(data) ? ( */}
        {/* <div>
            {data.map((leaveData) => (
              // <Col flex="1 0 100%" key={leaveData?.id}>
              <>
                {leaveData?.poId && leaveData?.poId !== userId ? (
                  <Row className="row" style={{ gap: '2rem' }}>
                    Project Owner: <b>{leaveData?.poUserName} </b>
                    <span className="ml-3">
                      {leaveData?.leaveStatus === 1 && (
                        <Tag bordered={false} color="success" className="ml">
                          Approved
                        </Tag>
                      )}
                      {leaveData?.leaveStatus === 2 && (
                        <Tag bordered={false} color="error">
                          Rejected
                        </Tag>
                      )}
                      {leaveData?.leaveStatus === 0 && (
                        <Tag bordered={false} color="warning">
                          Pending
                        </Tag>
                      )}
                    </span>
                    <span style={{ color: 'red' }}>{leaveData?.rejectReason}</span>
                  </Row>
                  ) : (
                    userRole !== 'hr' && (
                    <div>
                      Hr:
                      <span className="ml-3">
                        {leaveData?.leaveStatus === 1 && (
                          <Tag bordered={false} color="success">
                            Approved
                          </Tag>
                        )}
                        {leaveData?.leaveStatus === 2 && (
                          <Tag bordered={false} color="error">
                            Rejected
                          </Tag>
                        )}
                        {leaveData?.leaveStatus === 0 && (
                          <Tag bordered={false} color="warning">
                            Pending
                          </Tag>
                        )}
                      </span>
                      <span style={{ color: 'red' }}>{leaveData?.rejectReason}</span>
                    </div>) */}
        {/* )} */}
        {/* </>
                // </Col>
              ))}
          </div> */}
        {/* )  */}
        {/* : (
            <Row className="row" style={{ gap: '2rem' }}>
              {data?.poId && data?.poId !== userId ? (
                <Col flex="1 0 100%">
                  Project Owner: <b>{data?.poUserName} </b>
                  <span className="ml-3">
                    {data?.leaveStatus === 1 && (
                      <Tag bordered={false} color="success" className="ml">
                        Approved
                      </Tag>
                    )}
                    {data?.leaveStatus === 2 && (
                      <Tag bordered={false} color="error">
                        Rejected
                      </Tag>
                    )}
                    {data?.leaveStatus === 0 && (
                      <Tag bordered={false} color="warning">
                        Pending
                      </Tag>
                    )}
                  </span>
                  <span style={{ color: 'red' }}>{data?.rejectReason}</span>
                </Col>
              ) : (
                userRole !== 'hr' && (
                  <Col flex="1 0 100%">
                    Hr:
                    <span className="ml-3">
                      {data?.leaveStatus === 1 && (
                        <Tag bordered={false} color="success" className="ml">
                          Approved
                        </Tag>
                      )}
                      {data?.leaveStatus === 2 && (
                        <Tag bordered={false} color="error">
                          Rejected
                        </Tag>
                      )}
                      {data?.leaveStatus === 0 && (
                        <Tag bordered={false} color="warning">
                          Pending
                        </Tag>
                      )}
                    </span>
                    <span style={{ color: 'red' }}>{data?.rejectReason}</span>
                  </Col>
                )
              )}
            </Row> */}
        {/* )} */}
        {/* </> */}

        {/* {Array.isArray(data) ? (
          <Row className="row" style={{ gap: '2rem' }}>
            {data.map((leaveData) => (
              <Col flex="1 0 100%" key={leaveData?.id}>
                {renderLeaveStatus(leaveData?.leaveStatus, leaveData?.poId)}
              </Col>
            ))}
          </Row>
        ) : (
          <Row className="row" style={{ gap: '2rem' }}>
            <Col flex="1 0 100%">
              {renderLeaveStatus(data?.leaveStatus, data?.poId)}
            </Col>
          </Row>
        )} */}
        {/* {data?.rejectReason && data?.leaveStatus === 2 && (
          <Row className="row" style={{ gap: '2rem', color: 'red' }}>
            <Col flex="1 0 100%">Reject Reason: {data?.rejectReason}</Col>
          </Row>
        )} */}
      </Form>
    </Modal>
  )
}
export default ViewLeaveFormModal
