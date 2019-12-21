import React from 'react'
import PropTypes from 'prop-types'
// import LinkAnimated from './LinkAnimated'
import styled from 'styled-components'
import { Head2 } from './Text'

const LinkAnimated = styled.span`
  text-decoration: none;
  position: relative;
  margin-bottom: 0;
  padding-bottom: 5px;
  color: inherit;
  ${props =>
    props.selected &&
    `border-bottom:  5px solid ${props.theme.colors['brand-primary-offset']}`};
  transition: 0.4s;
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:after {
    content: '';
    position: absolute;
    right: 0;
    width: 0;
    bottom: -5px;
    background: ${props => props.theme.colors['brand-primary']};
    height: 5px;
    transition-property: width;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
  }
  &:hover:after {
    left: 0;
    right: auto;
    width: 100%;
  }
`

const RouteLink = ({ onClick, selected, name }) => (
  <Head2 ml={[2, 3]} color="black">
    <LinkAnimated onClick={onClick} selected={selected}>
      {name}
    </LinkAnimated>
  </Head2>
)

RouteLink.propTypes = {
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  name: PropTypes.string,
}

export default RouteLink
