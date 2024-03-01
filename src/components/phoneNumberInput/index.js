import React from 'react'
import PhoneInput from 'react-phone-input-2'
import PropTypes from 'prop-types'
import 'react-phone-input-2/lib/style.css'

const PhoneNumberInput = ({ country, phoneNumber, onPhoneChange, placeholder, inputProps }) => {
  return (
    <PhoneInput
      country={country}
      value={phoneNumber}
      onChange={onPhoneChange}
      placeholder={placeholder}
      enableAreaCodes
      inputProps={inputProps}
    />
  )
}
PhoneNumberInput.propTypes = {
  country: PropTypes.string,
  phoneNumber: PropTypes.string,
  onPhoneChange: PropTypes.func,
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
}
PhoneNumberInput.defaultProps = {
  country: 'in',
  phoneNumber: '',
  onPhoneChange: (x) => x,
  placeholder: '',
  inputProps: {},
}
export default PhoneNumberInput
