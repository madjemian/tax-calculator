import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { InputGroup } from '@blueprintjs/core'

const NumberInput = (props: {value: number, changeFunction?: (value: number) => void}) => {
  // keep a local state for the input value as a number
  const [inputValue, setInputValue] = useState<number>(props.value)

  return (
    <NumericFormat
      thousandSeparator
      customInput={InputGroup}
      value={inputValue}
      onValueChange={(e) => setInputValue(parseFloat(e.value))}
      onBlur={() => {
        // TODO: keep track of changes so we can implement undo/redo
        // can potentially implement by pushing a thunk into a stack on every change
        // if the input value is not a number, reset it to 0
        let finalValue = inputValue
        if (isNaN(finalValue)) {
          finalValue = 0
          setInputValue(0)
        }
        return props.changeFunction && props.changeFunction(finalValue)
      }}
    />
  )
}

export default NumberInput