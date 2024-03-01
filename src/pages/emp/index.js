import React, { useCallback, useEffect, useState } from 'react'
import { Card, Button, Input, Space } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import {
  toggle,
  handlePagination,
  getEmployeeList,
  toggleLoading,
  handleEmpList,
} from 'redux/allEmployee/action'
import { SearchOutlined } from '@ant-design/icons'
import { fetchNewEmpId, getListOfEmployee, filterEmployee } from 'services/axios/emp'
import {
  defaultPagination,
  CheckPermission,
  manageCSVDownload,
  onPageChange,
  resetPagination,
  ModuleUniqueValues,
  Permissions,
  getLoggedInUserInfo,
} from 'utils'
import { debounce } from 'lodash'
import { setCurrentPage } from 'redux/settings/actions'

// import EmployeeCard from './cards'
// import styles from './style.module.scss'
import { setTourSteps } from 'redux/tour/actions'
import Tables from './tables'
import AddEmployeeForm from './addEmpForm'

let newEmpId = null

const Employee = () => {
  const [showEmpForm, setShowEmpForm] = useState(false)
  const switchTo = useSelector((state) => state.toggle.toggle)
  const { skip, limit } = useSelector((state) => state.toggle.pagination)
  const { employee, totalCount } = useSelector((state) => state?.toggle?.empList)
  // const { isMenuCollapsed } = useSelector((state) => state?.settings)
  // const { userRole } = useSelector((state) => state?.user?.userInfo)
  const { userRole } = getLoggedInUserInfo()
  const pagination = useSelector((state) => state?.toggle?.pagination)
  const loading = useSelector((state) => state?.toggle?.loading)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const oldPageSize = useSelector((state) => state.settings?.pageSize)

  const dispatch = useDispatch()
  // const onChange = (checked) => {
  //   dispatch(toggle(checked))
  //   defaultPagination(dispatch)
  // }
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

  const getFilteredEmployee = useCallback(
    async (employeeName) => {
      const filteredEmployee = await filterEmployee({ skip: 0, limit: 10, employeeName })
      if (filteredEmployee?.data?.status && filteredEmployee?.data?.message === 'success') {
        dispatch(handleEmpList(filteredEmployee?.data?.data))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination, dispatch],
  )
  const getListOfEmployees = useCallback(async () => {
    dispatch(getEmployeeList({ skip, limit }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, limit, dispatch])

  const handleDeleteSuccess = useCallback(() => {
    if (limit >= 10) {
      getListOfEmployees()
    }
  }, [getListOfEmployees, limit])

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
      getListOfEmployees()
    }
  }, [skip, limit, getListOfEmployees, showEmpForm])

  useEffect(() => {
    return () => {
      if (switchTo) dispatch(toggle(false))
    }
  }, [switchTo, dispatch])

  const handleAddEmployeeClick = async () => {
    const response = await fetchNewEmpId()
    if (response?.data?.statusCode === 200 && response?.data?.status) {
      newEmpId = response?.data?.data
      setShowEmpForm(() => true)
    }
  }
  const onChangeHandler = debounce((text) => {
    if (text) {
      getFilteredEmployee(text)
    } else {
      getListOfEmployees()
    }
    dispatch(setCurrentPage(1))
  }, 1000)

  const handleDownloadCSV = useCallback(async () => {
    dispatch(toggleLoading(true))

    const res = await getListOfEmployee({ skip: 0, limit: totalCount })
    if (res?.status === 200 && res?.data?.data) {
      manageCSVDownload(res?.data?.data?.employee)
    }
    dispatch(toggleLoading(false))
  }, [dispatch, totalCount])

  const getSteps = () => [
    {
      selector: '#searchEmp',
      content:
        'You can search an employee by entering name or alphabets, this filter will provide you all the matching values.',
    },
    {
      selector: '#addEmp',
      content: 'Add a new employee',
    },
    {
      selector: '#empTable',
      content: 'Find all the employee Data here',
    },
    {
      selector: '#editEmp',
      content: 'Edit an employee details',
    },
    {
      selector: '#deleteEmp',
      content: 'Delete an employee records',
    },
  ]

  const steps = getSteps()

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
              <CheckPermission
                permission={Permissions.SEARCH_FILTERS}
                moduleUniqueValue={ModuleUniqueValues.EMPLOYEES}
              >
                <Space className="searchEmp">
                  <Input
                    suffix={<SearchOutlined />}
                    placeholder="Search for Employee"
                    style={{ paddingTop: 8, paddingBottom: 8, width: 220 }}
                    onChange={(e) => onChangeHandler(e.target.value)}
                    size="middle"
                    id="searchEmp"
                  />
                </Space>
              </CheckPermission>
              <CheckPermission
                permission={Permissions.DOWNLOAD_DATA}
                moduleUniqueValue={ModuleUniqueValues.EMPLOYEES}
              >
                {switchTo && (
                  <Button
                    type="primary"
                    onClick={handleDownloadCSV}
                    style={{ marginRight: '1rem' }}
                    loading={loading}
                    size="middle"
                  >
                    Download CSV
                  </Button>
                )}
              </CheckPermission>
              {(userRole === 'super_admin' || userRole === 'hr') && (
                <CheckPermission
                  permission={Permissions.ADD}
                  moduleUniqueValue={ModuleUniqueValues.EMPLOYEES}
                >
                  <Button
                    type="primary"
                    onClick={handleAddEmployeeClick}
                    loading={loading}
                    size="middle"
                    id="addEmp"
                  >
                    Add employee
                  </Button>
                </CheckPermission>
              )}
            </Space>
          </>
        }
        loading={loading}
      >
        {showEmpForm && (
          <AddEmployeeForm
            showEmpForm={showEmpForm}
            setShowEmpForm={setShowEmpForm}
            newEmpId={newEmpId}
          />
        )}

        {/* <div className={styles.switch}>
          <Switch
            checkedChildren={<TableOutlined />}
            unCheckedChildren={<UnorderedListOutlined />}
            defaultChecked={switchTo}
            onChange={onChange}
          />
        </div> */}
        {/* {switchTo ? ( */}
        <Tables
          empDetails={employee || []}
          totalCount={totalCount || 0}
          handlePageChange={handlePageChange}
          limit={limit}
          handleDeleteSuccess={handleDeleteSuccess}
        />
        {/* ) : ( */}
        {/* <Row className={styles.empCard}>
            {employee?.length > 0 &&
              employee?.map((item) => {
                return (
                  <Col className="gutter-row" span={isMenuCollapsed ? 5 : 6} key={item?.empId}>
                    <EmployeeCard empDetails={item} />
                  </Col>
                )
              })}
          </Row>
        )} */}
        {/* {!switchTo && (
          <Pagination
            style={{ textAlign: 'end' }}
            defaultPageSize={oldPageSize}
            total={totalCount}
            onChange={handlePageChange}
            current={parseInt(currentPage, 10)}
            responsive
          />
        )} */}
      </Card>
    </>
  )
}

export default Employee
