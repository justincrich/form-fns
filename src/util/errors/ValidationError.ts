import { Runtype, ValidationError as RunTypeError } from 'runtypes'
import { ApiError, ApiErrorType } from './ApiError'

export class ValidationError<Data> extends ApiError {
    data: unknown

    schema: Runtype<Data>

    property?: string

    constructor(schema, data: unknown, error: RunTypeError) {
        super(ApiErrorType.Validation, error)
        this.schema = schema
        this.data = data
        this.property = error.key
    }
}
