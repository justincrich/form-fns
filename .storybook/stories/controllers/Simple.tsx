import React from 'react'
import styled from 'styled-components'
import { useFormFactory } from '../../../src/useFormFactory';

export const Simple = () => {
  const {inputs} = useFormFactory<{
    name: string
  }>({
    seedValues: {
      name: ''
    }
  })

  return (
    <Container>
     <h1>Form</h1>
     <Input placeholder="Name" onChange={inputs.name.onChange} value={inputs.name.value()}/>
    </Container>
  )
}


const Container = styled.div`
  background-color: #ffffff;
  min-width: 500px;
  min-height: 500px;
  display: flex;
  flex-flow: column nowrap;
`

const Input = styled.input`
  margin-bottom: 10px;
`