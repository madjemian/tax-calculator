import { Form, FormGroup, Header, Segment, SegmentGroup, Button, Input } from 'semantic-ui-react'
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
          {store.w2Income.map((w2) => (
            <Segment key={w2.id}>
              <FormGroup>
                <Form.Field width={4}>
                  <label>Name</label>
                  <Input 
                    value={w2.name} 
                    onChange={(e) => store.updateW2Income(w2.id, { name: e.target.value })}
                  />
                </Form.Field>
                <Form.Field width={4}>
                  <label>Income</label>
                  <NumberInput 
                    value={w2.income} 
                    changeFunction={(value) => store.updateW2Income(w2.id, { income: value })} 
                  />
                </Form.Field>
                <Form.Field width={4}>
                  <label>Withholding</label>
                  <NumberInput 
                    value={w2.withholding} 
                    changeFunction={(value) => store.updateW2Income(w2.id, { withholding: value })} 
                  />
                </Form.Field>
                <Form.Field width={4}>
                  <label>&nbsp;</label>
                  <Button 
                    color='red' 
                    icon='trash' 
                    onClick={() => store.removeW2Income(w2.id)}
                    disabled={store.w2Income.length <= 1}
                  />
                </Form.Field>
              </FormGroup>
            </Segment>
          ))}
          
          <Segment>
            <Button 
              color='green' 
              icon='plus' 
              content='Add W2' 
              onClick={() => store.addW2Income()}
            />
          </Segment>

          <Segment>
            <Header as='h3' content='Option Exercise Batches' />
          </Segment>

          {store.optionExercises.map((option) => (
            <Segment key={option.id}>
              <FormGroup>
                <Form.Field width={4}>
                  <label>Date</label>
                  <Input 
                    type='date'
                    value={option.date} 
                    onChange={(e) => store.updateOptionExercise(option.id, { date: e.target.value })}
                  />
                </Form.Field>
                <Form.Field width={4}>
                  <label>Amount</label>
                  <NumberInput 
                    value={option.amount} 
                    changeFunction={(value) => store.updateOptionExercise(option.id, { amount: value })} 
                  />
                </Form.Field>
                <Form.Field width={4}>
                  <label>Withholding</label>
                  <NumberInput 
                    value={option.withholding} 
                    changeFunction={(value) => store.updateOptionExercise(option.id, { withholding: value })} 
                  />
                </Form.Field>
                <Form.Field width={4}>
                  <label>&nbsp;</label>
                  <Button 
                    color='red' 
                    icon='trash' 
                    onClick={() => store.removeOptionExercise(option.id)}
                  />
                </Form.Field>
              </FormGroup>
            </Segment>
          ))}

          <Segment>
            <Button 
              color='green' 
              icon='plus' 
              content='Add Option Exercise' 
              onClick={() => store.addOptionExercise()}
            />
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