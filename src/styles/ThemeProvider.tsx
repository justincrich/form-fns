import React from 'react'
import { ThemeProvider as DefaultThemeProvider } from 'styled-components'
import { AppTheme } from './theme'
import { ThemeContext } from './ThemeContext'

export interface ThemeProviderProps {
    children: JSX.Element
    theme: AppTheme
}

export function ThemeProvider({
    children,
    theme,
}: ThemeProviderProps): JSX.Element {
    return (
        <DefaultThemeProvider theme={theme}>
            <ThemeContext.Provider value={theme}>
                {children}
            </ThemeContext.Provider>
        </DefaultThemeProvider>
    )
}
