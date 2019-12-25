import React, { useContext } from 'react'
import { Box, Flex } from 'rebass'
import Headroom from 'react-headroom'
import { ThemeContext } from 'styled-components'
import styled from 'styled-components'
import RouteLink from './RouteLink'
import { ShadowFlex } from './primitives'

const HeaderContainer = styled(Headroom)`
  background: ${props => props.theme.colors['white']};
  position: absolute;
  width: 100%;
`

const Header = () => {
  const themeContext = useContext(ThemeContext)

  return (
    <HeaderContainer>
      <ShadowFlex
        bg="white"
        boxShadow="0px 0px 10px 0px rgba(8,8,8,0.25)"
        justifyContent="center"
      >
        <Flex
          width={['36em', '48em', '64em']}
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <Flex>
            <RouteLink name="Home" />
          </Flex>
          <Flex>
            <RouteLink name="Blog" />
            <RouteLink name="About" />
            <RouteLink name="Projects" />
          </Flex>
        </Flex>
      </ShadowFlex>
    </HeaderContainer>
  )
}

export default Header
