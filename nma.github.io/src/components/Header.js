import React, { useContext } from 'react';
import { Flex } from 'rebass';
import Headroom from 'react-headroom';
import { ThemeContext } from 'styled-components';
import styled from 'styled-components';
import { Box } from 'rebass';

import RouteLink from './RouteLink';
import { ShadowFlex } from './primitives';

const HeaderContainer = styled(Headroom)`
  background: ${props => props.theme.colors['white']};
  position: absolute;
  width: 100%;
`;

export const HeadSizeContainer = styled(Box).attrs({
  p: 4,
  width: ['100%', '100%', '960px'],
})``;

const Header = () => {
  const themeContext = useContext(ThemeContext);

  return (
    <HeaderContainer>
      <ShadowFlex
        bg="white"
        boxShadow="0px 0px 10px 0px rgba(8,8,8,0.25)"
        justifyContent="center"
      >
        <HeadSizeContainer>
          <Flex justifyContent="space-between">
            <Flex>
              <RouteLink name="Nick Ma" />
            </Flex>
            <Flex>
              {/* <RouteLink name="About" /> */}
              <RouteLink ml={[1, 2, 4]} name="Blog" />
              {/* <RouteLink name="Projects" /> */}
            </Flex>
          </Flex>
        </HeadSizeContainer>
      </ShadowFlex>
    </HeaderContainer>
  );
};

export default Header;
