import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { Label } from '../Label'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'
import { isKeyPressEnter } from '../../util/isKeyPressEnter'
import { Icon } from '../Icon/index'

interface InputProps {
    error?: string
    disabled?: boolean
    className?: string
    value?: string
    label?: string
    placeholder?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    onFocus?: () => void
    hasError?: boolean
    name?: string
    type?: string
    onEnterPress?: () => void
    isTextArea?: boolean
    kind?: 'textinput' | 'textarea'
}

export const DisplayInput = React.forwardRef(
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
            onFocus,
        } = props

        const [focused, toggleFocused] = useState(false)

        const handleKeyUp = (
            e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
        ): void => {
            if (!isKeyPressEnter(e)) return
            if (!onEnterPress) return
            onEnterPress()
        }

        const handleFocus = (): void => {
            toggleFocused(true)
            if (onFocus) {
                onFocus()
            }
        }

        const handleBlur = (): void => {
            toggleFocused(false)
            if (onBlur) {
                onBlur()
            }
        }

        const inputProps = {
            name,
            hasError: Boolean(error || hasError),
            disabled,
            value,
            placeholder,
            className,
            onKeyUp: handleKeyUp,
            type,
            onBlur: handleBlur,
            onFocus: handleFocus,
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
                <Content
                    className="displayContent"
                    disabled={Boolean(disabled)}
                    focused={focused}
                >
                    {kind === 'textarea' ? (
                        <TextAreaField {...inputProps} ref={taRef} />
                    ) : (
                        <TextInputField {...inputProps} ref={inputRef} />
                    )}
                    <PencilIcon
                        focused={focused}
                        color={focused ? 'primary' : 'muted'}
                        isTextArea={kind === 'textarea'}
                    />
                </Content>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Container>
        )
    }
)

const Container = styled.div<{ disabled: boolean }>`
    display: flex;
    flex-flow: column nowrap;
    position: relative;
`

const StyledLabel = styled(Label)`
    margin-bottom: ${mixins.spacing[1]};
`

type Input = { hasError?: boolean; disabled?: boolean }

const PencilIcon = styled(Icon).attrs({
    iconName: 'FaPencilAlt',
})`
    display: ${(p: { focused: boolean; isTextArea: boolean }) =>
        p.focused ? 'flex' : 'none'};
    position: absolute;
    right: ${mixins.spacing[1]};
    pointer-events: none;
    ${(p: { isTextArea: boolean }) =>
        p.isTextArea &&
        `
            top: 30px;
        `}
`

const Content = styled.div<Input & { focused: boolean }>`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    border-radius: 5px;
    border: 1px solid transparent;
    padding: 0px ${mixins.spacing[3]} 0px ${mixins.spacing[1]};
    ${(p) =>
        !p.disabled &&
        css`
            &:hover {
                border: 1px solid ${color.border.primary};
            }
        `}
    ${(p) =>
        !p.disabled &&
        p.focused &&
        css`
            background-color: ${color.background.app};
            border: ${p.disabled ? 0 : 1}px solid
                ${p.hasError ? color.status.error : color.border.primary};
            border-radius: 5px;
        `}
    &:hover ${PencilIcon}{
       ${(p) =>
           !p.disabled &&
           `
         display: flex;
       `}
    }
`

const INPUT_STYLE = css<Input>`
    ${mixins.text('paragraph', 'primary')}
    background-color: transparent;
    text-overflow: ellipsis;
    width: 100%;
    height: 100%;
    border: 0;
    outline: none;
    &::placeholder {
        opacity: 0.7;
    }
    border-radius: 5px;
`

const TextInputField = styled.input<Input>`
    ${INPUT_STYLE}
`

const TextAreaField = styled.textarea<Input>`
    ${INPUT_STYLE}
    resize: none;
    flex: 1 1 auto;
`

const ErrorMessage = styled.div`
    margin-top: ${mixins.spacing[1]};
    ${mixins.text('sub')}
    color: ${color.status.error};
`
