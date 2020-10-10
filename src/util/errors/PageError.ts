import { BaseError } from './BaseError'
import { ROUTES } from '../../router/routes'

export class PageError extends BaseError {
    constructor(public readonly route: keyof typeof ROUTES, error?: Error) {
        super(`Page Error`, error)
    }
}
