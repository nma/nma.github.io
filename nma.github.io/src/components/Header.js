import React, { useContext } from 'react'
import { Box, Flex } from 'rebass'
import Headroom from 'react-headroom'
import { ThemeContext } from 'styled-components'
import styled from 'styled-components'
import RouteLink from './RouteLink'
import Nav from './Nav'

const HeaderContainer = styled(Headroom)`
  background: ${props => props.theme.colors['white']};
  position: absolute;
  width: 100%;
`

const Header = () => {
  const themeContext = useContext(ThemeContext)

  return (
    <HeaderContainer>
      <Nav bg="white" boxShadow="0px 0px 10px 0px rgba(8,8,8,0.25)">
        <Flex
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <Flex alignItems="flex-start">
            <RouteLink name="Blog" />
            <RouteLink name="About" />
            <RouteLink name="Projects" />
          </Flex>
        </Flex>
      </Nav>
    </HeaderContainer>
  )
}

export default Header
