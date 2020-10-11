import React from 'react'
import styled from 'styled-components'
import { useFormFns } from '../../../src/useFormFns';

export const Simple = () => {
  const {inputs, errors} = useFormFns({
    seedValues: {
      name: ''
    },

  })
const minone = (value):[boolean, string] => {
  return [Boolean(value) , 'you must have one']
}
const reject = (value):[boolean, string] => {
  return [value !== 'cat', 'kats are dumb']
}

  return (
    <Container>
     <h1>Form</h1>
     <Input placeholder="Name" onChange={(e)=>inputs.name.onChange(e,{
       validation: [minone, reject]
     })} value={inputs.name.value()}/>
    {
      errors.name && (
        <div>
          Error {errors.name}
        </div>
      )
    }
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