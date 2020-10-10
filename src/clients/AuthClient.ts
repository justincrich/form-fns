import { ApiClient, Permissions, FirebaseAuthErrorCode } from './ApiClient'
import { AUTH, ENVIRONMENT } from '../util/errors/messages'
import { ApiError, ApiErrorType } from '../util/errors/ApiError'
import { AuthError, AuthErrorType } from '../util/errors/AuthError'

export interface EmailAuthParams {
    email: string
    password: string
}

export interface AuthCredentials {
    uid: string
    email: string | null
}

export interface AuthChangeArgs {
    credentials: AuthCredentials | null
}

export class AuthClient extends ApiClient {
    private _emailLogin = async (
        email: string,
        password: string
    ): Promise<firebase.auth.UserCredential> => {
        try {
            const response = await this._authClient.signInWithEmailAndPassword(
                email,
                password
            )
            return response
        } catch (e) {
            switch (e.code) {
                case FirebaseAuthErrorCode.UserNotFound:
                    throw new AuthError(AuthErrorType.UserNotFound)
                case FirebaseAuthErrorCode.InvalidEmail:
                    throw new AuthError(AuthErrorType.InvalidEmail)
                case FirebaseAuthErrorCode.WrongPassword:
                    throw new AuthError(AuthErrorType.WrongPassword)
                case FirebaseAuthErrorCode.UserDisabled:
                    throw new AuthError(AuthErrorType.UserDisabled)
                default:
                    throw new ApiError(ApiErrorType.Unknown)
            }
        }
    }

    async getToken(): Promise<string> {
        const token = await this._authClient.currentUser?.getIdToken()
        if (!token) {
            throw new Error(AUTH.NOT_LOGGED_IN())
        }
        return token
    }

    async emailSignIn({ email, password }: EmailAuthParams): Promise<void> {
        const { user } = await this._emailLogin(email, password)
        if (user) {
            return
        }
        throw new Error('Unknown Error')
    }

    signOut(): Promise<void> {
        return this._authClient.signOut()
    }

    subscribeToAuthChanges(
        onAuthChange: (args: AuthCredentials | null) => void,
        onError: (e: Error) => void
    ): void {
        this._authClient.onIdTokenChanged((user): void => {
            if (!user) {
                onAuthChange(null)
            } else {
                try {
                    onAuthChange({ uid: user.uid, email: user.email })
                } catch (e) {
                    onError(e)
                }
            }
        })
    }
}
