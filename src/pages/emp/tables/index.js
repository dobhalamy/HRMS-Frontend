import { EditFilled, DeleteFilled } from '@ant-design/icons'
import { Space, Table, Button } from 'antd'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { handlePagination } from 'redux/allEmployee/action'
import { onPageSizeChange, capitalizeAllLetters } from 'utils'
import EditEmployeeForm from '../editEmpForm'
import DeleteEmp from '../deleteEmp'

// add empDetails in EmpTable
const EmpTable = ({ empDetails, totalCount, handlePageChange, handleDeleteSuccess }) => {
  const [showEditEmpForm, setShowEditEmpForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [empData, setEmpData] = useState({})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const oldPageSize = useSelector((state) => state.settings?.pageSize)
  const currentPage = useSelector((state) => state.settings?.currentPage)

  const columns = [
    {
      title: 'Employee Id',
      dataIndex: 'empId',
      key: 'empId',
    },
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'Email',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'empMobileNumber',
      key: 'Mobile Number',
      render: (_, record) => {
        return <span>+{record?.empMobileNumber}</span>
      },
    },

    // {
    //   title: 'Active',
    //   dataIndex: 'isActive',
    //   key: 'Is Active',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Switch
    //         checkedChildren={<CheckOutlined />}
    //         unCheckedChildren={<CloseOutlined />}
    //         defaultChecked={record?.isActive}
    //         onChange={(checked) => handleEmpIsActiveChange(record, checked)}
    //         data={record?.isActive}
    //       />
    //     </Space>
    //   ),
    // },
    {
      title: 'Designation',
      dataIndex: 'userDesignation',
      key: 'userDesignation',
      render: (_, record) => {
        const capitalizedDesignation = capitalizeAllLetters(record?.userDesignation)
        return <div>{capitalizedDesignation || <p>N/A</p>}</div>
      },
    },
    {
      title: 'Document',
      dataIndex: 'documents',
      key: 'documents',
      render: (doc) => {
        if (doc?.length === 0) {
          return <>None</>
        }

        const mediaTypes = doc?.map((item) => item?.mediaType)
        const joinedMediaTypes = mediaTypes?.join(', ')

        return <>{joinedMediaTypes}</>
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onClickHandler(record)} id="editEmp">
            <EditFilled />
          </Button>
          <Button type="primary" onClick={() => handleDeleteClick(record)} id="deleteEmp">
            <DeleteFilled />
          </Button>
        </Space>
      ),
    },
  ]
  const handleDeleteClick = (record) => {
    setEmpData(record)
    setShowModal(true)
  }
  const onClickHandler = (record) => {
    setEmpData(record)
    setShowEditEmpForm(true)
  }
  // const handleEmpIsActiveChange = async (empDetail, isActive) => {
  //   const status = isActive ? 1 : 0
  //   // api call to handle user is active role change
  //   const res = await updateEmployeeData({
  //     ...empDetail,
  //     isActive: status,
  //   })
  //   if (res?.data?.status && res?.status === 200) {
  //     notification.success({
  //       message: 'Success',
  //       description: 'Status updated successfully',
  //     })
  //   }
  // }

  const handlePageSizeChange = (_, pageSize) => {
    onPageSizeChange({ oldPageSize, pageSize, dispatch, handlePagination })
  }
  return (
    <>
      <Table
        dataSource={empDetails}
        rowKey="userId"
        id="empTable"
        columns={columns}
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
      {showEditEmpForm && (
        <EditEmployeeForm
          showEditEmpForm={showEditEmpForm}
          setShowEditEmpForm={setShowEditEmpForm}
          data={empData}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      <DeleteEmp
        showModal={showModal}
        setShowModal={setShowModal}
        empData={empData}
        handleDeleteSuccess={handleDeleteSuccess}
      />
    </>
  )
}
export default EmpTable
