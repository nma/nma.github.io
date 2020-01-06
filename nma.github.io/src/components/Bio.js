import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Flex, Box } from 'rebass';
import { Text } from './Text';
import { Container } from './primitives';

import { rhythm } from '../utils/typography';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata;
        return (
          <Container>
            <Flex alignItems="center">
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 50,
                  borderRadius: `100%`,
                }}
              />
              <Flex flexDirection="column" alignItems="space-between">
                <Box>
                  <Text>
                    Written by <strong>{author}</strong>🤓, he like learning
                    boring complicated stuff and making it sound easy. 💻 🤔
                    {` `}
                    <a href={`https://twitter.com/${social.twitter}`}>
                      You should follow him on Twitter
                    </a>
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Container>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`;

export default Bio;
