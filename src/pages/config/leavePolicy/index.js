import React, { useEffect } from 'react'
import TextEditor from 'components/textEditor'
import { useDispatch } from 'react-redux'
import { setTourSteps } from 'redux/tour/actions'

const LeavePolicy = () => {
  const dispatch = useDispatch()
  const getStep = [
    {
      selector: '#leavePolicy',
      content: 'Enter Policies for the leave',
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
          <div className="card" id="leavePolicy">
            <div className="card-body">
              <TextEditor title="leavePolicy" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeavePolicy
