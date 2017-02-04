import React from 'react';
import TestUtil from 'react-addons-test-utils';
import Hello from 'src/page/index/components/Hello';

describe('Hello', () => {
  it('renders a div', () => {
    const shallowRenderer = TestUtil.createRenderer();
    shallowRenderer.render(<Hello />);
    const component = shallowRenderer.getRenderOutput();
    expect(component.type).to.equal('div');
  });
});
