import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navigation } from 'react-router'
import reactMixin from 'react-mixin'

// Global module dependencies
import * as Paths from '../../../../scripts/Paths'
import { actionCreators as SelectableActions } from '../../../../components/SelectableList'

// Parent module dependencies
import * as MobilizationActions from '../../action-creators'
import * as MobilizationSelectors from '../../selectors'

// Current module dependencies
import { TemplateSelectableList } from '../components'
import * as TemplateSelectors from '../selectors'

@reactMixin.decorate(Navigation)
class TemplateChooseCustomPage extends Component {
  render() {
    const { mobilization, createMobilizationFromTemplate, ...listableProps } = this.props

    return (
      <div className='choose-custom-page col-12'>
        <h3 className='h1 mt0 mb3 center'>Meus Templates</h3>
        <TemplateSelectableList
          {...listableProps}
          handleSelectItem={({ id: template_mobilization_id }) => {
            createMobilizationFromTemplate({ id: mobilization.id, template_mobilization_id })
              .then(() => {
                this.transitionTo(Paths.editMobilization(mobilization.id))
                return Promise.resolve()
              })
              .catch(error => console.error('CreateMobilizationFromTemplateAsyncError', error))
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  mobilization: MobilizationSelectors.getCurrent(state),
  templates: TemplateSelectors.getCustomTemplates(state),
  filterableTemplates: TemplateSelectors.getFilterableTemplates(state),
  selectedIndex: TemplateSelectors.getSelectableIndex(state),
})

const mapActionCreatorsToProps = {
  setSelectedIndex: SelectableActions.setSelectedIndex,
  createMobilizationFromTemplate: MobilizationActions.asyncUpdate,
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(TemplateChooseCustomPage)
