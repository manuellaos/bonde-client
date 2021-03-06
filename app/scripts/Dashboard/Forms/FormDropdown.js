import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'


class FormDropdown extends Component {
  render() {
    const formGroup = this.context.$formGroup
    const { controlId, ...field } = formGroup || {}
    const { className, children, ...props } = this.props

    return (
      <select
        id={controlId}
        className={classnames('select col-12', className)}
        {...props}
        {...field}
      >
        {!!children && children}
      </select>
    )
  }
}

FormDropdown.contextTypes = {
  $formGroup: PropTypes.object
}

FormDropdown.propTypes = {
  id: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
}

export default FormDropdown
