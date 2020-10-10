/* eslint-disable @typescript-eslint/no-explicit-any */
import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'
import { PROJECT_ID, API_KEY, AUTH_DOMAIN, DATABASE_URL } from '../config'
import { ApiError, ApiErrorType } from '../util/errors/ApiError'

export const Permissions = {
    manager: 'manager',
} as const

export enum FirebaseAuthErrorCode {
    PermissionDenied = 'PERMISSION_DENIED',
    InvalidEmail = 'auth/invalid-email',
    UserDisabled = 'auth/user-disabled',
    UserNotFound = 'auth/user-not-found',
    WrongPassword = 'auth/wrong-password',
    ActionCodeExpired = 'auth/expired-action-code',
    ActionCodeInvalid = 'auth/invalid-action-code',
    WeakPassword = 'auth/weak-password',
    TooManyRequests = 'auth/too-many-requests',
}

export const firebaseApp = firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    databaseURL: DATABASE_URL,
})

export interface FBEnvironmentMetadata {
    key: string
    name: string
    permissions: {
        [key in keyof typeof Permissions]: {
            [key: string]: boolean
        }
    }
}

export interface FBMembership {
    firstName: string
    lastName: string
    email?: string
    image?: string
}

export type SubscriptionOnValue<Value> = (value: Value | null) => void
export type SubscriptionOnError = (error: Error) => void
export type TranslationFn<Value> = (unknown: unknown) => Value
export type UnsubscribeFn = () => void

const db = firebaseApp.database()

const generateError = (e: any, data: string): Error => {
    switch (e.code) {
        case FirebaseAuthErrorCode.PermissionDenied:
            return new ApiError(
                ApiErrorType.Unauthorized,
                new Error('Insufficient server permissions')
            )
        case FirebaseAuthErrorCode.InvalidEmail:
        case FirebaseAuthErrorCode.TooManyRequests:
        case FirebaseAuthErrorCode.UserDisabled:
        case FirebaseAuthErrorCode.UserNotFound:
            return new ApiError(ApiErrorType.Unauthorized, new Error(data))
        default:
            return new ApiError(ApiErrorType.Unknown, new Error(data))
    }
}

export const getTimestamp = (isCreate?: boolean): DatetimeType => {
    const timestamp = new Date().valueOf()
    const dateTime: DatetimeType = { updatedAt: timestamp }
    if (isCreate) {
        dateTime.createdAt = timestamp
    }
    return dateTime
}

type DatetimeType = { createdAt?: number; updatedAt: number }

export abstract class ApiClient {
    protected _authClient = firebaseApp.auth()

    protected _db = db

    protected _getOnce = async <Value>(fbQuery: string): Promise<Value> => {
        try {
            const snapshot = await db.ref(fbQuery).once('value')
            if (!snapshot.exists()) {
                throw new ApiError(ApiErrorType.BadRequest, new Error(fbQuery))
            }
            return snapshot.val() as Value
        } catch (e) {
            if (e instanceof ApiError) {
                throw e
            }
            throw generateError(e, fbQuery)
        }
    }

    /**
     * Updates a value with a passed primitive (string, number, boolean). Will dynamically set the `updatedAt` value
     */
    protected _setValue = async (
        path: string[],
        value: string | number | boolean
    ): Promise<void> => {
        const fbPath = path.join('/')
        try {
            await db.ref(fbPath).set(value)
        } catch (e) {
            throw generateError(e, fbPath)
        }
    }

    /**
     * Updates a document with a passed object. Will dynamically set the `updatedAt` value and/or
     * `createdAt` values if none exists
     */
    protected _setDocument = async <Value extends Record<string, any>>(
        path: string[],
        data: Value
    ): Promise<void> => {
        const fbPath = path.join('/')
        try {
            await db.ref(fbPath).set(data)
        } catch (e) {
            throw generateError(e, fbPath)
        }
    }

    /**
     * Updates a value with a passed object. Will dynamically set the `createdAt` and `updatedAt` values
     */
    protected _addValue = async <Value extends Record<string, any>>(
        path: string[],
        data: Value
    ): Promise<void> => {
        const fbPath = path.join('/')
        try {
            await db.ref(fbPath).push({ ...data, ...getTimestamp(true) })
        } catch (e) {
            throw generateError(e, fbPath)
        }
    }

    protected _deleteValue = async (path: string[]): Promise<void> => {
        const fbPath = path.join('/')
        try {
            await db.ref(fbPath).remove()
        } catch (e) {
            throw generateError(e, fbPath)
        }
    }

    protected _subscribeToRef = <Value>(
        ref: firebase.database.Reference | firebase.database.Query,
        onValue: SubscriptionOnValue<Value>,
        onError: SubscriptionOnError,
        translate: TranslationFn<Value>
    ): UnsubscribeFn => {
        const subscription = ref.on(
            'value',
            (snapshot): void => {
                if (!snapshot || !snapshot.exists()) {
                    onError(new ApiError(ApiErrorType.NotFound))
                    return
                }
                try {
                    const unknownValue: unknown = snapshot.val()
                    const transformedValue = translate(unknownValue)
                    onValue(transformedValue)
                } catch (e) {
                    onError(e)
                }
            },
            onError
        )
        return () => {
            ref.off('value', subscription)
        }
    }
}

// export const subscribe = (collection: string, key: string) => {}
