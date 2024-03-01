import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { connect, useSelector } from 'react-redux'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
// import { fetchEmpDayLeaveData, fetchEmpLeaveData } from 'redux/empLeave/action'
import { fetchEmpLeaveData } from 'redux/empLeave/action'
import { getEmployeeList } from 'redux/allEmployee/action'
import { fetchMasterGTData } from 'redux/globalType/actions'
import AddEventForm from 'pages/events/addEventForm'
import { fetchEventsData } from 'redux/events/action'
// import { getDates, getLoggedInUserInfo, fetchEmpLeaveForLeaveType } from 'utils'
import { getDates, getLoggedInUserInfo } from 'utils'
import EditEventFormModal from 'pages/events/editEventForm'
// import { setTourSteps } from 'redux/tour/actions'
import AddWfh from 'pages/wfh/addWfh'
// import { leaveEnums } from 'enums/leave'
// import { isEmpty } from 'lodash'
import { userRoleEnums } from 'enums/userRole'
import AddFormModal from './addFormModal'
import EditLeaveFormModal from './editFormModal'
import EventTypeModal from './eventTypeModal'
import styles from './style.module.scss'

const localizer = momentLocalizer(moment)

const AttendanceCalendar = ({
  empLeave,
  empDayOffLeave,
  // empDayWFHLeave,
  masterGlobalTypeData,
  eventsData,
  dispatch,
  hideLeaderBoard,
}) => {
  const [addDefaultDate, setAddDefaultDate] = useState({
    initialValues: {
      startDate: '',
      endDate: '',
    },
  })
  let statusClass = null
  const { userId, userRole } = getLoggedInUserInfo()
  const employee = useSelector((state) => state?.toggle?.empList?.employee)
  const [loading, setLoading] = useState(false)
  const [showEventTypeForm, setShowEventTypeForm] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [showEditLeaveForm, setShowEditLeaveForm] = useState(false)
  const [leaveData, setLeaveData] = useState({})
  // const { userRole } = useSelector((state) => state?.user?.userInfo)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEditEventForm, setShowEditEventForm] = useState(false)
  const [showWFHForm, setShowWFHForm] = useState(false)
  const [passEventData, setPassEventData] = useState({})

  const skip = 0
  const limit = 0
  const getListOfEmployees = useCallback(async () => {
    dispatch(getEmployeeList({ skip, limit }))
  }, [skip, limit, dispatch])

  useEffect(() => {
    dispatch(fetchEmpLeaveData())
    // dispatch(fetchEmpDayLeaveData())
    dispatch(fetchMasterGTData('leave_type'))
    dispatch(fetchEventsData())
    if (userRole === userRoleEnums?.HR || userRole === userRoleEnums?.SUPER_ADMIN) {
      getListOfEmployees()
    }
  }, [dispatch, getListOfEmployees, userRole])
  function shortNameInitials(name) {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

    let nameInitials = [...name.matchAll(rgx)] || []
    nameInitials = (
      (nameInitials.shift()?.[1] || '') + (nameInitials.pop()?.[1] || '')
    ).toUpperCase()
    return nameInitials
  }
  const EVENT = []

  eventsData?.map((data) => {
    const startDate = new Date(data.eventStartDate)
    const eventStartDate = new Date(data.eventStartDate)
    const eventEndDate = new Date(data.eventEndDate)
    const leaveDays = getDates(eventStartDate, eventEndDate)
    if (leaveDays.length > 1) {
      leaveDays?.map((bulkEvents) => {
        const bulkDate = new Date(bulkEvents)
        const obj = {
          id: data.id,
          type: 'event',
          eventDesc: data.eventDesc,
          allDay: true,
          title: `${data.eventName}`,
          start: new Date(bulkDate.setDate(bulkDate.getDate())),
          end: bulkDate,
        }
        EVENT.push(obj)
        return EVENT
      })
    } else {
      const obj = {
        id: data.id,
        type: 'event',
        eventDesc: data.eventDesc,
        allDay: true,
        title: `${data.eventName}`,
        start: new Date(startDate.setDate(startDate.getDate())),
        end: data.eventEndDate,
      }
      EVENT.push(obj)
    }
    return EVENT
  })

  const distinctEmpLeave = empLeave?.filter(
    (data) =>
      !data?.poId ||
      (data?.poId === userId && data?.userId !== userId && data?.universalLeaveStatus === 0),
  )

  distinctEmpLeave?.map((item) => {
    // employeesLeaveData?.map((item) => {
    const startDate = new Date(item?.leaveFrom)
    shortNameInitials(item?.Employee?.userName)
    // if (item.leaveStatus === 1) {
    if (item?.universalLeaveStatus === 1) {
      statusClass = 'approvedLeave'
      // } else if (item.leaveStatus === 2) {
    } else if (item?.universalLeaveStatus === 2) {
      statusClass = 'rejectedLeave'
    } else {
      statusClass = 'pendingLeave'
    }
    const eventStartDate = new Date(item?.leaveFrom)
    const eventEndDate = new Date(item?.leaveTo)
    const leaveDays = getDates(eventStartDate, eventEndDate)
    if (leaveDays.length > 1) {
      leaveDays?.map((bulkLeave) => {
        const bulkDate = new Date(bulkLeave)
        const obj = {
          id: item.id,
          type: 'leave',
          empId: item?.empId,
          userId: item?.userId,
          // userName: item?.userName,
          leaveType: item?.leaveType,
          leaveReason: item?.leaveReason,
          allDay: true,
          title: item?.Employee?.userName,
          start: new Date(bulkDate.setDate(bulkDate.getDate())),
          end: bulkDate,
          leaveStatus: statusClass,
        }
        EVENT.push(obj)
        return EVENT
      })
    } else {
      const obj = {
        id: item.id,
        type: 'leave',
        empId: item?.empId,
        userId: item?.userId,
        // userName: item?.userName,
        leaveType: item?.leaveType,
        leaveReason: item?.leaveReason,
        allDay: true,
        title: item?.Employee?.userName,
        start: new Date(startDate),
        end: item?.leaveTo,
        leaveStatus: statusClass,
      }
      EVENT.push(obj)
    }
    return EVENT
  })
  const showModal = () => {
    setShowEventTypeForm(true)
  }
  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }
  const handleCancel = (event) => {
    event.preventDefault()
    setOpen(false)
    setShowWFHForm(false)
  }

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setAddDefaultDate({
        ...addDefaultDate,
        initialValues: {
          ...addDefaultDate.initialValues,
          startDate: start,
          endDate: end,
        },
      })
      showModal()
    },
    [addDefaultDate],
  )

  const handleSelectEvent = useCallback(
    (event) => {
      if (event?.leaveType) {
        const leavePeriod = empLeave.filter((empLeaves) => {
          return empLeaves?.id === event?.id
        })
        event.start = leavePeriod[0]?.leaveFrom
        event.end = leavePeriod[0]?.leaveTo
        setShowEditLeaveForm(true)
        setLeaveData(event)
      } else {
        const eventPeriod = eventsData.filter((events) => {
          return events?.id === event?.id
        })
        const startDate = new Date(eventPeriod[0]?.eventStartDate)
        const endDate = new Date(eventPeriod[0]?.eventEndDate)
        event.start = new Date(startDate.setDate(startDate.getDate()))
        event.end = new Date(endDate.setDate(endDate.getDate() + 1))
        setShowEditEventForm(true)
        setPassEventData(event)
      }
    },
    [empLeave, eventsData],
  )
  const eventPropGetter = useCallback(
    (event, start, end, isSelected) => ({
      ...(isSelected && {
        style: {
          backgroundColor: '#000',
        },
      }),
      ...(moment(start).hour() < 12 && {
        className: 'Blue',
      }),
      ...(event.type?.includes('event') && {
        className: 'darkGreen',
      }),
      ...(event.type?.includes('leave') && {
        style: {
          // eslint-disable-next-line no-nested-ternary
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            event?.leaveStatus === 'pendingLeave'
              ? 'rgb(240 164 0)'
              : event?.leaveStatus === 'approvedLeave'
              ? '#176102'
              : 'red',
        },
      }),
    }),
    [],
  )

  return (
    <div>
      <Helmet title="Ant Design" />
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-3">
              {showEventTypeForm && (
                <EventTypeModal
                  handleOk={handleOk}
                  showEventTypeForm={showEventTypeForm}
                  setShowEventTypeForm={setShowEventTypeForm}
                  setShowEventForm={setShowEventForm}
                  loading={loading}
                  React={React}
                  date={addDefaultDate.initialValues}
                  employee={employee}
                  leaveType={masterGlobalTypeData}
                  setOpen={setOpen}
                  setShowWFHForm={setShowWFHForm}
                />
              )}
              {isOpen && (
                <AddFormModal
                  handleOk={handleOk}
                  isOpen={isOpen}
                  setOpen={setOpen}
                  handleCancel={handleCancel}
                  loading={loading}
                  React={React}
                  date={addDefaultDate.initialValues}
                  employee={employee}
                  leaveType={masterGlobalTypeData}
                />
              )}
              {showEditLeaveForm && (
                <EditLeaveFormModal
                  showEditLeaveForm={showEditLeaveForm}
                  setShowEditLeaveForm={setShowEditLeaveForm}
                  data={leaveData}
                  loading={loading}
                  setLoading={setLoading}
                  handleOk={handleOk}
                  employee={employee}
                  leaveType={masterGlobalTypeData}
                />
              )}
              {showEventForm && (
                <AddEventForm
                  handleOk={handleOk}
                  showEventForm={showEventForm}
                  setShowEventForm={setShowEventForm}
                  handleCancel={handleCancel}
                  loading={loading}
                  React={React}
                  date={addDefaultDate.initialValues}
                  employee={employee}
                  leaveType={masterGlobalTypeData}
                />
              )}
              {showEditEventForm && (
                <EditEventFormModal
                  showEditEventForm={showEditEventForm}
                  setShowEditEventForm={setShowEditEventForm}
                  data={passEventData}
                  loading={loading}
                  setLoading={setLoading}
                  handleOk={handleOk}
                />
              )}
              {showWFHForm && (
                <AddWfh
                  handleOk={handleOk}
                  showWFHForm={showWFHForm}
                  setShowWFHForm={setShowWFHForm}
                  handleCancel={handleCancel}
                  loading={loading}
                  React={React}
                  date={addDefaultDate.initialValues}
                  employee={employee}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className={`col-lg-${hideLeaderBoard ? '12' : '9'}`} id="calendar">
              <Calendar
                className={styles.rbcEvent}
                localizer={localizer}
                events={EVENT}
                style={{ height: 500 }}
                onSelectEvent={
                  userRole !== userRoleEnums?.HR && userRole !== userRoleEnums?.SUPER_ADMIN
                    ? null
                    : handleSelectEvent
                }
                onSelectSlot={handleSelectSlot}
                selectable
                popup
                eventPropGetter={eventPropGetter}
              />
              <div id="leaveStatus">
                <ul className="legend">
                  <li>
                    <span className="events" /> <b>Events</b>
                  </li>
                  <li>
                    <span className="approved" /> <b>Approved Leave</b>
                  </li>
                  <li>
                    <span className="rejected" /> <b>Rejected Leave</b>
                  </li>
                  <li>
                    <span className="pending" /> <b>Pending Leave</b>
                  </li>
                </ul>
              </div>
            </div>
            {!hideLeaderBoard && (
              <div className="col-lg-3" id="daysOff">
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* First scrollable column */}
                  <div style={{ height: '250px' }}>
                    <h5>Days off</h5>
                    <hr />
                    <div className="info" style={{ overflowY: 'auto' }}>
                      {empDayOffLeave?.regularLeave?.map((d) => {
                        const nameInitials = shortNameInitials(d?.Employee?.userName)
                        return (
                          <div key={d.id}>
                            <p>
                              <span
                                className={`${d?.Employee?.userName.replace(/ /g, '-')} name_image`}
                                style={{ background: 'rgb(23, 97, 2)' }}
                              >
                                {nameInitials}
                              </span>
                              <b>{d?.Employee?.userName}</b>
                            </p>
                          </div>
                        )
                      })}
                      {empDayOffLeave?.workFromHomeLeave?.map((d) => {
                        const nameInitials = shortNameInitials(d?.Employee?.userName)
                        return (
                          <div key={d.id}>
                            <p>
                              <span
                                className={`${d?.Employee?.userName.replace(/ /g, '-')} name_image`}
                                style={{ background: 'rgb(119, 222, 171)' }}
                              >
                                {nameInitials}
                              </span>
                              <b>{d?.Employee?.userName}</b>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {/* Second scrollable column */}
                  {/* <div style={{ height: '200px' }}>
                    <h5>Remaining Leaves</h5>
                    <hr />
                    <div className="info" style={{ overflowY: 'auto' }}>
                      {leaveRecords?.map((d) => {
                        return (
                          <div key={d.id}>
                            <p>
                              <span
                                className={`${d.displayName.replace(/ /g, '-')} name_image`}
                                style={{ background: 'rgb(128,0,0)' }}
                              >
                                {d?.displayName[0]}
                              </span>
                              <b style={{ marginLeft: '8px' }}>{d?.displayName}</b>
                              <span style={{ margin: '0 8px' }}>-</span>
                              <b>
                                {leaveEnums[d.uniqueValue.toUpperCase()] - d?.leaveRecords?.length}
                              </b>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div> */}
                </div>
              </div>
            )}
            {/* <div className="col-lg-3" id="daysOff"> 
              <h5>Days Work From Home</h5>
              <hr />
                <div className="info">
                {empDayWFHLeave?.map((d) => {
                  const nameInitials = shortNameInitials(d.userName)
                  return (
                    <div key={d.empId}>
                      <p>
                        <span
                          className={`${d.userName.replace(/ /g, '-')} name_image`}
                          style={{ background: 'rgb(23, 97, 2)' }}
                        >
                          {nameInitials}
                        </span>
                          <b>{d.userName}</b>
                      </p>
                    </div>
                    )
                  })}
                </div>  */}
            {/* <h5>Days off</h5>
                <hr />
                <div className="info">
                {empDayOffLeave?.map((d) => {
                  const nameInitials = shortNameInitials(d.userName)
                    return (
                      <div key={d.id}>
                        <p>
                          <span
                            className={`${d.userName.replace(/ /g, '-')} name_image`}
                            style={{ background: 'rgb(23, 97, 2)' }}
                          >
                            {nameInitials}
                          </span>
                          <b>{d.userName}</b>
                        </p>
                      </div>
                    )
                })}
              </div> */}
          </div>
        </div>
      </div>
    </div>
    // </div>
  )
}

const mapStateToProps = ({ empLeaveData, fetchMasterGlobalTypeData, eventsData, dispatch }) => ({
  empLeave: empLeaveData?.data,
  empDayOffLeave: empLeaveData?.dayOffData,
  // empDayWFHLeave: empLeaveData?.dayOffdata?.dataWFH,
  masterGlobalTypeData: fetchMasterGlobalTypeData?.data?.data,
  eventsData: eventsData?.data,
  dispatch,
})
export default connect(mapStateToProps)(AttendanceCalendar)
