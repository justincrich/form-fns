/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import { useReducer, Reducer } from 'react'
import produce from 'immer'

type TemplateType = { [key in string]: any | any[] }

export type ErrorType = string | undefined

type State<Template> = {
    values: Template
    errors: { [P in keyof Template]?: ErrorType | ErrorType[] }
}

type ConditionalArrayItemType<
    Template,
    K extends keyof Template
    > = Template[K] extends Array<any> ? Template[K][number] : never

export type ValidationFn<
    Template,
    K extends keyof Template = keyof Template
    > = (
        currentValue: Template[K],
        nextState: State<Template>['values']
    ) => {
        isValid: boolean
        message?: string
    }

type ValidationType<Template, K extends keyof Template> =
    | ValidationFn<Template, K>[]
    | ValidationFn<Template, K>

type ChangeArgs<Template, K extends keyof Template> = {
    changedKey: K
    changedIndex?: number
    newValue: Template[K]
    previousState: State<Template>['values']
}
type ChangeConfig<Template, K extends keyof Template> = {
    validation?: ValidationType<Template, K>
    onValid?: (args: ChangeArgs<Template, K>) => void
    onInvalid?: (args: ChangeArgs<Template, K>) => void
    onFinal?: (args: ChangeArgs<Template, K>) => void
}

type Action<Type, Payload> = { type: Type; payload: Payload }

type ValueAction<Template> = Action<
    'VALUE',
    { key: keyof Template; value: State<Template>['values'][keyof Template] }
>

type ArrayValueAction<Template> = Action<
    'ARRAY_VALUE',
    {
        key: keyof Template
        value: ConditionalArrayItemType<Template, keyof Template>
        index: number
    }
>

type ErrorAction<Template> = Action<
    'ERROR',
    { key: keyof Template; error: State<Template>['errors'][keyof Template] }
>

type BulkErrorAction<Template> = Action<
    'BULK_ERRORS',
    State<Template>['errors']
>

type ArrayErrorAction<Template> = Action<
    'ARRAY_ERROR',
    {
        key: keyof Template
        value: ErrorType
        index: number
    }
>

type BaseActions<Template> =
    | ValueAction<Template>
    | ErrorAction<Template>
    | BulkErrorAction<Template>
    | ArrayValueAction<Template>
    | ArrayErrorAction<Template>

const DEFAULT_MESSAGE = 'Invalid'

const baseReducer = <Template extends TemplateType>(
    state: State<Template>,
    action: BaseActions<Template>
): State<Template> => {
    const setArrayItem = <V>(index: number, value: V, data: any): V[] | V => {
        const list = data

        if (list && !Array.isArray(list)) return list

        const mutableList = Array.isArray(list) ? [...list] : []
        mutableList[index] = value

        return mutableList
    }

    switch (action.type) {
        case 'VALUE':
            return produce(state, (draft: State<Template>) => {
                const { value, key } = action.payload
                draft.values[key] = value
            })
        case 'ERROR':
            return produce(state, (draft: State<Template>) => {
                const { error, key } = action.payload
                draft.errors[key] = error
            })
        case 'ARRAY_VALUE':
            return produce(state, (draft: State<Template>) => {
                const { index, key, value } = action.payload
                // TODO: fix this better, kinda a hack
                draft.values[key] = setArrayItem(
                    index,
                    value,
                    draft.values?.[key]
                ) as Template[keyof Template]
            })
        case 'ARRAY_ERROR':
            return produce(state, (draft: State<Template>) => {
                const { index, key, value } = action.payload
                draft.errors[key] = setArrayItem(
                    index,
                    value,
                    draft.values?.[key]
                )
            })
        case 'BULK_ERRORS':
            return produce(state, (draft: State<Template>) => {
                draft.errors = action.payload
            })
        default:
            return { ...state }
    }
}

const deepCopy = <T>(object: T): T => JSON.parse(JSON.stringify(object))

type ValidationDirectory<Template> = {
    [K in keyof Template]?: ValidationType<Template, K>
}

export const useFormFns = <Template>({
    initialValues,
    validation,
}: {
    initialValues: Template
    validation?: {
        onSubmit?: ValidationDirectory<Template>
    }
}): {
    values: State<Template>['values']
    errors: State<Template>['errors']
    // addDynamicField: <K extends keyof Template, Value>(key: K, index: number, initialValue?: Value) => void
    // removeDynamicField: <K extends keyof Template>(key: K, index: number) => void
    setValue: <K extends keyof Template>(
        key: K,
        value: Template[K],
        config?: ChangeConfig<Template, K>
    ) => void
    setArrayValue: <K extends keyof Template>(
        key: K,
        index: number,
        value: ConditionalArrayItemType<Template, K>,
        config?: ChangeConfig<Template, K>
    ) => void
    submit: () => State<Template>['values'] | undefined
} => {
    const [state, dispatch] = useReducer<
        Reducer<State<Template>, BaseActions<Template>>
    >(baseReducer, {
        values: initialValues || ({} as Template),
        errors: {},
    })

    const validateField = <K extends keyof Template>(
        value: Template[K],
        operations: ValidationType<Template, K>
    ): ErrorType => {
        if (!operations) {
            return undefined
        }
        const validations = Array.isArray(operations)
            ? operations
            : [operations]

        for (const valIdx in validations) {
            const { isValid, message: passedMessage } = validations[valIdx](
                value,
                state.values
            )

            const message: string = passedMessage || DEFAULT_MESSAGE

            if (!isValid) {
                return message
            }
        }
        return undefined
    }

    const handleCallbacks = <K extends keyof Template>(
        params: ChangeConfig<Template, K> & {
            error?: ErrorType
            key: K
            value: Template[K]
            index?: number
        }
    ): void => {
        const { error, onInvalid, onValid, value, key, index, onFinal } = params
        const validationStateCallback = error ? onInvalid : onValid
        const callbackParams = {
            previousState: state.values,
            newValue: value,
            changedKey: key,
            changedIndex: index,
        }
        validationStateCallback?.(callbackParams)
        onFinal?.(callbackParams)
    }

    const validateAll = (
        operations: ValidationDirectory<Template> = {}
    ): State<Template>['errors'] => {
        const mutableErrors = { ...state.errors }
        Object.entries(operations).forEach(([key, operation]) => {
            const strongKey = key as keyof Template
            const itemOperation = operation as ValidationType<
                Template,
                keyof Template
            >
            if (itemOperation) {
                mutableErrors[strongKey] = validateField(
                    state.values[strongKey],
                    itemOperation
                )
            }
        })
        return mutableErrors
    }

    return {
        values: deepCopy<State<Template>['values']>(state.values),
        errors: deepCopy<State<Template>['errors']>(state.errors),
        setValue: (key, value, config) => {
            const { onFinal, onValid, onInvalid } = config || {}
            let error = state.errors[key]

            if (config && config.validation) {
                error = validateField(value, config.validation)
                dispatch({
                    type: 'ERROR',
                    payload: {
                        key,
                        error,
                    },
                })
            }

            handleCallbacks({
                onFinal,
                onValid,
                onInvalid,
                key,
                value,
                error,
            })

            dispatch({
                type: 'VALUE',
                payload: {
                    key,
                    value,
                },
            })
        },
        setArrayValue: <K extends keyof Template>(
            key: K,
            index: number,
            value: ConditionalArrayItemType<Template, K>,
            config: ChangeConfig<Template, K> | undefined
        ): void => {
            const { onFinal, onValid, onInvalid } = config || {}
            const previousList = state.values[key]
            if (
                !Array.isArray(previousList) ||
                typeof previousList !== 'undefined' ||
                previousList !== null
            ) {
                throw new Error('Value must be array or undefined')
            }
            const previousErrors = state.errors[key]
            if (!Array.isArray(previousErrors))
                // eslint-disable-next-line no-console
                console.error(
                    'Array errors must be in array format, resetting value'
                )

            const mutableList = previousList ? [...previousList] : []
            const safePreviousErrors = Array.isArray(state.errors)
                ? state.errors
                : []

            let error = safePreviousErrors[index]

            if (config && config.validation) {
                error = validateField(value, config.validation)
                dispatch({
                    type: 'ERROR',
                    payload: {
                        key,
                        error,
                    },
                })
            }

            mutableList[index] = value

            handleCallbacks({
                onFinal,
                onValid,
                onInvalid,
                key,
                value,
                index,
                error,
            })

            // TODO: add indexed item error and item add
        },
        submit: () => {
            const newErrors = validateAll(validation?.onSubmit)
            dispatch({
                type: 'BULK_ERRORS',
                payload: newErrors,
            })
            let isValid = true
            Object.values(newErrors).forEach((error) => {
                if (Array.isArray(error)) {
                    error.forEach((arrayError) => {
                        if (arrayError && isValid) isValid = false
                    })
                } else if (!!error && isValid) {
                    isValid = false
                }
            })
            return isValid ? state.values : undefined
        },
    }
}
