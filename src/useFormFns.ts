/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import { useReducer, Reducer } from 'react'
import produce from 'immer'

type TemplateType = { [key in string]: any | any[] }

export type ErrorType = string | undefined | null

type State<Template extends TemplateType> = {
    values: Template
    errors: { [P in keyof Template]?: ErrorType | ErrorType[] }
}

type ConditionalValueSelectionType<
    Template,
    K extends keyof Template
    > = Template[K] extends Array<any> ? Template[K][number] : Template[K]

export type ValidationFn<
    Template,
    K extends keyof Template = keyof Template
    > = (
        currentValue: ConditionalValueSelectionType<Template, K>,
        nextState: State<Template>['values']
    ) => {
        isValid: boolean
        message?: string
    }

type ValidationType<Template, K extends keyof Template> =
    | ValidationFn<Template, K>[]
    | ValidationFn<Template, K>

type ChangeArgs<Template extends TemplateType, K extends keyof Template> = {
    changedKey: K
    changedIndex?: number
    newValue: ConditionalValueSelectionType<Template, K>
    previousState: State<Template>['values']
}

type CallbackType<Template extends TemplateType, K extends keyof Template> = (
    args: ChangeArgs<Template, K>
) => void

type BaseChangeConfig<
    Template extends TemplateType,
    K extends keyof Template
    > = {
        onFinal?: (args: ChangeArgs<Template, K>) => void
    }

type ValidationChangeConfig<
    Template extends TemplateType,
    K extends keyof Template
    > = {
        validation?: ValidationType<Template, K>
        onValid?: (args: ChangeArgs<Template, K>) => void
        onInvalid?: (args: ChangeArgs<Template, K>) => void
    } & BaseChangeConfig<Template, K>

type Action<Type, Payload> = { type: Type; payload: Payload }

type ValueAction<Template> = Action<
    'VALUE',
    { key: keyof Template; value: State<Template>['values'][keyof Template] }
>

type ArrayValueAction<Template extends TemplateType> = Action<
    'SET_ARRAY_VALUE',
    {
        key: keyof Template
        value: ConditionalValueSelectionType<Template, keyof Template>
        index: number
    }
>

type ArrayItemRemoveAction<Template extends TemplateType> = Action<
    'ARRAY_REMOVE_ITEM',
    {
        key: keyof Template
        index: number
    }
>

type ArrayItemAddAction<Template extends TemplateType> = Action<
    'ARRAY_ADD_ITEM',
    {
        key: keyof Template
        index: number
        value: any
    }
>

type ErrorAction<Template extends TemplateType> = Action<
    'ERROR',
    { key: keyof Template; error: State<Template>['errors'][keyof Template] }
>

type BulkErrorAction<Template extends TemplateType> = Action<
    'BULK_ERRORS',
    State<Template>['errors']
>

type ArrayErrorAction<Template extends TemplateType> = Action<
    'ARRAY_ERROR',
    {
        key: keyof Template
        error: ErrorType
        index: number
    }
>

type BaseActions<Template extends TemplateType> =
    | ValueAction<Template>
    | ErrorAction<Template>
    | BulkErrorAction<Template>
    | ArrayValueAction<Template>
    | ArrayErrorAction<Template>
    | ArrayItemRemoveAction<Template>
    | ArrayItemAddAction<Template>

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
        case 'SET_ARRAY_VALUE':
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
                const { index, key, error } = action.payload
                draft.errors[key] = setArrayItem(
                    index,
                    error,
                    draft.errors?.[key]
                )
            })
        case 'BULK_ERRORS':
            return produce(state, (draft: State<Template>) => {
                draft.errors = action.payload
            })
        case 'ARRAY_REMOVE_ITEM':
            return produce(state, (draft: State<Template>) => {
                const { key, index } = action.payload
                const mutableList = draft.values[key]
                if (!Array.isArray(mutableList)) return

                mutableList.splice(index, 1)

                draft.values[key] = mutableList

                const errors: ErrorType | ErrorType[] = draft.errors[key]
                if (Array.isArray(errors)) {
                    errors.splice(index, 1)
                    draft.errors[key] = errors
                }
            })
        case 'ARRAY_ADD_ITEM':
            return produce(state, (draft: State<Template>) => {
                const { index, key, value } = action.payload
                const list = draft.values[key] || []
                const emptyErrors: ErrorType[] = new Array(
                    Array.isArray(list) ? list.length : 1
                ).fill(null)
                const errors = draft.errors[key] || emptyErrors
                if (!Array.isArray(list) || !Array.isArray(errors)) return

                draft.values[key] = [
                    ...list.slice(0, index),
                    value,
                    ...list.slice(index),
                ] as Template[keyof Template]
                draft.errors[key] = [
                    ...errors.slice(0, index),
                    null,
                    ...errors.slice(index),
                ]
            })
        default:
            return { ...state }
    }
}

const deepCopy = <T>(object: T): T => JSON.parse(JSON.stringify(object))

type ValidationDirectory<Template extends TemplateType> = {
    [K in keyof Template]?: ValidationType<Template, K>
}

export const useFormFns = <Template extends TemplateType>({
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
        config?: ValidationChangeConfig<Template, K>
    ) => void
    setArrayValue: <K extends keyof Template>(
        key: K,
        index: number,
        value: Template[K][number],
        config?: ValidationChangeConfig<Template, K>
    ) => void
    addArrayItem: <K extends keyof Template>(
        key: K,
        index: number,
        value: Template[K][number],
        config?: BaseChangeConfig<Template, K>
    ) => void
    removeArrayItem: <K extends keyof Template>(
        key: K,
        index: number,
        config?: BaseChangeConfig<Template, K>
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
        value: ConditionalValueSelectionType<Template, K>,
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
        return null
    }

    const handleCallbacks = <K extends keyof Template>(
        params: ValidationChangeConfig<Template, K> & {
            error?: ErrorType | ErrorType[]
            key: K
            value: ConditionalValueSelectionType<Template, K>
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
                type: 'ERROR',
                payload: {
                    key,
                    error,
                },
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
            value: ConditionalValueSelectionType<Template, K>,
            config: ValidationChangeConfig<Template, K> | undefined
        ): void => {
            const { onFinal, onValid, onInvalid } = config || {}

            if (!Array.isArray(state.values[key] || [])) {
                throw new Error('Only array values can be set')
            }
            const previousErrors = state.errors[key] || []
            if (!Array.isArray(previousErrors))
                throw new Error('Only array errors can be set')

            if (index >= state.values[key].length || index < 0)
                throw new Error(
                    `Invalid index ${index}, total length is ${state.values[key].length}`
                )

            let error: ErrorType = previousErrors[index] || null

            if (config && config.validation) {
                error = validateField(value, config.validation)
            }

            handleCallbacks({
                onFinal,
                onValid,
                onInvalid,
                key,
                value,
                index,
                error,
            })

            dispatch({
                type: 'ARRAY_ERROR',
                payload: {
                    key,
                    error,
                    index,
                },
            })

            dispatch({
                type: 'SET_ARRAY_VALUE',
                payload: {
                    key,
                    value,
                    index,
                },
            })
        },
        removeArrayItem: (key, index, config) => {
            const { onFinal } = config || {}
            if (!Array.isArray(state.values[key] || []))
                throw new Error('Item is not an array')
            if (state.values[key].length === 0)
                // eslint-disable-next-line no-console
                return console.warn('Array item is empty')
            if (index >= state.values[key].length || index < 0)
                throw new Error('Item is out of bounds for array')

            const value = state.values[key][index]

            handleCallbacks({
                onFinal,
                key,
                index,
                value,
            })
            return dispatch({
                type: 'ARRAY_REMOVE_ITEM',
                payload: { index, key },
            })
        },
        addArrayItem: (key, index, value, config) => {
            const { onFinal } = config || {}
            const list = state.values[key] || []
            if (!Array.isArray(list)) throw new Error('Item is not an array')

            if (index > list.length || index < 0)
                throw new Error('New item must be sequential and in range')

            handleCallbacks({
                onFinal,
                key,
                index,
                value,
            })
            dispatch({
                type: 'ARRAY_ADD_ITEM',
                payload: {
                    key,
                    index,
                    value,
                },
            })
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
