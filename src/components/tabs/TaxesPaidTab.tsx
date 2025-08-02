import { Form, FormGroup, Header, Segment, SegmentGroup, List } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import type { UserInputStore } from '../../stores/UserInputStore'

const TaxesPaidTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <Header as='h2' content='Taxes Paid' />
      
      <Header as='h3' content='Withholding Summary' />
      <Segment>
        <List divided>
          <List.Item>
            <List.Content>
              <List.Header>W2 Withholding</List.Header>
              <NumericFormat value={Math.round(store.totalW2Withholding)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Header>Option Exercise Withholding</List.Header>
              <NumericFormat value={Math.round(store.totalOptionWithholding)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </List.Content>
          </List.Item>
        </List>
      </Segment>

      <Form widths='equal'>
        <SegmentGroup>
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