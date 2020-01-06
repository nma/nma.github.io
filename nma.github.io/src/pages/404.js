import React from 'react'
import { Box } from 'rebass'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import Header from '../components/Header'
import CenterImage from '../components/CenterImage'

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title="404: Not Found" />
        <Header />
        <CenterImage />
        <Box width={['36em', '48em', '54em']}>
          <h1>Not Found</h1>
          <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </Box>
      </Layout>
    )
  }
}

export default NotFoundPage
