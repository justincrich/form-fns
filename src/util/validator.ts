/* eslint-disable @typescript-eslint/no-explicit-any */
import { Runtype, ValidationError as RunTypeError } from 'runtypes'
import { UnknownError } from './errors/UnknownError'
import { ValidationError } from './errors/ValidationError'

export const assertsType = <Data>(
    schema: Runtype<Data>,
    data: unknown | any
): Data => {
    try {
        return schema.check(data)
    } catch (e) {
        if (e instanceof RunTypeError) {
            throw new ValidationError<Data>(schema, data, e)
        }
        throw new UnknownError(e)
    }
}
