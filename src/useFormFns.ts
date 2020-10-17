/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useReducer, Reducer, ChangeEvent, useEffect, useCallback } from 'react'
import produce from 'immer'

type Deep<T = Record<string, any>> = { [K in keyof T]: Deep<T[K]> }

type ValueType<Template extends object> = Template[keyof Template]

type ErrorType = Error | null | boolean | string

type Event = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

type State<Template extends object> = {
    values: Partial<Template>
    errors: Record<keyof Template, ErrorType>
}

type ValidationResultFail = {
    isValid: false
    message: ErrorType
}

type ValidationResultPass = {
    isValid: true
}

type ValidationResult = ValidationResultFail | ValidationResultPass

type ValidationFn<Template extends object> = (
    value: ValueType<Template> | undefined,
    previousState: State<Template>
) => boolean | [boolean, string | Error]

type ValidationType<Template extends object> =
    | ValidationFn<Template>[]
    | ValidationFn<Template>

type ChangeConfig<Template extends object> = {
    validation?: ValidationType<Template>
    submit?: (
        value: ValueType<Template>,
        previousState: State<Template>
    ) => void
}

type Action<Type, Payload> = { type: Type; payload: Payload }

type ValueAction<Template> = Action<
    'VALUE',
    { key: keyof Template; value: Template[keyof Template] | undefined }
>

type ErrorAction<Template> = Action<
    'ERROR',
    { key: keyof Template; error: ErrorType }
>

type BaseActions<Template> = ValueAction<Template> | ErrorAction<Template>

const DEFAULT_MESSAGE = 'Invalid'

// think about arrays
const getFullPath = (unknownPath: unknown): (string | number)[] => {
    if (typeof unknownPath === 'string') return unknownPath.split('.')
    if (typeof unknownPath === 'number') return [unknownPath]
    throw new Error(`Invalid form template key ${unknownPath}`)
}

const baseReducer = <Template extends object>(
    state: State<Template>,
    action: BaseActions<Template>
): State<Template> => {
    switch (action.type) {
        case 'VALUE':
            return produce(state, (draft) => {
                const { key, value } = action.payload
                const strKey = `${key}`
                draft.values[strKey] = value
            })
        case 'ERROR':
            return produce(state, (draft) => {
                const { key, error } = action.payload
                const strKey = `${key}`
                draft.errors[strKey] = error
            })
        default:
            return { ...state }
    }
}

const deepCopy = <T>(object: T): T => JSON.parse(JSON.stringify(object))

const isEvent = (unknown: unknown): unknown is Event =>
    typeof unknown === 'object'

type InputType<Template extends object> = ValueType<Template> | Event
export const useFormFns = <Template extends object>(params: {
    seedValues: Template
    invalidMessages?: Partial<{ [key in keyof Template]: string }>
}): {
    inputs: Record<
        keyof Template,
        {
            value: () => Partial<Template>[keyof Template]
            error: () => Record<keyof Template, ErrorType>[keyof Template]
            onChange: (
                data: InputType<Template>,
                config?: ChangeConfig<Template> | undefined
            ) => void
            validate: (validations: ValidationType<Template>) => boolean
        }
    >
    errors: State<Template>['errors']
    values: State<Template>['values']
} => {
    type KeyType = keyof Template
    type ValueOrUndefined = ValueType<Template> | undefined

    const { seedValues, invalidMessages = {} } = params
    const errors = Object.keys(seedValues).reduce((acc, key) => {
        acc[key] = null
        return acc
    }, {} as Record<keyof Template, null | Error>)

    const [state, dispatch] = useReducer<
        Reducer<State<Template>, BaseActions<Template>>
    >(baseReducer, {
        values: seedValues,
        errors,
    })

    const handleValidation = (
        key: KeyType,
        value: ValueOrUndefined,
        validationConfig: ChangeConfig<Template>['validation']
    ): boolean => {
        if (!validationConfig) return true
        const validations = Array.isArray(validationConfig)
            ? validationConfig
            : [validationConfig]

        for (const valIdx in validations) {
            const result = validations[valIdx](value, deepCopy(state))
            const [isValid, passedMessage] = Array.isArray(result)
                ? result
                : [result]
            const defaultMessage: string =
                invalidMessages[key as string] || DEFAULT_MESSAGE

            if (!isValid) {
                dispatch({
                    type: 'ERROR',
                    payload: {
                        key,
                        error: passedMessage || defaultMessage,
                    },
                })
                return false
            }
        }
        dispatch({
            type: 'ERROR',
            payload: { key, error: null },
        })
        return true
    }

    const handleValue = (
        key: KeyType,
        data: InputType<Template>,
        config?: ChangeConfig<Template>
    ): void => {
        let inputValue
        if (isEvent(data)) inputValue = data.target.value
        else inputValue = data as ValueOrUndefined
        let isValid = true
        if (config?.validation)
            isValid = handleValidation(key, inputValue, config.validation)
        if (config?.submit && isValid) {
            config.submit(inputValue, state)
        }
        dispatch({ type: 'VALUE', payload: { key, value: inputValue } })
    }

    const actionFns = (
        key: KeyType
    ): {
        value: () => State<Template>['values'][KeyType]
        error: () => State<Template>['errors'][KeyType]
        onChange: (
            data: InputType<Template>,
            config?: ChangeConfig<Template>
        ) => void
        validate: (validations: ValidationType<Template>) => boolean
    } => {
        const templateKey = key
        return {
            value: () => state.values[templateKey],
            onChange: (data, config) => handleValue(key, data, config),
            error: () => state.errors[templateKey],
            validate: (validations): boolean =>
                handleValidation(key, state.values[key], validations),
        }
    }

    const inputFns = Object.keys(seedValues).reduce((acc, key) => {
        const templateKey = key as keyof Template
        acc[templateKey] = actionFns(templateKey)
        return acc
    }, {} as Record<keyof Template, ReturnType<typeof actionFns>>)

    return {
        inputs: inputFns,
        errors: state.errors,
        values: deepCopy(state.values),
    }
}
