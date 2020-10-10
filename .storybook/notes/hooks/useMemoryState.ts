import {useState} from '@storybook/addons'

export const useMemoryState = <TVal>(value?:TVal):{
  currentValue?: TVal
  previousValue?: TVal
  onChange: (newValue?:TVal) => void
} => {
  const [current, setCurrent] = useState<TVal | undefined>(value)
  const [previous, setPrevious] = useState<TVal | undefined>(value)


  return {
    currentValue: current,
    previousValue: previous,
    onChange: (newValue) => {
      setPrevious(current)
      setCurrent(newValue)
    }
  }
}