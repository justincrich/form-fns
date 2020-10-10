import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useSpring, animated, useChain } from 'react-spring'
import { Icon } from '../Icon/index'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'
import { Tooltip } from '../Tooltip/index'
import { transformColorOpacity } from '../../util/color'
import { AppTheme } from '../../styles/theme'

interface MenuButtonProps {
    className?: string
    onRemove: () => void
}
export const MenuButton = (props: MenuButtonProps): JSX.Element => {
    const { className, onRemove } = props
    const [isVisible, setVisible] = useState(false)

    const containerRef = useRef<any>()
    const { borderOpacity } = useSpring({
        from: { borderOpacity: 0 },
        to: { borderOpacity: isVisible ? 100 : 0 },
        ref: containerRef,
        config: {
            duration: 50,
        },
    })

    const menuRef = useRef<any>()
    const { width, buttonOpacity } = useSpring({
        from: {
            buttonOpacity: 0,
            width: 0,
        },
        to: async (next) => {
            await next({ width: isVisible ? 30 : 0, buttonOpacity: 0 })
            await next({
                width: isVisible ? 30 : 0,
                buttonOpacity: isVisible ? 1 : 0,
            })
        },
        ref: menuRef,
        config: {
            duration: 100,
        },
    })
    useChain(isVisible ? [containerRef, menuRef] : [menuRef, containerRef])

    return (
        <Container
            style={{
                border: borderOpacity.interpolate(
                    (o) => `1px solid rgba(224,231,255, ${o / 100})`
                ),
            }}
            isOpen={isVisible}
            className={className}
        >
            <MenuBody
                style={{
                    width,
                }}
            >
                <animated.div style={{ opacity: buttonOpacity }}>
                    <TrashButton title="Delete" onClick={() => onRemove()} />
                </animated.div>
            </MenuBody>
            <Button
                iconName={isVisible ? 'FaTimes' : 'FaEllipsisH'}
                title={
                    !isVisible
                        ? 'Open Project Options'
                        : 'Close Project Options'
                }
                onClick={() => {
                    setVisible(!isVisible)
                }}
            />
        </Container>
    )
}

type ContainerProps = { isOpen: boolean; theme: AppTheme }
const Container = styled(animated.div)`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    height: 48px;
    border: 1px solid
        ${(p: ContainerProps) =>
            p.isOpen ? color.border.primary(p) : 'transparent'};
    border-radius: 5px;
    padding: ${mixins.spacing[2]};
`

const Button = styled(Icon)`
    cursor: pointer;
`

const TrashButton = styled(Icon).attrs({
    iconName: 'FaTrashAlt',
})`
    cursor: pointer;
    & svg {
        fill: ${color.status.error};
    }
`

const MenuBody = styled(animated.div)`
    outline: 0;
    margin-right: ${mixins.spacing[2]};
`
