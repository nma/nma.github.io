import React from 'react'
import styled from 'styled-components'
import { Heading, Flex, Box } from 'rebass'
import { Head3, Text } from './Text'
import PropTypes from 'prop-types'
import Fade from 'react-reveal/Fade'
import { StaticQuery, graphql } from 'gatsby'
import { CardContainer, Card } from './Card'

const MEDIUM_CDN = 'https://cdn-images-1.medium.com/max/400'
const MEDIUM_URL = 'https://medium.com'

const CoverImage = styled.img`
  width: 100%;
  object-fit: cover;
  margin-bottom: 0;
`

const EllipsisHeading = styled(Head3).attrs({
  textTransform: 'lowercase',
  fontSize: 2,
})`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-inline-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const Post = ({ title, text, image, url, date, time }) => (
  <Card
    onClick={() => window.open(url, '_blank')}
    border={2}
    borderColor="greyscale-light"
  >
    {image && <CoverImage src={image} height="200px" alt={title} />}
    <Box p={4}>
      <EllipsisHeading>{title}</EllipsisHeading>
      <Text color="greyscale-black" fontSize={1} mt={2}>
        {text}
      </Text>
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

const parsePost = author => postFromGraphql => {
  const { id, uniqueSlug, createdAt, title, virtuals } = postFromGraphql
  const image =
    virtuals.previewImage.imageId &&
    `${MEDIUM_CDN}/${virtuals.previewImage.imageId}`

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

const Writing = () => (
  <StaticQuery
    query={graphql`
      query MediumPostQuery {
        site {
          siteMetadata {
            isMediumUserDefined
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
    render={({ allMediumPost, site, author }) => {
      const posts = edgeToArray(allMediumPost).map(parsePost(author))

      const { isMediumUserDefined } = site.siteMetadata

      return (
        isMediumUserDefined && (
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            <Box width={['36em', '48em', '64em']}>
              <CardContainer minWidth="275px">
                {posts.map(({ Component, ...rest }) => (
                  <Fade bottom key={rest.id}>
                    <Component {...rest} key={rest.id} />
                  </Fade>
                ))}
              </CardContainer>
            </Box>
          </Flex>
        )
      )
    }}
  />
)

export default Writing
