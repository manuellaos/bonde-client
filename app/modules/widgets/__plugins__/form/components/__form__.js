import React, { PropTypes } from 'react'
import { Navigation } from 'react-router'
import { bindActionCreators } from 'redux'
import reactMixin from 'react-mixin'
import $ from 'jquery'
import classnames from 'classnames'

// Global module dependencies
import * as Paths from '../../../../../scripts/Paths'
import { Error } from '../../../../../components/FormUtil'
import { isValidEmail } from '../../../../../util/validation-helper'

// Parent module dependencies
import { WidgetOverlay, FinishMessageCustom } from '../../../../../modules/widgets/components'

// Current module dependencies
import { Button, Input, FormTellAFriend } from '../components'
import * as FormActions from '../action-creators'

@reactMixin.decorate(Navigation)
class Form extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      hasMouseOver: false,
      loading: false,
      success: false,
      errors: []
    }
  }

  componentWillReceiveProps() {
    if (this.state.loading) {
      this.setState({loading: false, success: true})
    }
  }

  fields() {
    const { settings } = this.props.widget
    return (settings && settings.fields ? settings.fields : [])
  }

  handleOverlayOnClick() {
    const { mobilization, widget, editable } = this.props
    if (editable) {
      this.transitionTo(Paths.fieldsMobilizationWidget(mobilization.id, widget.id))
    }
  }

  submit() {
    if (!this.props.editable) {
      const { dispatch, mobilization, widget } = this.props
      const bindedFormEntryActions = bindActionCreators(FormActions, dispatch)

      const fieldsWithValue = widget.settings.fields.map(field => ({
        ...field,
        value: $(`#input-${field.uid}`).val()
      }))
      const errors = this.validate(fieldsWithValue)
      this.setState({ errors })

      if (errors.length === 0) {
        this.setState({ loading: true })
        const formEntry = {
          widget_id: widget.id,
          fields: JSON.stringify(fieldsWithValue)
        }
        bindedFormEntryActions.asyncFormEntryCreate({ mobilization, formEntry })
      }
    }
  }

  validate(fieldsWithValue) {
    const errors = []
    fieldsWithValue.forEach((field) => {
      if (field.required === 'true' && field.value === '') {
        errors.push(`${field.label} não pode ficar em branco`)
      } else if (field.value !== '' && field.kind === 'email' && !isValidEmail(field.value)) {
        errors.push(`${field.label} inválido`)
      }
    })
    return errors
  }

  renderCallToAction() {
    const { configurable, widget, mobilization: { header_font: headerFont } } = this.props
    const callToAction = (
      widget.settings && widget.settings.call_to_action
        ? widget.settings.call_to_action
        : 'Clique para configurar seu formulário...'
    ).replace('\n', '<br/><br/>')

    return configurable ? null : (
      <h2
        className="mt0 mb3 center white"
        dangerouslySetInnerHTML={{__html: callToAction}}
        style={{ fontFamily: headerFont }}
      />
    )
  }

  renderFields() {
    const fields = this.fields()
    return fields.map((field, index) => {
      return (
        <Input
          {...this.props}
          key={field.uid}
          uid={field.uid}
          canMoveUp={index !== 0}
          canMoveDown={index !== fields.length - 1}
          initializeEditing={this.props.hasNewField && index === fields.length - 1}
          field={field} />
      )
    })
  }

  renderButton() {
    const { configurable, widget } = this.props
    const { loading, success } = this.state

    if (!configurable) {
      return (
        <Button
          {...this.props}
          buttonText={(
            widget.settings ?
            (widget.settings.button_text || 'Enviar') :
            'Enviar'
          )}
          handleClick={::this.submit}
          loading={loading}
          success={success}
        />
      )
    }
  }

  renderCount() {
    const { configurable, widget, mobilization: { body_font: bodyFont }} = this.props
    if (!configurable) {
      return (
        <div className="mt2 h3 center white" style={{ fontFamily: bodyFont }}>
          {widget.form_entries_count}
          &nbsp;
          {widget.settings && widget.settings.count_text ? widget.settings.count_text : 'assinaturas'}
        </div>
      )
    }
  }

  renderOverlay() {
    const { editable, configurable } = this.props
    if (editable && !configurable && this.state.hasMouseOver) {
      return (
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-darken-4 h1 bold rounded z1">
          <div className="table full-height col-12 center">
            <div className="white table-cell align-middle">
              Clique para editar
            </div>
          </div>
        </div>
      )
    }
  }

  renderErrors() {
    const { errors } = this.state

    return (
      errors.length > 0
      && <div>{errors.map(error => <Error message={error} />)}</div>
    )
  }

  renderShareButtons() {
    const fields = this.fields()
    let message = ''
    fields.map((field) => {
      if (field.kind === 'greetings') {
        message = field.placeholder
      }
    })
    if (message === '') {
      const { mobilization, widget } = this.props
      const { settings: { finish_message_type: finishMessageType } } = widget
      return finishMessageType === 'custom' ? (
        <FinishMessageCustom widget={widget} />
      ) : (
        <FormTellAFriend mobilization={mobilization} />
      )
    } else {
      return <p className="center p2 bg-darken-3">{message}</p>
    }
  }

  renderForm() {
    const { editable, configurable } = this.props

    return (
      <div>
        <div
          className={classnames(
            'rounded',
            { 'p3 bg-darken-3 relative': editable || !configurable }
          )}
        >
          {this.renderCallToAction()}
          {this.renderFields()}
          {this.renderErrors()}
          {this.renderButton()}
          {this.renderOverlay()}
        </div>
      </div>
    )
  }

  render() {
    const {
      editable,
      mobilization: { header_font: headerFont }
    } = this.props

    const { success } = this.state

    return (
      <WidgetOverlay
        editable={editable}
        onClick={::this.handleOverlayOnClick}
        text="Clique para configurar o formulário de inscrição"
      >
        <div className={`widget ${headerFont}-header`}>
          {success ? this.renderShareButtons() : this.renderForm()}
          {this.renderCount()}
        </div>
      </WidgetOverlay>
    )
  }
}

Form.propTypes = {
  mobilization: PropTypes.object.isRequired,
  widget: PropTypes.shape({
    settings: PropTypes.shape({
      finish_message_type: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  editable: PropTypes.bool,
  configurable: PropTypes.bool,
  hasNewField: PropTypes.bool
}

export default Form
