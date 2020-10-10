import React from 'react'
import styled, { css } from 'styled-components'
import { DbStatus } from '../../clients/schemas/project'
import { mixins } from '../../styles/mixins'
import { color } from '../../styles/color'

interface StatusBadgeProps {
    statusCode: DbStatus
    className?: string
}

export const getStatusLabel = (statusCode: DbStatus): string => {
    switch (statusCode) {
        case 'APPROVED':
            return 'Approved'
        case 'OPEN':
            return 'Open'
        case 'VOTING':
            return 'Voting'
        case 'ARCHIVED':
            return 'Archived'
        case 'COMPLETE':
            return 'Complete'
        case 'IN_PROGRESS':
            return 'In Progress'
        default:
            return ''
    }
}

export const Status = (props: StatusBadgeProps): JSX.Element => {
    const { statusCode, className } = props
    return (
        <Container statusCode={statusCode} className={className}>
            {getStatusLabel(statusCode)}
        </Container>
    )
}

const Container = styled.div<{ statusCode: DbStatus }>`
    ${mixins.text('sub')}
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    border-radius: 15px;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 0.5px;
    user-select: none;
    ${(p) => {
        switch (p.statusCode) {
            case 'OPEN':
                return css`
                    color: #377bb5;
                `
            case 'APPROVED':
                return css`
                    color: ${color.status.success};
                `
            case 'ARCHIVED':
            case 'COMPLETE':
                return css`
                    color: ${color.status.passive};
                `
            case 'VOTING':
                return css`
                    color: #d75453;
                `
            case 'IN_PROGRESS':
                return css`
                    color: #efac57;
                `
            default:
                return null
        }
    }}
`
