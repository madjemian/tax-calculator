import { Form, FormGroup, Header, Segment, SegmentGroup } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const TaxesPaidTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <Header as='h2' content='Taxes Paid' />
      <Form widths='equal'>
        <SegmentGroup>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>Matt Witholding</label>
                <NumberInput value={store.withholding1} changeFunction={store.setWithholding1.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Megan Witholding</label>
                <NumberInput value={store.withholding2} changeFunction={store.setWithholding2.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Option Exercise Withholding</label>
                <NumberInput value={store.optionExerciseWithholding} changeFunction={store.setOptionExerciseWithholding.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>Estimated Taxes Q1</label>
                <NumberInput value={store.taxPaidQ1} changeFunction={store.setTaxPaidQ1.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Estimated Taxes Q2</label>
                <NumberInput value={store.taxPaidQ2} changeFunction={store.setTaxPaidQ2.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Estimated Taxes Q3</label>
                <NumberInput value={store.taxPaidQ3} changeFunction={store.setTaxPaidQ3.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Estimated Taxes Q4</label>
                <NumberInput value={store.taxPaidQ4} changeFunction={store.setTaxPaidQ4.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>Foreign Tax Credit</label>
                <NumberInput value={store.foreignTaxCredit} changeFunction={store.setForeignTaxCredit.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
          <Segment inverted color={'grey'}>
            <FormGroup>
              <Form.Field>
                <label>Total Withholding</label>
                <NumberInput value={store.totalWithholding} />
              </Form.Field>
              <Form.Field>
                <label>Total Estimated Tax Paid</label>
                <NumberInput value={store.totalEstimatedTaxPaid} />
              </Form.Field>
              <Form.Field>
                <label>Total Tax Credit</label>
                <NumberInput value={store.totalTaxCredit} />
              </Form.Field>
            </FormGroup>
          </Segment>
        </SegmentGroup>
      </Form>
    </>
  )
})

export default TaxesPaidTab