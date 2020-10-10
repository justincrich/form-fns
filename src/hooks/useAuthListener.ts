import { useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { SerializedError } from '@reduxjs/toolkit'
import {
    subscribeAuth,
    selectUserLoading,
    selectUserError,
} from '../services/user'
import { useReduxDispatch } from '../services/index'
import { useAuthCheck } from './useAuthCheck'

export const useAuthListener = (
    envId: string | null
): {
    isAuthenticated: boolean
    isLoading: boolean
    error: SerializedError | null
} => {
    const dispatch = useReduxDispatch()
    const isLoading = useSelector(selectUserLoading, shallowEqual)
    const isAuthenticated = useAuthCheck()
    const error = useSelector(selectUserError, isEqual)

    useEffect(() => {
        dispatch(subscribeAuth(envId))
    }, [envId, dispatch])

    return { isAuthenticated, isLoading, error }
}
