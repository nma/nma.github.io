import React from 'react'
import { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'
import theme from '../utils/theme'

class Layout extends React.Component {
  render() {
    const { children } = this.props

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
