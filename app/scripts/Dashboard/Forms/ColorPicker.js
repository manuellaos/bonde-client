import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import ColorPickerTheme from '../../../components/ColorPicker'

class ColorPicker extends Component {
  render() {
    const formGroup = this.context.$formGroup
    const { value, onChange } = formGroup || {}
    const { className, ...props } = this.props

    return (
      <div className={classnames('mt1 mb3', className)}>
        <ColorPickerTheme
          {...props}
          onChangeColor={color => onChange(color.hex)}
          color={value}
        />
      </div>
    )
  }
}

ColorPicker.contextTypes = {
  $formGroup: PropTypes.object,
}

ColorPicker.propTypes = {
  dispatch: PropTypes.func.isRequired,
  theme: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

export default ColorPicker
