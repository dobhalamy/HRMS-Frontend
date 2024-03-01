import { Button, Drawer, Space } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { PlusCircleFilled } from '@ant-design/icons'
import DsrForm from '../dsrForm'

const AddDsr = () => {
  const [openForm, setOpenForm] = useState(false)
  const isLoading = useSelector((state) => state?.settings?.isLoading)

  const showLargeDrawer = () => {
    setOpenForm(true)
  }
  const onDsrClose = () => {
    setOpenForm(false)
  }

  return (
    <>
      <div>
        <Space>
          <Button
            id="addDsr"
            type="primary"
            onClick={showLargeDrawer}
            size="large"
            style={{ width: 220 }}
            loading={isLoading}
          >
            <PlusCircleFilled /> Fill Daily Report
          </Button>
        </Space>
      </div>

      <Drawer
        title="Status Report Form"
        placement="right"
        width={1000}
        onClose={onDsrClose}
        visible={openForm}
      >
        <DsrForm setOpenForm={setOpenForm} />
      </Drawer>
    </>
  )
}
export default AddDsr
