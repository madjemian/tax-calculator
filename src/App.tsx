import { Container, Form, FormGroup, Header, Input } from 'semantic-ui-react'
import { userInputStoreContext } from './stores/stores'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { NumericFormat } from 'react-number-format'


const App = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  const numberInput = (value: number, changeFunction: (value: number) => void) => {
    return (
      <NumericFormat value={value} customInput={Input} thousandSeparator onValueChange={(e) => changeFunction(parseFloat(e.value))} />
    )
  }

  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h1' content='Tax Calculator' textAlign='center' />
      <Container>
        <Header as='h2' content='Earned Income'/>
        <Form>
          <FormGroup>
            <Form.Field>
              <label>Matt Salary</label>
              {numberInput(userInputStore.salary1, userInputStore.setSalary1.bind(userInputStore))}
            </Form.Field>
            <Form.Field>
              <label>Megan Salary</label>
              {numberInput(userInputStore.salary2, userInputStore.setSalary2.bind(userInputStore))}
            </Form.Field>
          </FormGroup>
        </Form>
      </Container>
      <Container>
        <Header as='h2' content='Income Deductions'/>
        <Form>
          <FormGroup>
            <Form.Field>
              <label>HSA Contribution</label>
              {numberInput(userInputStore.hsaContribution, userInputStore.setHsaContribution.bind(userInputStore))}
            </Form.Field>
            <Form.Field>
              <label>401k Contribution</label>
              {numberInput(userInputStore._401kContribution, userInputStore.set401kContribution.bind(userInputStore))}
            </Form.Field>
            <Form.Field>
              <label>403b Contribution</label>
              {numberInput(userInputStore._403bContribution, userInputStore.set403bContribution.bind(userInputStore))}
            </Form.Field>
          </FormGroup>
        </Form>
      </Container>
    </Container>
  )
})

export default App
