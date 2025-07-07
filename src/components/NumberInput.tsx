import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Input } from 'semantic-ui-react'

const NumberInput = (props: {value: number, changeFunction?: (value: number) => void}) => {
  // keep a local state for the input value as a number
  const [inputValue, setInputValue] = useState<number>(props.value)

  return (
    <NumericFormat
      fluid
      thousandSeparator
      customInput={Input}
      value={inputValue}
      onValueChange={(e) => setInputValue(parseFloat(e.value))}
      onBlur={() => {
        // TODO: keep track of changes so we can implement undo/redo
        // can potentially implement by pushing a thunk into a stack on every change
        // if the input value is not a number, reset it to 0
        if (isNaN(inputValue)) {
          setInputValue(0)
        }
        return props.changeFunction && props.changeFunction(inputValue)
      }}
    />
  )
}

export default NumberInput