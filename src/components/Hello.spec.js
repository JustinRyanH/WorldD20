import React from 'react';
import { shallow } from 'enzyme'

import Hello from './Hello';

describe('Components Hello', () => {
  it('Is a test', () => {
    const HelloRender = shallow(<Hello compiler="ts-jest" />);
    expect(HelloRender).toHaveText('Hello from ts-jest');
  });
});