import React from 'react';
import { Box, Flex } from 'rebass';
import { Head5 } from './Text';

const Footer = () => (
  <Box backgroundColor="greyscale-black">
    <Flex flexDirection="columns" justifyContent="center" p={4}>
      <Head5 color="white" fontWeight={3}>
        Copyright © 2019 Nick Ma.
      </Head5>
    </Flex>
  </Box>
);

export default Footer;
