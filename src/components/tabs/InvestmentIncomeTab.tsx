import { Form, FormGroup, Header, Segment, SegmentGroup } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const InvestmentIncomeTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <Header as='h2' content='Investment Income' />
      <Form widths='equal'>
        <SegmentGroup>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>Tax Free Interest</label>
                <NumberInput value={store.taxFreeInterest} changeFunction={store.setTaxFreeInterest.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Taxable Interest</label>
                <NumberInput value={store.taxableInterest} changeFunction={store.setTaxableInterest.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Total Dividends (Ordinary)</label>
                <NumberInput value={store.totalDividends} changeFunction={store.setTotalDividends.bind(store)} />
              </Form.Field>
            </FormGroup>
            <FormGroup>
              <Form.Field>
                <label>Qualified Dividends</label>
                <NumberInput value={store.qualifiedDividends} changeFunction={store.setQualifiedDividends.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Long Term Capital Gains</label>
                <NumberInput value={store.longTermCapitalGains} changeFunction={store.setLongTermCapitalGains.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>Short Term Capital Gains</label>
                <NumberInput value={store.shortTermCapitalGains} changeFunction={store.setShortTermCapitalGains.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
        </SegmentGroup>
      </Form>
    </>
  )
})

export default InvestmentIncomeTab