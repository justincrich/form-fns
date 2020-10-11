import React from 'react'
import styled from 'styled-components'

export const ComponentShowcase = (storyFn): JSX.Element => (
    <Showcase>{storyFn()}</Showcase>
)

const Showcase = styled.div`
    background-size: 20px 20px;
    background-image: linear-gradient(to right, #f4f6fa 1px, transparent 1px),
      linear-gradient(to bottom, #f4f6fa 1px, transparent 1px);
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
`
