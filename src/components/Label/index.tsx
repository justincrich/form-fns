import styled from 'styled-components'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'

export const Label = styled.div<{ hasError?: boolean }>`
    ${mixins.text('label', 'muted')}
    text-transform: uppercase;
    letter-spacing: 1.125px;
    color: ${(p) => (p.hasError ? color.status.error : color.input.label)};
    user-select: none;
`
