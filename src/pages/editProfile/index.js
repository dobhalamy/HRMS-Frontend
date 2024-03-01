import React, { useEffect, useState } from 'react'
import { EnvironmentFilled, PhoneFilled, MailFilled } from '@ant-design/icons'
import { Card, Row, Col, Typography, Tag, Space, Tabs } from 'antd'
import { connect } from 'react-redux'
import { getUserDetailedInfo } from 'redux/user/actions'
import PersonalDetailForm from './personalDetailForm'
// import SkillForm from './skillForm'
import PersonalDocuments from './personalDocuments'
import UploadProfilePicture from './UploadProfilePicture'

const { Title, Text } = Typography

const mapStateToProps = ({ user }) => ({ user })

const Index = ({ user, dispatch }) => {

  const userId = user?.userInfo?.userId
  const { userDetailedInfo } = user
  const [updateUser, setUpdate] = useState(null)
  const handlePersonalDetailUpdate = async (updatedInfo) => {
    setUpdate(updatedInfo)
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        await dispatch(getUserDetailedInfo(userId))
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserDetails()
  }, [dispatch, userId, updateUser])

  return (
    <Card>
      <Row>
        <Col span={18}>
          <Card style={{ height: '100%' }}>
            <Tabs defaultActiveKey="tab1" tabPosition="left">
              <Tabs.TabPane tab="Personal Info" key="tab1">
                <PersonalDetailForm
                  userDetailedInfo={userDetailedInfo}
                  onUpdate={handlePersonalDetailUpdate}
                />
              </Tabs.TabPane>
              {/* <Tabs.TabPane tab="Appraisal Info" key="tab2">
                <div>Appraisal info</div>
              </Tabs.TabPane> */}
              <Tabs.TabPane tab="Documents" key="tab3">
                <PersonalDocuments userDetailedInfo={userDetailedInfo} />
              </Tabs.TabPane>
              {/* <Tabs.TabPane tab="Skills" key="tab4">
                <SkillForm />
              </Tabs.TabPane> */}
            </Tabs>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', border: 'none' }}>
            <Space direction="vertical">
              <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
                <UploadProfilePicture userDetailedInfo={userDetailedInfo} />
                <Title level={4}>{userDetailedInfo?.userName}</Title>
                <Tag color="#108ee9">
                  {userDetailedInfo?.designation
                    ? userDetailedInfo?.designation?.displayName
                    : 'N/A'}
                </Tag>
              </div>
              <Space direction="vertical" style={{ textAlign: 'left' }}>
                <Text type="secondary">Contact Information</Text>
                <span>
                  <EnvironmentFilled style={{ paddingRight: '0.5rem' }} />
                  <Text>{userDetailedInfo?.empCurrentAddress}</Text>
                </span>
                <span>
                  <PhoneFilled style={{ paddingRight: '0.5rem' }} />
                  <Text>(+91 {userDetailedInfo?.empMobileNumber?.substring(2)})</Text>
                </span>
                <span>
                  <MailFilled style={{ paddingRight: '0.5rem' }} />
                  <Text>{userDetailedInfo?.userPersonalEmail}</Text>
                </span>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default connect(mapStateToProps)(Index)
