import React from 'react'
import styled from 'styled-components'
import Tippy from '@tippyjs/react'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'
import { transformColorOpacity } from '../../util/color'

interface TooltipProps {
    children: JSX.Element
    content: string
}

export const Tooltip = ({ children, content }: TooltipProps): JSX.Element => {
    const renderContent = (): JSX.Element => {
        return <Container>{content}</Container>
    }
    return <Tippy content={renderContent()}>{children}</Tippy>
}

const Container = styled.div`
    ${mixins.text('sub')}
    padding: ${mixins.spacing[1]};
    border-radius: 5px;
    color: ${color.text.inverted};
    background-color: ${(p) =>
        transformColorOpacity(color.text.primary(p), 0.7)};
`
