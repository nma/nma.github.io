import React, { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'
import { Flex, Box, Card } from 'rebass'
import theme from '../utils/theme'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <main>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
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
