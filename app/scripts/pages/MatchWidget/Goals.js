import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as WidgetActions from './../../Widget/actions'

import MatchPage from './MatchPage'
import ChoiceCombined from './ChoiceCombined'


export default class Goals extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.bindWidgetActions = bindActionCreators(WidgetActions, props.dispatch)
  }

  widget(props = this.props) {
    const { widgets, params } = props
    const widgetsStringId = widgets.data.map(widget => widget.id.toString())
    const widgetIndex = widgetsStringId.indexOf(params.widget_id)
    return widgets.data[widgetIndex]
  }

  finishedUploadFile(goal) {
    const { auth } = this.props
    this.bindWidgetActions.createOrUpdateMatch({
      widget_id: this.widget().id,
      credentials: auth.credentials,
      match: goal
    })
  }

  getOrCreateMatch(widget, first_choice, second_choice) {
    const combineds = widget.match_list.filter((match) => {
      return match.first_choice == first_choice && match.second_choice == second_choice
    })
    if (combineds && combineds.length > 0) {
      return combineds.slice(-1)[0]
    }
    return {
      first_choice: first_choice,
      second_choice: second_choice
    }
  }

  renderCombineChoices() {
    const { settings: { choices1 } } = this.widget()
    const firstChoices = choices1 ? choices1.split(',') : []

    return firstChoices.map((a) => {
      return <div>
        <h2>{a}</h2>
        <div className="clearfix">
          { this.renderSecondChoices(a) }
        </div>
      </div>
    })
  }

  renderSecondChoices(a) {
    const widget = this.widget()
    const { settings: { choicesA } } = widget
    const secondChoices = choicesA ? choicesA.split(',') : []

    return secondChoices.map((b, index) => {
      const isLast = index === secondChoices.length-1
      const match = this.getOrCreateMatch(widget, a, b)
      let props = {
        match: match,
        classes: isLast ? ['mb3'] : [],
        handleUploadFinish: this.finishedUploadFile.bind(this)
      }
      return <ChoiceCombined {...props} />
    })
  }

  render() {
    const { mobilization, location } = this.props
    const widget = this.widget()
    return(
      <MatchPage mobilization={mobilization} location={location} widget={widget}>
        <div className="p3 flex-auto overflow-scroll">
          <h1>Combinações</h1>
          { this.renderCombineChoices() }
        </div>
      </MatchPage>
    )
  }
}

Goals.propTypes = {
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  mobilization: PropTypes.object,
  widgets: PropTypes.object
}

Goals.contextTypes = {
  router: PropTypes.object.isRequired
}