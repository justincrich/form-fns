import React from 'react'
import { createGlobalStyle } from 'styled-components'

import { reset } from '../../src/styles/reset'
import { ThemeProvider } from '../../src/styles/ThemeProvider'
import { theme } from '../../src/styles/theme'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

export const themeDecorator = (storyFn) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
      {storyFn()}
    </ThemeProvider>
  )
}