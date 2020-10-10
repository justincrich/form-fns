import React from 'react'
import styled from 'styled-components'
import { color } from '../../styles/color'

export class ErrorGuard extends React.Component<
    {
        children: JSX.Element | JSX.Element[]
    },
    { error: Error | null }
> {
    constructor(props) {
        super(props)
        this.state = { error: null }
    }

    static getDerivedStateFromError(error: Error): { error: Error } {
        console.log('error')
        return { error }
    }

    render(): React.ReactNode {
        const { error } = this.state
        const { children } = this.props
        if (error) {
            return <div>has error</div>
        }
        return children
    }
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${color.background.content};
`
