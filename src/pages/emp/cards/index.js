import { Card, Image, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGTData } from 'redux/globalType/actions'
import image from '../../../../public/resources/images/avatars/avatar-2.png'
import styles from './style.module.scss'

const { Title } = Typography

const EmployeeCard = ({ empDetails }) => {
  const {
    empId = '',
    userPersonalEmail = '',
    userName = '',
    // userRole = '',
    userProfileImg,
    userDesignation,
  } = empDetails 
  const GTData = useSelector((state) => state?.fetchMasterGlobalTypeData?.GTdata)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGTData({ skip: 0, limit: 0 }))
  }, [dispatch])

  // Check if GTData exists and globalType is an array
  const isGlobalTypeArray = Array.isArray(GTData?.data?.globalType)

  // Check if userDesignation exists and is a non-empty string
  const isValidUserDesignation =
    typeof userDesignation === 'string' && userDesignation.trim() !== ''

  // Find the matched item
  const matchedItem =
    isGlobalTypeArray && isValidUserDesignation
      ? GTData?.data?.globalType?.find(
          (item) => item?.uniqueValue === userDesignation?.toLowerCase(),
        )
      : null

  const matchedDisplayName = matchedItem?.displayName || 'Super Admin'

  return (
    <Card
      hoverable
      title={
        <div className={styles.empImageContainer}>
          <Image
            width={200}
            height={200}
            style={{ objectFit: 'fill', borderRadius: '50%' }}
            alt="emp-profile"
            src={
              userProfileImg
                ? `http://${userProfileImg}`
                : image
            }
          />
        </div>
      }
      style={{
        // width: 300,
        overflow: 'hidden',
        height: '37rem',
      }}
    >
      <Title level={4}>Name: {userName}</Title>
      <Title level={5}>EmployeeId: {empId}</Title>
      <Title level={5}>Email: {userPersonalEmail}</Title>
      <Title level={5}>Designation: {matchedDisplayName}</Title>
      {/* <Title level={5}>
        Designation:{' '}
        {GTData?.data?.globalType?.map((item) =>
          item?.uniqueValue === userDesignation ? item?.displayName : '',
        )}
      </Title> */}
    </Card>
  )
}
export default EmployeeCard
