import React from 'react';
import rehypeReact from 'rehype-react';
import styled from 'styled-components';
import { Head2, Head3, Head4, Head5, Head6, Text } from './Text';
import { Box } from 'rebass';

const DivOverlay = styled(Box).attrs({
  fontFamily: 'sansSerif',
  fontSize: 2,
})``;

const ul = styled.ul`
  margin: 0;
`;

const li = styled(Box).attrs({
  as: 'li',
  ml: 4,
  mt: 2,
})``;

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    h1: Head2,
    h2: Head3,
    h3: Head4,
    h4: Head5,
    h5: Head6,
    p: Text,
    div: DivOverlay,
    ul,
    li,
  },
}).Compiler;

export default renderAst;
