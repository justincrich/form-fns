import { ApiError, ApiErrorType } from './ApiError'

export enum AuthErrorType {
    InvalidUserId = 'InvalidUserId',
    InvalidEmail = 'InvalidEmail',
    WrongPassword = 'InvalidPassword',
    UserNotFound = 'InvalidUser',
    UserDisabled = 'UserDisabled',
    InvalidEnvironment = 'InvalidEnvironment',
}

export class AuthError extends ApiError {
    subtype: AuthErrorType

    constructor(subtype: AuthErrorType) {
        super(ApiErrorType.Unauthorized)
        this.subtype = subtype
    }
}
