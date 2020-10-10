import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuthCheck } from '../../hooks/useAuthCheck'
import { Navbar } from '../Navbar'
import { selectUser, signOut } from '../../services/user'
import { color } from '../../styles/color'
import { useReduxDispatch } from '../../services/index'

interface LayoutProps {
    className?: string
    children: JSX.Element | JSX.Element[] | string
    hideProfile?: boolean
    headerLeft?: JSX.Element
    headerRight?: JSX.Element
    headerCenter?: JSX.Element
}
export const Layout = ({
    className,
    children,
    headerCenter,
    headerLeft,
    headerRight,
}: LayoutProps): JSX.Element => {
    const isAuthenticated = useAuthCheck()
    const dispatch = useReduxDispatch()
    const user = useSelector(selectUser)
    const handleLogout = (): void => {
        dispatch(signOut())
    }
    if (!isAuthenticated) {
        return <Redirect to="/auth" />
    }
    return (
        <Container className={className}>
            <Column>
                <Navbar
                    left={headerLeft}
                    center={headerCenter}
                    right={
                        <button type="button" onClick={() => handleLogout()}>
                            Logout
                        </button>
                    }
                />
                <Content>{children}</Content>
            </Column>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    min-width: 320px;
    height: 100%;
    background-color: ${color.background.app};
    display: flex;
    flex-flow: row nowrap;
    flex: 1 1 auto;
`

const Content = styled.div`
    display: flex;
    flex-flow: column nowrap;
    flex: 1 1 auto;
    overflow: hidden;
    max-width: 100%;
`

const Column = styled.div`
    flex-flow: column nowrap;
    display: flex;
    flex: 1 1 auto;
    max-width: 100%;
`

Layout.Container = Container
