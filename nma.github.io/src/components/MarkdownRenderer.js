import React from 'react';
import rehypeReact from 'rehype-react';
import { Head1, Head2, Head3, Head4, Head5, Head6, Text } from './Text';

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    h1: Head2,
    h2: Head3,
    h3: Head4,
    h4: Head5,
    h5: Head6,
    p: Text,
  },
}).Compiler;

export default renderAst;
