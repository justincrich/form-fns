import React from 'react'
import styled from 'styled-components'
import Spinner from 'react-spinkit'
import { color } from '../../styles/color'
import { mixins } from '../../styles/mixins/index'

export const LoadingPage = (): JSX.Element => {
    return (
        <Container>
            <Spinner name="ball-beat" className="mirliton" />
            <div>Loading ...</div>
        </Container>
    )
}

const Container = styled.div`
    ${mixins.text('sub', 'primary')}
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    background-color: ${color.background.app};
    & .mirliton * {
        background-color: ${color.brand.primary};
    }
`
