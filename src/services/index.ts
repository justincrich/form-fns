import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { rootReducer, RootState } from './rootReducer'

export const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware<RootState>()] as const,
    devTools: process.env.NODE_ENV !== 'production',
})

export type AppDispatch = typeof store.dispatch

export type ReduxDispatch = ThunkDispatch<RootState, undefined, Action>

export const useReduxDispatch = (): ReduxDispatch =>
    useDispatch<ReduxDispatch>()

declare global {
    interface Window {
        state: any
    }
}

// TODO: put state behind a flag
if (process.env.NODE_ENV !== 'production') {
    window.state = store.getState()
    store.subscribe(() => {
        window.state = store.getState()
    })
}
