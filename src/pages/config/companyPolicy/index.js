import React, { useEffect } from 'react'
import TextEditor from 'components/textEditor'
import { setTourSteps } from 'redux/tour/actions'
import { useDispatch } from 'react-redux'

const CompanyPolicy = () => {
  const dispatch = useDispatch()
  const getStep = [
    {
      selector: '#companyPolicy',
      content: 'Enter Policies for the company',
    },
  ]
  const steps = getStep

  useEffect(() => {
    dispatch(setTourSteps(steps))
  })
  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="card" id="companyPolicy">
            <div className="card-body">
              <TextEditor title="companyPolicy" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompanyPolicy
