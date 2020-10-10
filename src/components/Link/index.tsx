import React from 'react'
import { Link as RRLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'
import { Icon as RawIcon, IconsProps } from '../Icon/index'
import { spacing } from '../../styles/mixins/constants'

interface LinkProps {
    children: string
    to: string
    icon?: IconsProps['iconName']
    className?: string
}
export const Link = (props: LinkProps): JSX.Element => {
    const { children, to, className, icon } = props
    return (
        <Component className={className} to={to}>
            {icon && <Icon iconName={icon} />}
            <Text>{children}</Text>
        </Component>
    )
}

export const linkStyles = css`
 ${mixins.text('paragraph')}
  color: ${color.link.primary};
  text-decoration: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`

const Component = styled(RRLink)`
    ${linkStyles}
`

const Icon = styled(RawIcon).attrs({
    color: 'activity',
})`
    margin-right: ${spacing[1]};
`

const Text = styled.span``
