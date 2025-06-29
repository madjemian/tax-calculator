import { NumericFormat } from 'react-number-format'
import { Input } from 'semantic-ui-react'

const NumberInput = (props: {value: number, changeFunction?: (value: number) => void}) => {

  return (
    <NumericFormat
      fluid
      thousandSeparator
      customInput={Input}
      value={props.value}
      onValueChange={(e: { value: string }) => props.changeFunction && props.changeFunction(parseFloat(e.value))}
    />
  )
}

export default NumberInput