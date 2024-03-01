import React, { useEffect, useState, useCallback } from 'react'
import { Table, Space, Button, Card, Input } from 'antd'
import { EditFilled, EyeFilled } from '@ant-design/icons'
// import { getAllProjectInfoList } from 'services/axios/projectManagement'
import { getAllProjectInfo, handlePagination, handleSearchProject } from 'redux/projectInfo/action'
import { useSelector, useDispatch } from 'react-redux'
import { onPageChange, onPageSizeChange, resetPagination, defaultPagination } from 'utils'
import { debounce } from 'lodash'
import moment from 'moment'
import AddNewProject from './addNewProject'
import ViewProject from './viewProject'
import EditProject from './editProject'
import AssignDeveloper from './assignDeveloper'

const ProjectManagement = () => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  // const userRole = getLoggedInUserInfo()?.userRole
  const dispatch = useDispatch()
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)
  const projectInfoData = useSelector((state) => state?.projectInfo?.projectInfoData)
  const searchedProject = useSelector((state) => state?.projectInfo?.searchedProject)
  const totalCount = useSelector((state) => state?.projectInfo?.totalCount)
  const pagination = useSelector((state) => state?.projectInfo?.pagination)
  const [projectData, setProjectData] = useState({})
  // const { skip, limit } = pagination
  // getAllProjectInfoList({ skip, limit })

  // const handleDelete = (record) => {
  //   setShowDeleteModal(true)
  //   setH2hData(record)
  // }
  // const onViewHandle = (record) => {
  //   setShowViewModal(true)
  //   setH2hData(record)
  // }

  const onViewHandle = (record) => {
    setShowViewModal(true)
    setProjectData(record)
  }
  const handleEditForm = (record) => {
    setProjectData(record)
    setShowEditForm(true)
  }
  const handleAssignDeveloper = (record) => {
    setShowAssignModal(true)
    setProjectData(record)
  }

  // const handleEditForm = (record) => {
  //   setH2hData(record)
  //   setShowEditForm(true)
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
  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }

  // const getFilteredProject = useCallback(
  //   async (projectName) => {
  //     const filteredProject = await filteredProject({ skip: 0, limit: 10, projectName })
  //     if (filteredProject?.data?.status && filteredProject?.data?.message === 'success') {
  //       dispatch(handleProjectList(filteredProject?.data?.data))
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [pagination, dispatch],
  // )

  const getAllProjectData = useCallback(async () => {
    const { skip, limit } = pagination
    dispatch(
      getAllProjectInfo({
        skip,
        limit,
        searchedProject,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination, searchedProject])
  const handleSearchChange = debounce((searchProject) => {
    if (searchProject === null || searchProject === '') {
      dispatch(handleSearchProject(null))
    } else {
      dispatch(handleSearchProject(searchProject))
    }
    handlePageChange(1)
  }, 1000)

  // const getListOfProjects = useCallback(async () => {
  //   dispatch(getAllProjectInfo())
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch])

  // const onChangeHandler = debounce((text) => {
  //   if (text) {
  //     getFilteredProject(text)
  //   } else {
  //     getListOfProjects()
  //   }
  //  // dispatch(setCurrentPage(1))
  // }, 1000)

  useEffect(() => {
    return () => {
      // CleanUp the value of skip and limitS
      dispatch(handlePagination(resetPagination))
      defaultPagination(dispatch)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getAllProjectData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getAllProjectData])

  const columns = [
    { title: 'Project ID', dataIndex: 'projectId', render: (_, record) => record?.projectId },
    {
      title: 'Client Name',
      dataIndex: 'clientId',
      render: (_, record) =>
        `${record?.clientInfo?.contactPersonName} (${record?.clientInfo?.businessName})`,
    },
    { title: 'Project Name', dataIndex: 'projectName', render: (_, record) => record?.projectName },
    { title: 'Billing Type', dataIndex: 'billingType', render: (_, record) => record?.billingType },
    // {
    //   title: 'Project Source',
    //   dataIndex: 'projectSource',
    //   render: (_, record) => record?.projectSource,
    // },
    {
      title: 'Technology Require',
      dataIndex: 'technology',
      render: (_, record) => {
        const technologyArr = JSON.parse(record?.technology)
        return technologyArr?.join(', ')
      },
    },
    {
      title: 'Project Start Date',
      dataIndex: 'projectStartDate',
      render: (_, record) => {
        const date = moment(record?.projectStartDate).format('YYYY-MM-DD')
        return date
      },
    },
    {
      title: 'Assign Developer',
      dataIndex: 'developer',
      render: (_, record) => (
        <Space size="middle">
          <>
            <Button type="primary" onClick={() => handleAssignDeveloper(record)} id="view">
              Assign Developer
            </Button>
          </>
        </Space>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Space size="middle">
            <>
              <Button type="primary" onClick={() => onViewHandle(record)} id="view">
                <EyeFilled />
              </Button>
              <Button type="primary" onClick={() => handleEditForm(record)} id="edit">
                <EditFilled />
              </Button>
              {/* <Button 
              type="primary" 
              // onClick={() => handleDelete(record)} 
              id="delete"
            >
              <DeleteFilled />
            </Button> */}
            </>
          </Space>
        </>
      ),
    },
  ]

  // const getSteps = () => {
  //   if (userRole !== 'hr') {
  //     const steps = [
  //       {
  //         selector: '#addH2h',
  //         content: 'Add your happy to help request',
  //       },
  //     ]
  //     if (happyToHelpList && happyToHelpList?.length > 0) {
  //       steps.push(
  //         {
  //           selector: '#view',
  //           content: 'View details of raised request',
  //         },
  //         {
  //           selector: '#edit',
  //           content: 'Edit raised request',
  //         },
  //         {
  //           selector: '#delete',
  //           content: 'Delete the raised request',
  //         },
  //       )
  //     }
  //     return steps
  //   }
  //   if (happyToHelpList && happyToHelpList.length > 0) {
  //     return [
  //       {
  //         selector: '#view',
  //         content: 'View details of raised request',
  //       },
  //       {
  //         selector: '#edit',
  //         content: 'Edit raised request',
  //       },
  //       {
  //         selector: '#delete',
  //         content: 'Delete the raised request',
  //       },
  //     ]
  //   }
  //   return 0
  // }

  // const steps = getSteps()
  // useEffect(() => {
  //   dispatch(setTourSteps(steps))
  // }, [steps, dispatch])

  // useEffect(() => {
  //   const { skip, limit } = pagination
  //   dispatch(getAllHappyToHelpList({ skip, limit }))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, pagination])

  // const dataS = []

  return (
    <>
      <Card
        extra={
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <Space className="searchProject">
              <Input
                placeholder="Search Project"
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ width: 200 }}
              />
            </Space>
            <AddNewProject />
          </Space>
        }
      >
        <Table
          dataSource={projectInfoData || []}
          columns={columns}
          rowKey="id"
          pagination={{
            defaultPageSize: oldPageSize,
            current: parseInt(currentPage, 10),
            total: totalCount,
            responsive: true,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
            showSizeChanger: true,
            locale: { items_per_page: '' },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 900, y: 450 }}
        />
      </Card>
      {/* {showDeleteModal && (
        <DeleteH2H
          setShowDeleteModal={setShowDeleteModal}
          showDeleteModal={showDeleteModal}
          h2hData={h2hData}
        />
      )} */}
      {showViewModal && (
        <ViewProject
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          projectData={projectData}
        />
      )}
      {showEditForm && (
        <EditProject
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          projectData={projectData}
        />
      )}
      {showAssignModal && (
        <AssignDeveloper
          showAssignModal={showAssignModal}
          setShowAssignModal={setShowAssignModal}
          projectData={projectData}
        />
      )}
    </>
  )
}

export default ProjectManagement
