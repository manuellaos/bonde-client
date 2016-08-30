import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'

import { isValidCodeGA } from '../../../util/validation-helper'
import * as MobilizationActions from '../MobilizationActions'
import * as Selectors from '../MobilizationSelectors'
import {
  FormRedux,
  FormGroup,
  ControlLabel,
  FormControl
} from '../../Dashboard/Forms'

const MobilizationAnalyticsPage = ({
  ...rest,
  fields: { google_analytics_code: googleAnalyticsCode },
  mobilization,
  credentials,
  // Actions
  edit
}) => {
  const handleSubmit = (values, dispatch) =>
    dispatch(edit(credentials, { ...mobilization, ...values }))

  return (
    <div className="py3 px3 col col-8">
      <p className="h5">
        Para acompanhar os resultados da sua mobilização, você precisa configurar
        uma conta no Google Analytics. Siga os passos abaixo:
      </p>
      <ol className="h5">
        <li>
          Crie uma conta no Google Analytics
          <a href="http://www.google.com/analytics/" target="_blank"> clicando aqui</a>
        </li>
        <li>
          Obtenha sua ID de acompanhamento no Google Analytics. É um código
          que começa sempre com as letras UA, que você verá após criar sua conta lá.
        </li>
        <li>
          Copie a ID de acompanhamento e cole no campo abaixo:
          <FormRedux inline={true} onSubmit={handleSubmit} className='mt2 mb4' {...rest}>
            <FormGroup controlId="googleAnalyticsCode" {...googleAnalyticsCode}>
              <ControlLabel>ID do Google Analytics</ControlLabel>
              <FormControl type='text' placeholder="UA-00000000-0" />
            </FormGroup>
          </FormRedux>
        </li>
        <li>
          Pronto! Você já pode acompanhar as estatísticas da sua mobilização
          no Google Analytics!
        </li>
      </ol>
    </div>
  )
}

MobilizationAnalyticsPage.propTypes = {
  fields: PropTypes.shape({
    google_analytics_code: PropTypes.object.isRequired
  }).isRequired,
  mobilization: PropTypes.object.isRequired,
  credentials: PropTypes.object.isRequired,
  // Actions
  edit: PropTypes.func.isRequired
}

const fields = ['google_analytics_code']
const validate = values => {
  const errors = {}
  if (values.google_analytics_code && !isValidCodeGA(values.google_analytics_code)) {
    errors.google_analytics_code = 'Informe uma ID válida'
  }
  return errors
}
const mapStateToProps = (state, ownProps) => {
  const mobilization = Selectors.getMobilization(state, ownProps)
  return {
    initialValues: mobilization || {},
    mobilization,
    credentials: state.auth.credentials
  }
}

export default reduxForm({
  form: 'mobilizationForm',
  fields,
  validate,
}, mapStateToProps, MobilizationActions)(MobilizationAnalyticsPage)
