import { useReducer, Reducer, ChangeEvent, useEffect, useCallback } from 'react'
import produce from 'immer'

type Deep<T = Object> = { [K in keyof T]: Deep<T[K]> }

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
    state: State<Template>
) => boolean | [boolean, string | Error]

type ValidationType<Template extends object> =
    | ValidationFn<Template>[]
    | ValidationFn<Template>

type ChangeConfig<Template extends object> = {
    validation: ValidationType<Template>
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
    console.log(action, state)
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

export const useFormFns = <Template extends object>(params: {
    seedValues: Template
    invalidMessages?: Partial<{ [key in keyof Template]: string }>
}) => {
    type KeyType = keyof Template
    type ValueOrUndefined = ValueType<Template> | undefined
    type InputType = ValueType<Template> | Event

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
        let validations = Array.isArray(validationConfig)
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
                    payload: { key, error: passedMessage || defaultMessage },
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
        data: InputType,
        config?: ChangeConfig<Template>
    ): void => {
        let inputValue: ValueOrUndefined = undefined
        if (data && data['target']) inputValue = data['target']['value']
        else inputValue = data as ValueOrUndefined
        if (config?.validation)
            handleValidation(key, inputValue, config.validation)
        dispatch({ type: 'VALUE', payload: { key, value: inputValue } })
    }

    const actionFns = (key: KeyType) => {
        const templateKey = key as KeyType
        return {
            value: (): ValueOrUndefined => state.values[templateKey],
            onChange: (
                data: InputType,
                config?: ChangeConfig<Template>
            ): void => handleValue(key, data, config),
            error: () => state.errors[templateKey],
            validate: (validations: ValidationType<Template>): boolean =>
                handleValidation(key, state.values[key], validations),
        }
    }

    const inputFns = Object.keys(seedValues).reduce((acc, key) => {
        const templateKey = key as keyof Template
        acc[templateKey] = actionFns(templateKey)
        return acc
    }, {} as Record<keyof Template, ReturnType<typeof actionFns>>)

    return {
        onChange: (key: keyof Template, value: Template[keyof Template]) => {
            dispatch({
                type: 'VALUE',
                payload: {
                    key,
                    value,
                },
            })
        },
        seedValues,
        inputs: inputFns,
        errors: state.errors,
    }
}
