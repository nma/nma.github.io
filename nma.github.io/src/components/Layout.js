import React from 'react'
import { Link } from 'gatsby'
import { Head1, Head3, Card, themes, Flex, Box } from 'toxin-ui'
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
      <ThemeProvider theme={themes.toxin}>
        <Box bg="#f4f4f6">
          <Card>
            <Header mb={1} />
            <Flex justifyContent="center" p={[1, 2, 4]}>
              {header}
            </Flex>
          </Card>
          <Card>{children}</Card>
          <Card
            bg="white"
            height={140}
            boxShadow="0px 0px 10px 0px rgba(8,8,8,0.25)"
          >
            <Flex justifyContent="center" p={[1, 2, 4]}>
              <footer>
                © 2018, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
              </footer>
            </Flex>
          </Card>
        </Box>
      </ThemeProvider>
    )
  }
}

export default Layout
