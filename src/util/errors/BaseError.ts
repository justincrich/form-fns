/* eslint-disable no-console */
export enum BaseErrorTypes {
    UNKNOWN = 'unknown',
}

export class BaseError extends Error {
    constructor(
        public readonly message: string,
        public readonly cause?: Error
    ) {
        super(message)
        this.name = message
        this.logError()
    }

    logError(): void {
        console.group()
        console.error(this)
        console.error(this.cause)
        console.groupEnd()
    }
}
