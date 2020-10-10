import { SerializedError } from '@reduxjs/toolkit'

export type AsyncState<Value> =
    | { value: Value; loading: false; error: null }
    | { value: null; loading: true; error: null }
    | { value: null; loading: false; error: SerializedError }
    | { value: null; loading: false; error: null }
