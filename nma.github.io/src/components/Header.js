import React, { useContext } from 'react'
import { Box, Flex } from 'rebass'
import Headroom from 'react-headroom'
import { ThemeContext } from 'styled-components'
import styled from 'styled-components'
import RouteLink from './RouteLink'

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

const HeaderContainer = styled(Headroom)`
  background: ${props => props.theme.colors['white']};
  position: absolute;
  width: 100%;
`

const Header = () => {
  const themeContext = useContext(ThemeContext)

  return (
    <HeaderContainer>
      <Flex
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        p={3}
      >
        <Flex>
          <RouteLink name="Blog" />
          <RouteLink name="About" />
          <RouteLink name="Projects" />
        </Flex>
      </Flex>
    </HeaderContainer>
  )
}

export default Header
