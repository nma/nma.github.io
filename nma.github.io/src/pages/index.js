// @flow
import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import Header from '../components/Header'
import CenterImage from '../components/CenterImage'
import Writing from '../components/Writing'
// import About from '../components/About'
import { Box, Flex, Heading } from 'rebass'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <Header />
        <CenterImage />
        {/* <About /> */}
        <Flex alignItems="center" width={'100%'} flexDirection="column">
          <Bio mt={[10, 5]} />
        </Flex>
        <Writing />
        {/* <Flex
          alignItems="center"
          width={['36em', '48em', '64em']}
          mx="auto"
          flexDirection="column"
        >
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <Box key={node.fields.slug}>
                <Heading>
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </Heading>
                <small>{node.frontmatter.date}</small>
                <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              </Box>
            )
          })}
        </Flex> */}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
