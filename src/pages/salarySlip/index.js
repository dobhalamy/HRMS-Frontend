import React, { useCallback, useEffect } from 'react'
import { useDispatch, connect } from 'react-redux'
import { handleSalarySlip, handlePagination, handelYear } from 'redux/media/action'
import { resetPagination } from 'utils'
import UserSalarySlip from './userSalarySlip'
import AdminSalarySlip from './adminSalarySlip'

const SalarySlip = ({ userData, totalCount, salarySlip, year }) => {
  const userRole = userData?.userRole
  const dispatch = useDispatch()
  const fetchData = useCallback(async () => {
    const value = {
      mediaType: 'salary_slip',
      year,
    }
    dispatch(handleSalarySlip(value))
  }, [dispatch, year])
  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])
  const getYear = (attendanceYear) => {
    dispatch(handelYear(attendanceYear))
  }
  const handleChangedPagination = (pageNumber) => {
    const pageLimit = parseInt(pageNumber * 10, 10)
    const pageSkip = parseInt(pageLimit - 10, 10)
    dispatch(
      handlePagination({
        limit: pageLimit,
        skip: pageSkip,
      }),
    )
  }

  return (
    <>
      {userRole === 'admin' ? (
        <AdminSalarySlip
          year={year}
          totalCount={totalCount}
          salarySlip={salarySlip}
          getSalarySlipYear={getYear}
          handleChangedPagination={handleChangedPagination}
        />
      ) : (
        <UserSalarySlip year={year} getSalarySlipYear={getYear} salarySlip={salarySlip} />
      )}
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    year: state?.getDocument?.year,
    salarySlip: state?.getDocument?.salarySlips,
    totalCount: state?.getDocument?.totalCount,
    userData: state?.user?.userInfo,
  }
}
export default connect(mapStateToProps)(SalarySlip)
