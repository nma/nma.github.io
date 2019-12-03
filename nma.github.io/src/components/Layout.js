import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { Head1, Head3, Card, themes } from 'toxin-ui'
import { Flex, Box } from 'rebass'
import { ThemeProvider } from 'styled-components'
import Header from './Header'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <Head1>
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </Head1>
      )
    } else {
      header = (
        <Head3>
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </Head3>
      )
    }

    return (
      <main>
        <ThemeProvider theme={themes.toxin}>
          <Header mb={1} />

          <Box backgroundColor="greyscale-light">
            <Card>
              <Flex justifyContent="center" p={[1, 2, 4]} minHeight={[1]}>
                {header}
              </Flex>
            </Card>
            <Card bg="white" boxShadow="0px 0px 10px 0px rgba(8,8,8,0.25)">
              {children}
              <Flex justifyContent="center" p={[1, 2, 4]}>
                <footer>
                  © 2018, Built with{' '}
                  <a href="https://www.gatsbyjs.org">Gatsby</a>
                </footer>
              </Flex>
            </Card>
          </Box>
        </ThemeProvider>
      </main>
    )
  }
}

Layout.propTypes = {
  location: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Layout
