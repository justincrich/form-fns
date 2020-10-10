import React from 'react'
import styled from 'styled-components'
import { color } from '../../styles/color'
import { mixins } from '../../styles/mixins'

interface NavbarProps {
    children?: JSX.Element | JSX.Element[] | string
    left?: JSX.Element
    right?: JSX.Element
    center?: JSX.Element
}
export const Navbar = (props: NavbarProps): JSX.Element => {
    const { left, right, center } = props
    return (
        <Container>
            <Pocket>{left}</Pocket>
            <Pocket>{center}</Pocket>
            <Pocket>{right}</Pocket>
        </Container>
    )
}

export const HEIGHT_PX = 80
const Pocket = styled.div`
    margin: 0 auto;
    &:first-child {
        margin-left: 0;
    }
    &:last-child {
        margin-right: 0;
    }
`
const Container = styled.div`
    ${mixins.text('title', 'primary')}
    display: flex;
    flex-flow: row nowrap;
    justify-content: stretch;
    align-items: center;
    height: ${HEIGHT_PX}px;
    background-color: ${color.background.content};
    width: 100%;
    padding: ${mixins.spacing[3]} ${mixins.spacing[4]};
    ${mixins.device.tablet`
        padding: ${mixins.spacing[4]} ${mixins.spacing[3]};
    `}
`

Navbar.Container = Container
