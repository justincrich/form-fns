import { useReducer, Reducer, ChangeEvent } from 'react'
import produce from 'immer'

type Deep<T = Object> = { [K in keyof T]: Deep<T[K]> }
type KeyType = string | number | symbol
type Event = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

type State<Template extends object> = {
    values: Partial<Template>
    errors: Record<keyof Template, Error | null>
}

type Action<Type, Payload> = { type: Type; payload: Payload }

type ValueAction<Template> = Action<
    'VALUE',
    { key: keyof Template; value: Template[keyof Template] | undefined }
>

type ErrorAction<Template> = Action<
    'ERROR',
    { key: keyof Template; error: Error }
>

type BaseActions<Template> = ValueAction<Template> | ErrorAction<Template>

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
                draft.values[strKey] = error
            })
        default:
            return { ...state }
    }
}

export const useFormFactory = <Template extends object>(params: {
    seedValues: Template
}) => {
    type KeyType = keyof Template
    type ValueType = Template[keyof Template] | undefined

    const { seedValues } = params
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

    type InputType = ValueType | Event

    const setValue = (key: KeyType, data: InputType): void => {
        let inputValue: ValueType = undefined
        if (data && data['target']) inputValue = data['target']['value']
        else inputValue = data as ValueType
        dispatch({ type: 'VALUE', payload: { key, value: inputValue } })
    }

    const actionFns = (key: KeyType) => {
        const templateKey = key as KeyType
        return {
            value: (): ValueType | undefined => state.values[templateKey],
            onChange: (data: InputType) => setValue(templateKey, data),
            error: () => state.errors[templateKey],
            validate: () => {},
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
    }
}
