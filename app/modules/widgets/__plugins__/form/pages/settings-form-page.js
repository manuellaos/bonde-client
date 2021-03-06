import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import classnames from 'classnames'

// Global module dependencies
import * as Paths from '../../../../../scripts/Paths'
import { SettingsPageContentLayout } from '../../../../../components/Layout'
import {
  FormRedux,
  FormGroup,
  ControlLabel,
  FormControl
} from '../../../../../scripts/Dashboard/Forms'

// Parent module dependencies
import { actions as WidgetActions } from '../../../../../modules/widgets'

// Current module dependencies
import { SettingsMenu } from '../components'

class SettingsFormPage extends React.Component {
  handleSubmit(values) {
    const { widget, asyncWidgetUpdate } = this.props
    const settings = widget.settings || {}

    return asyncWidgetUpdate({
      ...widget,
      settings: { ...settings, ...values },
    })
  }

  render() {
    const { fields: { call_to_action, button_text, count_text }, ...props } = this.props
    return (
      <div className="flex-auto flex flex-column bg-silver atomic relative">
        <SettingsMenu mobilization={props.mobilization} widget={props.widget} location={props.location} />
        <SettingsPageContentLayout>
          <FormRedux
            {...props}
            onSubmit={::this.handleSubmit}
            className="transparent"
            floatButton="Salvar"
            successMessage="Formulário configurado com sucesso!"
          >
            <FormGroup controlId="call-to-action-id" {...call_to_action}>
              <ControlLabel>Título do formulário</ControlLabel>
              <FormControl
                type="text"
                placeholder="Ex: Preencha o formulário abaixo para assinar a petição."
              />
            </FormGroup>
            <FormGroup controlId="button-text-id" {...button_text}>
              <ControlLabel>Botão</ControlLabel>
              <FormControl
                type="text"
                placeholder="Defina o texto do botão de confirmação do formulário."
              />
            </FormGroup>
            <FormGroup controlId="count-text-id" {...count_text}>
              <ControlLabel>Contador</ControlLabel>
              <FormControl
                type="text"
                placeholder="Defina o texto que ficará ao lado do número de pessoas que agiram."
              />
            </FormGroup>
          </FormRedux>
        </SettingsPageContentLayout>
      </div>
    )
  }
}

SettingsFormPage.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  mobilization: PropTypes.object.isRequired,
  widget: PropTypes.object.isRequired,
  // Actions
  asyncWidgetUpdate: PropTypes.func.isRequired,
}

const fields = ['call_to_action', 'button_text', 'count_text']

const mapStateToProps = (state, props) => ({
  initialValues: props.widget.settings || {},
})

export default reduxForm(
  { form: 'widgetForm', fields },
  mapStateToProps,
  WidgetActions
)(SettingsFormPage)
