import React from 'react'
import styled from 'styled-components'
import { useFormFns } from '../../../src/useFormFns';

const seedValues = {
  dogs: [
    {
      breed:'',
      age: ''
    }
  ]
}

export const ArrayForm = () => {
  const {inputs, errors} = useFormFns({
    seedValues
  })
// const minone = (value):[boolean, string] => {
//   return [Boolean(value) , 'you must have one']
// }
// const reject = (value):[boolean, string] => {
//   return [value !== 'cat', 'kats are dumb']
// }

// const dogAge = (value:string|undefined, state:{values:Partial<typeof seedValues>}):[boolean, string]|boolean => {
//   console.log('value', value, 'state', state)
//   if(state.values.species !== 'dog') return true
//   if(Number(value) > 10)
//     return [false, 'Dogs don\'t live that long!']
//   return true
// }

  return (
    <Container>
     <h1>List of dogs</h1>

    </Container>
  )
}

const Container = styled.div`
  background-color: #ffffff;
  min-width: 100px;
  min-height: 100px;
  display: flex;
  flex-flow: column nowrap;
  padding: 20px;
`

const Input = styled.input`
  margin-bottom: 10px;
`

/**
      <Input placeholder="Species" onChange={(e)=>inputs.species.onChange(e,{
       validation: [minone, reject]
     })} value={inputs.species.value()}/>
         {
      errors.species && (
        <div>
          Error {errors.species}
        </div>
      )
    }
     <Input placeholder="Age" onChange={(e)=>inputs.age.onChange(e,{
       validation:[dogAge]
     })} value={inputs.age.value()}/>
         {
      errors.age && (
        <div>
          Error {errors.age}
        </div>
      )
    }
 */