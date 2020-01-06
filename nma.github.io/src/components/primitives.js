import { shadow, background, position } from 'styled-system';
import { Flex, Box } from 'rebass';
import styled from 'styled-components';

export const ShadowFlex = styled(Flex)(shadow);
export const ShadowBox = styled(Box)(shadow);
export const BackgroundBox = styled(Box)(background);
export const PositionBox = styled(Box)(position);

export const Container = styled(Box).attrs({
  p: 4,
  width: ['100%', '48em', '54em'],
})``;
