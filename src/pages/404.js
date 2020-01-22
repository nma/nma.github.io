import React from 'react'
import { Box, Flex } from 'rebass'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Header from '../components/Header'
import CenterImage from '../components/CenterImage'
import { Container } from '../components/primitives'
import { Head1, Text } from '../components/Text'

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title="404: Not Found" />
        <Header />
        <CenterImage />
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <Container>
            <Box>
              <Head1>Not Found</Head1>
              <Text>You just hit a route that doesn&#39;t exist... the sadness.</Text>
            </Box>
          </Container>
        </Flex>
      </Layout>
    )
  }
}

export default NotFoundPage
