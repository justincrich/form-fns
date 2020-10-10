import {
    createSlice,
    PayloadAction,
    createAsyncThunk,
    SerializedError,
} from '@reduxjs/toolkit'
import { AuthClient } from '../clients/AuthClient'

import { createActionType } from './utils'
import { User } from '../clients/MembershipClient'

export interface UserState {
    value: User | null
    loading: boolean
    error: SerializedError | null
    token: string | null
}

const REDUCER_NAME = 'user'

const createAuthActionType = (name: string): string =>
    createActionType(name, REDUCER_NAME)

const authClient = new AuthClient()

export const subscribeAuth = createAsyncThunk(
    createAuthActionType('subscribeAuth'),
    (envId: string | null, thunkApi): void => {
        const handleAuthUpdate = async (
            params: { uid: string; email: string | null } | null
        ): Promise<void> => {
            const { uid, email } = params || {}

            if (!uid || !envId) {
                thunkApi.dispatch(authChange(null))
                return
            }
            const token = await authClient.getToken()
            thunkApi.dispatch(authSlice.actions.authAddToken(token))
        }

        authClient.subscribeToAuthChanges(
            (args) => {
                handleAuthUpdate(args)
            },
            (error) => {
                throw error
            }
        )
    }
)

interface SignInParams {
    email: string
    password: string
}
export const requestSignIn = createAsyncThunk(
    createAuthActionType('login'),
    async (params: SignInParams): Promise<void> => {
        const { email, password } = params
        await authClient.emailSignIn({ email, password })
    }
)

export const signOut = createAsyncThunk(
    createAuthActionType('signOut'),
    (): Promise<void> => authClient.signOut()
)

const initialState: UserState = {
    loading: true,
    value: null,
    error: null,
    token: null,
}

const authSlice = createSlice({
    name: REDUCER_NAME,
    initialState,
    reducers: {
        // loginSuccess(draft, action: PayloadAction<User>) {
        //     draft.user = { value: action.payload, error: null, loading: false }
        // },
        authChange(draft, action: PayloadAction<User | null>) {
            draft.value = action.payload
            draft.loading = false
            draft.error = null
        },
        setAuthLoading(draft, action: PayloadAction<boolean>) {
            draft.loading = action.payload
        },
        authAddToken(draft, action: PayloadAction<string>) {
            draft.token = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signOut.fulfilled, (draft) => {
            draft.value = null
            draft.token = null
        })
        builder.addCase(requestSignIn.pending, (draft) => {
            draft.loading = true
            draft.error = null
        })
        // builder.addCase(requestSignIn.fulfilled, (draft, action) => {
        //     draft.loading = false
        //     draft.user = action.payload
        // })
        builder.addCase(requestSignIn.rejected, (draft, action) => {
            draft.loading = false
            draft.error = action.error
        })
        builder.addCase(subscribeAuth.rejected, (draft, action) => {
            console.log('ACTION', action)
            draft.error = action.error
            draft.loading = false
        })
    },
})

export const { authChange, setAuthLoading } = authSlice.actions

interface AppState {
    user: UserState
}

export const selectUser = (state: AppState): User | null => state.user.value

export const selectUserId = (state: AppState): string | null =>
    state.user.value?.uid || null

export const selectUserLoading = (state: AppState): boolean =>
    state.user.loading

export const selectUserError = (state: AppState): SerializedError | null =>
    state.user.error

export const selectUserPermissions = (
    state: AppState
): User['permissions'] | null => state.user.value?.permissions || null

export const { reducer } = authSlice
