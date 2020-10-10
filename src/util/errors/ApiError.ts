import { BaseError } from './BaseError'

export enum ApiErrorType {
    Unknown = 'Unknown',
    BadRequest = 'BadRequest',
    Unauthorized = 'Unauthorized',
    Validation = 'Validation',
    NotFound = 'NotFound',
}

type ErrorMessage = {
    [key in ApiErrorType]?: string
}

export const DEFAULT_MESSAGE = 'An error occurred'

const messages: ErrorMessage = {
    [ApiErrorType.Unknown]: DEFAULT_MESSAGE,
    [ApiErrorType.BadRequest]: 'Bad request',
    [ApiErrorType.Unauthorized]: 'Insufficient permissions',
}

export class ApiError extends BaseError {
    constructor(
        public readonly type: ApiErrorType,
        public readonly cause?: Error
    ) {
        super(messages[type] || DEFAULT_MESSAGE, cause)
    }
}
