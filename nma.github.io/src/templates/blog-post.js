import React from 'react';
import { Link, graphql } from 'gatsby';
import { Box, Flex } from 'rebass';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import Header from '../components/Header';
import CenterImage from '../components/CenterImage';
import { Text, Head1 } from '../components/Text';
import { Container } from '../components/primitives';
import SEO from '../components/seo';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const { previous, next } = this.props.pageContext;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <Header />
        <CenterImage />
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <Container>
            <Head1>{post.frontmatter.title}</Head1>
            <Text>{post.frontmatter.date}</Text>

            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <hr
              style={{
                marginBottom: '12px',
              }}
            />
            <Bio />
            <BlogFooter next={next} previous={previous} />
          </Container>
        </Flex>
      </Layout>
    );
  }
}

const BlogFooter = ({ previous, next }) => (
  <ul
    style={{
      display: `flex`,
      flexWrap: `wrap`,
      justifyContent: `space-between`,
      listStyle: `none`,
      padding: 0,
    }}
  >
    <li>
      {previous && (
        <Link to={previous.fields.slug} rel="prev">
          ← {previous.frontmatter.title}
        </Link>
      )}
    </li>
    <li>
      {next && (
        <Link to={next.fields.slug} rel="next">
          {next.frontmatter.title} →
        </Link>
      )}
    </li>
  </ul>
);

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
