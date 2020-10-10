import React from 'react'
import styled, { css } from 'styled-components'
import { Label } from '../Label'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'
import { isKeyPressEnter } from '../../util/isKeyPressEnter'

interface InputProps {
    error?: string
    disabled?: boolean
    className?: string
    value?: string
    label?: string
    placeholder?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    hasError?: boolean
    name?: string
    type?: string
    onEnterPress?: () => void
    isTextArea?: boolean
    kind?: 'textinput' | 'textarea'
}

export const Input = React.forwardRef(
    (
        props: InputProps,
        ref: React.Ref<HTMLInputElement> | React.Ref<HTMLTextAreaElement>
    ): JSX.Element => {
        const {
            value,
            onChange,
            className,
            label,
            disabled,
            error,
            placeholder,
            name,
            hasError,
            onEnterPress,
            type,
            kind = 'textinput',
            onBlur,
        } = props

        const handleKeyUp = (
            e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
        ): void => {
            if (!isKeyPressEnter(e)) return
            if (!onEnterPress) return
            onEnterPress()
        }

        const inputProps = {
            name,
            hasError: Boolean(error || hasError),
            disabled,
            value,
            placeholder,
            onKeyUp: handleKeyUp,
            type,
            onBlur,
            onChange: (e) => {
                if (!onChange) return null
                onChange(e.target.value)
                return null
            },
        }

        const taRef = ref as React.Ref<HTMLTextAreaElement>
        const inputRef = ref as React.Ref<HTMLInputElement>
        return (
            <Container className={className} disabled={Boolean(disabled)}>
                {label && (
                    <StyledLabel hasError={Boolean(error)}>{label}</StyledLabel>
                )}
                {kind === 'textarea' ? (
                    <TextAreaField {...inputProps} ref={taRef} />
                ) : (
                    <TextInputField {...inputProps} ref={inputRef} />
                )}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Container>
        )
    }
)

const Container = styled.div<{ disabled: boolean }>`
    display: flex;
    flex-flow: column nowrap;
`

const StyledLabel = styled(Label)`
    margin-bottom: ${mixins.spacing[1]};
`

type Input = { hasError?: boolean; disabled?: boolean }

const INPUT_STYLE = css<Input>`
    ${mixins.text('paragraph', 'primary')}
    width: 100%;
    border: 1px solid transparent;
    outline: none;
    padding: ${mixins.spacing[2]};
    &::placeholder {
        opacity: 0.7;
    }
    background-color: ${color.background.app};
    border: ${(p) => (p.disabled ? 0 : 1)}px solid
        ${(p) => (p.hasError ? color.status.error : color.border.primary)};
    border-radius: 5px;
    ${(p) =>
        !p.disabled &&
        css`
            &:hover {
                border: 1px solid ${color.border.primary};
            }
        `}
`

export const TextInputField = styled.input<Input>`
    ${INPUT_STYLE}
    height: 38px;
`

export const TextAreaField = styled.textarea<Input>`
    ${INPUT_STYLE}
    resize: none;
`

export const ErrorMessage = styled.div`
    margin-top: ${mixins.spacing[1]};
    ${mixins.text('sub')}
    color: ${color.status.error};
`
