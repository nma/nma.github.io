import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { Flex, Box } from 'rebass'
import { Head1, Head2, Head3, Text } from './Text'
import PropTypes from 'prop-types'
import Fade from 'react-reveal/Fade'
import { StaticQuery, graphql } from 'gatsby'
import { CardContainer, Card } from './Card'
import { themeGet } from '@styled-system/theme-get'
import { PositionBox } from './primitives'

export const getColor = colorKey => themeGet(`colors.${colorKey}`)

const MEDIUM_CDN = 'https://cdn-images-1.medium.com/max/400'
const MEDIUM_URL = 'https://medium.com'

const CoverImage = styled.img`
  width: 100%;
  object-fit: cover;
  margin-bottom: 0;
`

const EllipsisHeading = styled(Head3).attrs({
  textTransform: 'lowercase',
  fontSize: 3,
})`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-inline-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const PostBodyTagBox = styled(Box)`
  display: inline-block;

  border-radius: 4px;
  border-top-right-radius: 22px;
  border-bottom-right-radius: 22px;

  background: linear-gradient(
    180deg,
    ${getColor('brand-primary')} 0,
    ${getColor('brand-primary-offset')} 100%
  );
`

const PostTag = ({ tagBody }) => (
  <PostBodyTagBox>
    <Head3 fontSize={2} p={3} color="white">
      {tagBody}
    </Head3>
  </PostBodyTagBox>
)

PostTag.propTypes = {
  tagBody: PropTypes.string.isRequired,
}

const Post = ({ title, text, image, url, date, time }) => (
  <Card
    onClick={() => window.open(url, '_blank')}
    border={2}
    borderColor="greyscale-light"
  >
    <Box>
      <PositionBox position="fixed" top={5} left={-2}>
        <PostTag tagBody={'Medium'} />
      </PositionBox>
      {image && <CoverImage src={image} height="200px" alt={title} />}
      <Box p={4}>
        <EllipsisHeading>{title}</EllipsisHeading>
        <Text color="greyscale-black" fontSize={1} mt={2} lineHeight={2}>
          {text}
        </Text>
      </Box>
    </Box>
  </Card>
)

Post.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
}

const parsePost = (author, defaultImage) => postFromGraphql => {
  const { id, uniqueSlug, createdAt, title, virtuals } = postFromGraphql
  const image = virtuals.previewImage.imageId
    ? `${MEDIUM_CDN}/${virtuals.previewImage.imageId}`
    : defaultImage.childImageSharp.fixed.src

  return {
    id,
    title,
    time: virtuals.readingTime,
    date: createdAt,
    text: virtuals.subtitle,
    image,
    url: `${MEDIUM_URL}/${author.username}/${uniqueSlug}`,
    Component: Post,
  }
}

const edgeToArray = data => data.edges.map(edge => edge.node)

const FeaturedWriting = () => (
  <StaticQuery
    query={graphql`
      query MediumPostQuery {
        site {
          siteMetadata {
            isMediumUserDefined
          }
        }
        featuredPostImage: file(absolutePath: { regex: "/business-cat.png/" }) {
          childImageSharp {
            fixed(width: 275) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        allMediumPost(limit: 7, sort: { fields: createdAt, order: DESC }) {
          totalCount
          edges {
            node {
              id
              uniqueSlug
              title
              createdAt(formatString: "MMM YYYY")
              virtuals {
                subtitle
                readingTime
                previewImage {
                  imageId
                }
              }
            }
          }
        }
        author: mediumUser {
          username
          name
        }
      }
    `}
    render={({ allMediumPost, site, author, featuredPostImage }) => {
      const posts = edgeToArray(allMediumPost).map(
        parsePost(author, featuredPostImage)
      )

      const { isMediumUserDefined } = site.siteMetadata

      return (
        isMediumUserDefined && (
          <Box mb={[2, 5]}>
            <CardContainer minWidth="275px">
              {posts.map(({ Component, ...rest }) => (
                <Fade left key={rest.id}>
                  <Component {...rest} key={rest.id} />
                </Fade>
              ))}
            </CardContainer>
          </Box>
        )
      )
    }}
  />
)

const PostList = ({ posts }) => (
  <Flex alignItems="center" mx="auto" flexDirection="column">
    {posts.map(({ node }) => {
      const title = node.frontmatter.title || node.fields.slug
      return (
        <Box key={node.fields.slug}>
          <Head3>
            <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
              {title}
            </Link>
          </Head3>
          <small>{node.frontmatter.date}</small>
          <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </Box>
      )
    })}
  </Flex>
)

const Writing = ({ posts }) => (
  <Flex flexDirection="row" justifyContent="center" alignItems="center">
    <Box width={['36em', '48em', '54em']}>
      <Head1 my={[1, 3, 4]}>Blog</Head1>
      <FeaturedWriting />
      <Head2 my={[1, 3, 4]}>Tips and Tricks</Head2>
      <PostList posts={posts} />
    </Box>
  </Flex>
)

export default Writing
