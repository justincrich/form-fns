import styled from 'styled-components'
import { color } from '../../styles/color'
import { mixins } from '../../styles/mixins/index'
import { button } from '../../styles/mixins/button'

interface ButtonProps {
    disabled?: boolean
    onClick: () => void
    children: any
}

export const Button = styled.button<ButtonProps>`
  ${(p) => button(p.disabled)}
  ${mixins.text('paragraph', 'inverted')}
  padding: ${mixins.spacing[1]};
  background-color: ${(p) =>
      p.disabled ? color.brand.muted : color.brand.primary};
  font-weight: bold;
  width: 100%;
  outline: none;
  
`
