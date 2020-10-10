import React from 'react'
import { AppTheme } from './theme'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const ThemeContext = React.createContext<AppTheme>(null!)

export function useTheme(): AppTheme {
    return React.useContext(ThemeContext)
}
