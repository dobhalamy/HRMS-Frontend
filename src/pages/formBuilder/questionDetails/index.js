import React from 'react'
import { Row, Col, Modal, Typography } from 'antd'

const { Text } = Typography

const QuestionDetails = ({ question, showQuestionDetailModal, setShowQuestionDetailModal }) => {
  const onCancelModalHandler = () => {
    setShowQuestionDetailModal(false)
  }

  return (
    <Modal
      title="Question Detail"
      centered
      width={800}
      footer={false}
      visible={showQuestionDetailModal}
      onCancel={onCancelModalHandler}
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <p>
            <Text strong>Question :</Text> {question?.questionName} ?
          </p>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <p>
            <Text strong>Form Type :</Text> {question?.formType}
          </p>
        </Col>
        <Col className="gutter-row" span={8}>
          <p>
            <Text strong>Answer Type:</Text> {question?.answerType}
          </p>
        </Col>

        {question?.answerType === 'mcq' && (
          <Col className="gutter-row" span={8}>
            <p>
              <Text strong>Selection Type:</Text>
              {question?.selectionType === 0 ? <span> Single</span> : <span> Multiple</span>}
            </p>
          </Col>
        )}
      </Row>
      {question?.answerType === 'mcq' && (
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <p>
              <Text strong>Mcq Options:</Text>
              <ul>
                {question?.mcqOptions?.map((option) => (
                  <li key={option.options}>{option?.options}</li>
                ))}
              </ul>
            </p>
          </Col>
        </Row>
      )}
    </Modal>
  )
}
export default QuestionDetails
