import React from 'react';
import PropTypes from 'prop-types';
import LinkAnimated from './LinkAnimated';
import { Head2 } from './Text';

const RouteLink = ({ onClick, selected, name, ...rest }) => (
  <Head2 py={0} fontSize={[3, 4]} color="black" {...rest}>
    <LinkAnimated onClick={onClick} selected={selected}>
      {name}
    </LinkAnimated>
  </Head2>
);

RouteLink.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  name: PropTypes.string,
};

export default RouteLink;
