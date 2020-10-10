import { BaseError } from './BaseError'

export class UnknownError extends BaseError {
    constructor(e: Error) {
        super('An unknown error occurred', e)
    }
}
