import React from 'react'
import { Head5, Button, Nav } from 'toxin-ui'
import { Box, Flex } from 'rebass'

const RightSection = props => (
  <Flex
    alignItems="flex-start"
    justifyContent="space-evenly"
    width={[6, 2]}
    position="relative"
    {...props}
  >
    <Head5>My Work</Head5>
    <Head5>About Me</Head5>
    <Head5>Blog</Head5>
  </Flex>
)

const LeftSection = props => (
  <Flex
    alignItems="center"
    justifyContent="space-evenly"
    position="relative"
    width={[5, 2]}
    {...props}
  >
    <Head5>Twitter</Head5>
    <Head5>Linkedin</Head5>
    <Button>Follow Me</Button>
  </Flex>
)

const Header = props => (
  <Nav {...props} bg="white" boxShadow="0px 0px 10px 0px rgba(8,8,8,0.25)">
    <Flex alignItems="center" justifyContent="center" position="relative">
      <RightSection />
      <LeftSection />
    </Flex>
  </Nav>
)

export default Header
