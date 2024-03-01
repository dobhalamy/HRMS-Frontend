import React, { useCallback, useEffect, useState } from 'react'
import { Card, Input, Space, Select } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { handlePagination, getTraineeList } from 'redux/allEmployee/action'
import { SearchOutlined } from '@ant-design/icons'
import { defaultPagination, onPageChange, resetPagination } from 'utils'
import { debounce } from 'lodash'
import { setTourSteps } from 'redux/tour/actions'
import Tables from './tables'

const Employee = () => {
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const { trainees, totalCount } = useSelector((state) => state?.toggle?.traineeList)
  const { userRole } = useSelector((state) => state?.user?.userInfo)
  const loading = useSelector((state) => state?.toggle?.loading)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const [searchEmployee, setSearchEmployee] = useState(false)
  const dispatch = useDispatch()

  const handlePageChange = (pageNumber, pageSize) => {
    onPageChange({
      totalCount,
      pageSize,
      currentPage,
      oldPageSize,
      pageNumber,
      dispatch,
      handlePagination,
    })
  }

  const getListOfTrainees = useCallback(async () => {
    dispatch(getTraineeList({ status: 0, skip, limit, employeeName: null }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, dispatch])

  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (limit >= 10) {
      getListOfTrainees()
    }
  }, [skip, limit, getListOfTrainees, dispatch, userRole])

  const onChangeHandler = debounce((text) => {
    setSearchEmployee(text)
    if (text) {
      dispatch(getTraineeList({ skip, limit, employeeName: text }))
    } else {
      getListOfTrainees()
    }
  }, 1000)

  const traineeAssignStatus = [
    {
      label: 'Allocated',
      value: 3,
    },
    {
      label: 'Un-allocated',
      value: 2,
    },
  ]

  const onChangeHandlerTraineeStatus = (value) => {
    if (value) {
      dispatch(getTraineeList({ status: value, skip, limit, employeeName: null }))
    } else {
      dispatch(getTraineeList({ skip: 0, limit: 10 })) // Fetch all trainees
    }
  }

  const getSteps = () => {
    if (userRole === 'hr' && trainees && trainees.length > 0) {
      return [
        {
          selector: '#assignTrainer',
          content: 'Assign a Trainer.',
        },
        {
          selector: '#viewTrainee',
          content: 'View trainee details.',
        },
      ]
    }
    if (userRole === 'manager') {
      const steps = [
        {
          selector: '#searchTraineesByStatus',
          content: 'Search allocated or un-allocated trainees.',
        },
      ]
      if (trainees && trainees?.length > 0) {
        steps.push(
          {
            selector: '#viewTrainee',
            content: 'View trainee details.',
          },
          {
            selector: '#assignM',
            content: 'Assign Manager, Ass.Manager and TL.',
          },
        )
      }
      return steps
    }
    if (userRole === 'trainer' && trainees && trainees?.length > 0) {
      return [
        {
          selector: '#viewTrainee',
          content: 'View trainee details.',
        },
        {
          selector: '#editTrainee',
          content:
            "Edit trainee's details by selecting training start/end date, providing certification status, handing over to Manager.",
        },
      ]
    }
    return [
      {
        selector: '#viewTrainee',
        content: 'View trainee details.',
      },
    ]
  }

  const steps = getSteps(userRole)

  useEffect(() => {
    dispatch(setTourSteps(steps))
  }, [steps, dispatch])

  return (
    <>
      <Card
        extra={
          <>
            <Space
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              {userRole === 'manager' && (
                <Select
                  allowClear
                  style={{
                    width: 250,
                  }}
                  size="large"
                  placeholder="Status"
                  options={traineeAssignStatus}
                  onChange={onChangeHandlerTraineeStatus}
                  id="searchTraineesByStatus"
                />
              )}
              <Space>
                <Input
                  suffix={<SearchOutlined />}
                  placeholder="Search for Trainee"
                  style={{ paddingTop: 8, paddingBottom: 8, width: 220 }}
                  onChange={(e) => onChangeHandler(e.target.value)}
                  size="large"
                />
              </Space>
            </Space>
          </>
        }
        loading={loading}
      >
        <Tables
          empDetails={trainees || []}
          totalCount={totalCount || 0}
          handlePageChange={handlePageChange}
          limit={limit}
          searchEmployee={searchEmployee}
        />
      </Card>
    </>
  )
}

export default Employee
