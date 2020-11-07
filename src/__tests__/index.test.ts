import { renderHook, act } from '@testing-library/react-hooks'
import { useFormFns } from '../useFormFns'

describe('Standard input tests', () => {
    const initialValues = {
        name: 'Han',
        email: 'han@rebellion.com',
        phone: '+19995555555',
    }

    test('Initializes correctly', () => {
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
            })
        )
        expect(result.current.values.name).toEqual(initialValues.name)
        expect(result.current.values.email).toEqual(initialValues.email)
        expect(result.current.values.phone).toEqual(initialValues.phone)
    })

    test('Can set value', () => {
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
            })
        )
        act(() => {
            result.current.setValue('name', 'Tom')
        })
    })
    test('onChange validation with one check. First is invalid. All callback work.', () => {
        let invalidChange = ''
        let validChange = ''
        let finalChange = ''
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
            })
        )
        act(() => {
            result.current.setValue('name', 'Tom', {
                validation: () => ({
                    isValid: false,
                    message: 'invalid',
                }),
                onFinal: () => {
                    finalChange = 'final'
                },
                onValid: () => {
                    validChange = 'valid'
                },
                onInvalid: () => {
                    invalidChange = 'invalid'
                },
            })
        })
        expect(invalidChange).toBe('invalid')
        expect(validChange).toBeFalsy()
        expect(finalChange).toBe('final')
        expect(result.current.errors.name).toEqual('invalid')
    })
    test('onChange validation with two checks. Second check is invalid. All callbacks work.', () => {
        let invalidChange = ''
        let validChange = ''
        let finalChange = ''
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
            })
        )
        act(() => {
            result.current.setValue('name', 'Tom', {
                validation: [
                    () => ({
                        isValid: true,
                        message: 'first',
                    }),
                    () => ({ isValid: false, message: 'second' }),
                    () => ({ isValid: false, message: 'third' }),
                ],
                onFinal: () => {
                    finalChange = 'final'
                },
                onValid: () => {
                    validChange = 'valid'
                },
                onInvalid: () => {
                    invalidChange = 'invalid'
                },
            })
        })
        expect(invalidChange).toBe('invalid')
        expect(validChange).toBeFalsy()
        expect(finalChange).toBe('final')
        expect(result.current.errors.name).toEqual('second')
    })
    test('onChange onFinal callback works', () => {
        let invalidChange = ''
        let validChange = ''
        let finalChange = ''
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
            })
        )
        act(() => {
            result.current.setValue('name', 'Tom', {
                validation: [() => ({ isValid: true })],
                onFinal: () => {
                    finalChange = 'final'
                },
                onValid: () => {
                    validChange = 'valid'
                },
                onInvalid: () => {
                    invalidChange = 'invalid'
                },
            })
        })
        expect(invalidChange).toBeFalsy()
        expect(validChange).toBe('valid')
        expect(finalChange).toBe('final')
    })
    test('Submit validation works, 2 errors, one from change, one from submit', () => {
        let invalidChange = ''
        let validChange = ''
        let finalChange = ''
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
                validation: {
                    onSubmit: {
                        phone: () => ({ isValid: false, message: 'onSubmit' }),
                    },
                },
            })
        )
        act(() => {
            result.current.setValue('name', 'Tom', {
                validation: [() => ({ isValid: false, message: 'onChange' })],
                onFinal: () => {
                    finalChange = 'final'
                },
                onValid: () => {
                    validChange = 'valid'
                },
                onInvalid: () => {
                    invalidChange = 'invalid'
                },
            })
        })
        expect(invalidChange).toBeTruthy()
        expect(validChange).toBeFalsy()
        expect(finalChange).toBeTruthy()
        let submitResult
        act(() => {
            submitResult = result.current.submit()
        })
        expect(submitResult).toBeFalsy()
        expect(result.current.errors.phone).toEqual('onSubmit')
        expect(result.current.errors.name).toEqual('onChange')
    })
    test('Submit validation works, 2 errors, one from change, one from submit', () => {
        const invalidChange = ''
        const validChange = ''
        const finalChange = ''
        const { result } = renderHook(() =>
            useFormFns<{
                name: string
                email: string
                phone: string
            }>({
                initialValues,
            })
        )

        let submitResult
        act(() => {
            submitResult = result.current.submit()
        })
        expect(JSON.stringify(submitResult)).toEqual(
            JSON.stringify(initialValues)
        )
    })
})

describe('Array input tests', () => {})
