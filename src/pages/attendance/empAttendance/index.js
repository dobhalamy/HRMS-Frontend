import { Card, Tag, Select } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { singleEmpAttendance, handleYear } from 'redux/attendance/action'
import { generateYears } from 'utils'
import { setTourSteps } from 'redux/tour/actions'
import styles from '../style.module.scss'

const EmployeeModel = () => {
  const year = useSelector((state) => state.attendanceData.year)
  const singleEmployee = useSelector((state) => state.attendanceData.singleAttendance)
  const years = generateYears()
  const dispatch = useDispatch()
  const fetchData = useCallback(async () => {
    dispatch(singleEmpAttendance(year))
  }, [year, dispatch])
  useEffect(() => {
    fetchData()
  }, [fetchData])
  const getYear = (attendanceYear) => {
    dispatch(handleYear(attendanceYear))
  }
  const handleChange = (SelectedYear) => {
    getYear(SelectedYear)
  }

  const getSteps = [
    {
      selector: '#empAttendance',
      content: 'Find your attendance record here',
    },
    {
      selector: '#year',
      content: 'Get the attendance record for the selected year',
    },
  ]

  const steps = getSteps
  useEffect(() => {
    dispatch(setTourSteps(steps))
  }, [steps, dispatch])
  return (
    <>
      <Card
        style={{ textAlign: 'center' }}
        title={`Employee Attendance ${year}`}
        extra={
          <Select
            defaultValue={year}
            options={years}
            onChange={handleChange}
            style={{
              width: 100,
            }}
            dropdownStyle={{ textAlign: 'center' }}
            id="year"
          />
        }
        id="empAttendance"
      >
        <div className="row">
          {singleEmployee.length > 0 ? (
            singleEmployee.map((item, key) => (
              <div className="col-lg-3 col-md-12" key={key}>
                <div className="card">
                  <div className="card-body">
                    <h5>
                      <Tag color="Orange" key={key}>
                        {item.monthName}
                      </Tag>
                    </h5>
                    <p className={styles.singleEmployee}>Present days: {item.presentDays}</p>
                    <p>Working days: {item.workingDays}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No attendance data found for {year}.</p>
          )}
        </div>
      </Card>
    </>
  )
}

export default EmployeeModel
