import { Button, Drawer, Select } from 'antd'
import React, { useState } from 'react'
import { FilterFilled } from '@ant-design/icons'
import { generateYears } from 'utils'

const Years = generateYears()
const SideMenu = ({ onChange, currentYear }) => {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }
  const handleChange = (year) => {
    onChange(year)
  }

  return (
    <>
      <Button onClick={showDrawer}>
        <FilterFilled />
      </Button>
      <Drawer title="Date" placement="right" visible={visible} onClose={onClose}>
        <Select
          defaultValue={currentYear}
          options={Years}
          onChange={handleChange}
          style={{
            width: 150,
          }}
        />
      </Drawer>
    </>
  )
}
export default SideMenu
