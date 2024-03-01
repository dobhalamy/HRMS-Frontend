import React, { useState, useEffect } from 'react'
import { PlusOutlined, CameraOutlined } from '@ant-design/icons'
import { Upload, Avatar, notification } from 'antd'
import { getConfig } from 'services/utils'
import { getUserDetailedInfo } from 'redux/user/actions'
import { updateEmployeeData } from 'services/axios/emp'
import { useSelector } from 'react-redux'
import style from './style.module.scss'

const UploadProfilePicture = ({ userDetailedInfo }) => {
  const [image, setImage] = useState(null)
  const [profileData, setProfileData] = useState(null)

  const loading = useSelector((state) => state?.toggle?.loading)
  useEffect(() => {
    if (userDetailedInfo && userDetailedInfo?.userProfileImg) {
      setImage(userDetailedInfo?.userProfileImg?.mediaLink)
    }
  }, [userDetailedInfo])

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      setProfileData(info.file.originFileObj)
      getUserDetailedInfo(userDetailedInfo?.userId)
    }
  }
  const { headers } = getConfig()
  const newHeaders = `Bearer ${headers.Authorization}`

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload Profile
      </div>
    </div>
  )
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_DEV_BASE_URL
      : process.env.REACT_APP_PROD_BASE_URL
  const uploadUrl = image
    ? `${baseURL}/media/updateProfileImage`
    : `${baseURL}/media/uploadProfileImage`

  console.log('image', `${baseURL}/${image}`)
  const imagePathUrl = baseURL.replace('/api/v1', '')
  const methodType = image ? 'PATCH' : 'POST'
  return (
    <>
      {image && (
        <div loading={loading}>
          <Avatar size={100} src={image && `${imagePathUrl}/${image}`} />
        </div>
      )}
      <Upload
        accept={['.png', '.jpg', '.jpeg']}
        profileData={profileData}
        multiple={false}
        style={{ display: 'flex', justifyContent: 'center' }}
        customRequest={({ file, onSuccess, onError }) => {
          const formData = new FormData()
          formData.append('id', userDetailedInfo?.userProfileImg?.id)
          formData.append('userId', userDetailedInfo?.userId)
          formData.append('mediaType', 'Image')
          formData.append('empId', userDetailedInfo?.empId)
          formData.append('file', file)
          fetch(uploadUrl, {
            method: methodType,
            headers: {
              Authorization: newHeaders,
            },
            body: formData,
          })
            .then((response) => {
              if (response.ok) {
                return response.json()
              }
              throw new Error('Request failed')
            })
            .then((responseData) => {
              setImage(responseData?.mediaLink)
              if (responseData?.statusCode === 200) {
                const userProfileImg = {
                  id: responseData?.id,
                  mediaLink: responseData?.mediaLink,
                  mediaType: responseData?.mediaType,
                }
                userDetailedInfo.userProfileImg = userProfileImg
                const result = updateEmployeeData({ ...userDetailedInfo })

                if (result?.status === 200 && result?.data?.status) {
                  notification.success({
                    message: 'Success',
                    description: 'Profile Picture Uploaded successfully',
                  })
                }
              }

              onSuccess()
            })
            .catch((error) => {
              console.error(error)
              onError(error)
            })
        }}
        onChange={handleChange}
        maxCount={1}
        showUploadList={false}
      >
        {image ? (
          <div className={style?.cameraIcon}>
            <CameraOutlined style={{ marginBottom: '1px', fontSize: '24px', color: 'white' }} />
          </div>
        ) : (
          <div> {uploadButton}</div>
        )}
      </Upload>
    </>
  )
}
export default UploadProfilePicture
