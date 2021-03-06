import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import { ColorPicker } from '../../Forms'


describe('app/scripts/Dashboard/Forms/ColorPicker', () => {
  let wrapper
  const props = {
    dispatch: () => {}
  }

  beforeEach(() => {
    wrapper = shallow(<ColorPicker {...props} />, { context: {} })
  })

  it('should render ok by default', () => {
    expect(wrapper).to.be.ok
  })

  it('should set value passed by context', () => {
    wrapper.setContext({
      $formGroup: {
        value: '#fff'
      }
    })
    expect(wrapper.children().props().color).to.equal('#fff')
  })
})
