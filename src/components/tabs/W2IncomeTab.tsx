import { Form, FormGroup, Header, Segment, SegmentGroup } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const W2IncomeTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <Header as='h2' content='W2 Income' />
      <Form widths='equal'>
        <SegmentGroup>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>Matt Salary</label>
                <NumberInput value={store.salary1} changeFunction={store.setSalary1.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Megan Salary</label>
                <NumberInput value={store.salary2} changeFunction={store.setSalary2.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Option Exercise</label>
                <NumberInput value={store.optionExercise} changeFunction={store.setOptionExercise.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
          <Segment inverted color={'grey'}>
            <FormGroup>
              <Form.Field>
                <label>Total W2 Income</label>
                <NumberInput value={store.totalW2Income} />
              </Form.Field>
            </FormGroup>
          </Segment>
        </SegmentGroup>
      </Form>
    </>
  )
})

export default W2IncomeTab