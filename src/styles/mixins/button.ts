import { css } from 'styled-components'
import { ThemedProps } from '../theme'

export const ACTION_OPACITY = 0.5

export const button = (disabled = false) => (props: ThemedProps) => {
    return css`
        cursor: pointer;
        user-select: none;
        ${disabled &&
        `
          opacity: 0.5;
          cursor: default;
        `}
        &:active {
            opacity: 0.5;
        }
    `
}
