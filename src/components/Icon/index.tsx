import React from 'react'
import styled from 'styled-components'
import * as Icons from 'react-icons/fa'
import { sizing } from '../../styles/mixins/constants'
import { color as colorSelect } from '../../styles/color'
import { ThemeSelector } from '../../styles/index'

type ColorType = 'primary' | 'inverted' | 'muted' | 'activity'
type IconName = keyof typeof Icons

export interface IconsProps {
    className?: string
    iconName: IconName
    color?: ColorType | ThemeSelector
    title?: string
    size?: string
    onClick?: () => void
}

export const Icon = React.forwardRef(
    (props: IconsProps, ref: React.Ref<HTMLDivElement>): JSX.Element => {
        const { className, iconName, color, size, onClick, title } = props
        const Component = Icons[iconName]
        if (!Component) {
            throw new Error('Invalid Icon')
        }
        const coloring = color || 'primary'
        return (
            <Container
                ref={ref}
                title={title}
                size={size || sizing[2]}
                coloring={coloring}
                className={className}
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                }}
            >
                <Component />
            </Container>
        )
    }
)

const Container = styled.div<{
    coloring: ColorType | ThemeSelector
    size: string
}>`
    width: ${(p) => p.size};
    height: ${(p) => p.size};

    box-sizing: content-box;
    & svg {
        fill: ${(p) => {
            if (typeof p.coloring === 'function') {
                return p.coloring(p)
            }
            return colorSelect.icon[p.coloring](p)
        }};
        width: 100%;
        height: 100%;
    }
`
