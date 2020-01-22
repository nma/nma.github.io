// @flow
import styled from 'styled-components';
import { Text as RebassText } from 'rebass';

export const Text = styled(RebassText)``;

Text.defaultProps = {
  as: 'p',
  fontFamily: 'sansSerif',
  py: 2,
};

Text.displayName = 'Text';

export const Head1 = styled(RebassText)``;
Head1.defaultProps = {
  as: 'h1',
  fontSize: 6,
  fontWeight: 0,
  fontFamily: 'sansSerifSecondary',
  py: 4,
};

export const Head2 = styled(RebassText)``;
Head2.defaultProps = {
  as: 'h2',
  fontSize: 5,
  fontWeight: 0,
  fontFamily: 'sansSerifSecondary',
  py: 3,
};

export const Head3 = styled(RebassText)``;
Head3.defaultProps = {
  as: 'h3',
  fontSize: 4,
  fontWeight: 'bold',
  fontFamily: 'sansSerifSecondary',
  py: 3,
};

export const Head4 = styled(RebassText)``;
Head4.defaultProps = {
  as: 'h4',
  fontSize: 3,
  fontWeight: 'bold',
  fontFamily: 'sansSerifSecondary',
  py: 2,
};

export const Head5 = styled(RebassText)``;
Head5.defaultProps = {
  as: 'h5',
  fontSize: 2,
  fontWeight: 1,
  fontFamily: 'sansSerif',
  py: 2,
};

export const Head6 = styled(RebassText)`
  text-transform: uppercase;
`;
Head6.defaultProps = {
  as: 'h6',
  fontSize: 1,
  fontWeight: 'bold',
  fontFamily: 'sansSerif',
  py: 2,
};
