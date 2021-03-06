import React, { PropTypes } from 'react'

import Widget from '../../../../modules/widgets/components'

const BlockWidgets = ({ widgets, props, onChange }) => {
  return <div>
    {widgets.map(widget => (
      <Widget
        {...props}
        key={`widget-${widget.id}`}
        widget={widget}
        onEdit={() => onChange({ editingWidget: true })}
        onCancelEdit={() => onChange({ editingWidget: false })}
      />
    ))}
  </div>
}

BlockWidgets.propTypes = {
  widgets: PropTypes.array,
  props: PropTypes.object,
  onChange: PropTypes.func,
}

export default BlockWidgets
