import React from 'react'
import styled, { css } from 'styled-components'
import {Icon} from '../components'
import { spacing, text, color } from '../styles'

interface CommentPanelProps {
    className?: string
    isOpen?: boolean
}
export const CommentPanel = (props: CommentPanelProps): JSX.Element => {
    const { isOpen: controlledIsOpen, className } = props
    const [isOpen, toggleOpen] = React.useState(controlledIsOpen || true)
    return (
        <Container isOpen={isOpen} className={className}>
            <Header isOpen={isOpen}>
                Comments
                <Button iconName={isOpen ? 'FaMinus':'FaPlus'} color={color.icon.activityMuted}/>
            </Header>
        </Container>
    )
}

const Container = styled.div<{isOpen:boolean}>`
  background-color: ${color.background.content};
  position: absolute;
  top: ${spacing[1]};
  right: ${spacing[1]};
  
  width: 300px;
  border: 1px solid ${color.border.primary};
  border-radius: 2px;
  ${p => p.isOpen ? css`
    height: 90%;
    top: 50%;
    transform: translateY(-50%);
  `: null}
`

const Header = styled.div<{isOpen:boolean}>`
    ${text('title','primary')}
    width: 100%;
    padding: ${spacing[2]};
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
`

const Button = styled(Icon)`
    cursor: pointer;
`