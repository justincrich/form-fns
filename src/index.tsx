import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import * as serviceWorker from './serviceWorker'
import { store } from './services'
import { ThemeProvider } from './styles/ThemeProvider'
import { theme } from './styles/theme'
import { reset } from './styles/reset'
import { Router } from './router'
import { ErrorGuard } from './components/ErrorGuard'

const GlobalStyle = createGlobalStyle`
  #root{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  ${reset}
`

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <>
                <GlobalStyle />
                <ErrorGuard>
                    <Provider store={store}>
                        <Router />
                    </Provider>
                </ErrorGuard>
            </>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
