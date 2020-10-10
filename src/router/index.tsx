import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'
import { useAuthListener } from '../hooks/useAuthListener'

import { ROUTES } from './routes'

import { useSubdomain } from './hooks'
import { selectUserId } from '../services/user'
import { LoadingPage } from '../containers/LoadingPage/index'

const AuthRoutes = (): JSX.Element | null => {
    const userId = useSelector(selectUserId, shallowEqual)

    if (!userId) {
        return <Redirect to={ROUTES.AUTH} />
    }
    return (
        <>
            <Route path={[ROUTES.HOME, ROUTES.AUTH]} exact>
                <div>logged in</div>
            </Route>
        </>
    )
}

const UnauthRoutes = (): JSX.Element | null => {
    return (
        <>
            <Route path={ROUTES.AUTH}>
                <div>sign in</div>
            </Route>
            <Route path={ROUTES.HOME}>
                <Redirect to={ROUTES.AUTH} />
            </Route>
        </>
    )
}

export const Router = (): JSX.Element => {
    const { subdomain: envId } = useSubdomain()
    const { isAuthenticated, isLoading, error } = useAuthListener(envId)

    if (isLoading) {
        return <LoadingPage />
    }

    return (
        <BrowserRouter>
            <Switch>
                {isAuthenticated ? <AuthRoutes /> : <UnauthRoutes />}
                {error && <Redirect to={ROUTES.NOT_FOUND} />}
                <Route path={ROUTES.NOT_FOUND}>
                    <div>not found</div>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
