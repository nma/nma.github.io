import React from 'react'
import { Link } from 'gatsby'
import { Head1, Head3, Card, themes } from 'toxin-ui'
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
        <Card bg="#f4f4f6">
          <Header mb={1} />
          {header}
          {children}
          <footer>
            © 2018, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </Card>
      </ThemeProvider>
    )
  }
}

export default Layout
