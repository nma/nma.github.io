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
          width={['36em', '48em', '54em']}
          justifyContent="space-between"
          py={4}
        >
          <Flex>
            <RouteLink name="Nick Ma" />
          </Flex>
          <Flex>
            <RouteLink name="About" />
            <RouteLink ml={[0, 2, 4]} name="Blog" />
            {/* <RouteLink name="Projects" /> */}
          </Flex>
        </Flex>
      </ShadowFlex>
    </HeaderContainer>
  )
}

export default Header
