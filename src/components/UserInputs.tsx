import { Container, Form, FormGroup, Header, Segment, SegmentGroup } from 'semantic-ui-react'
import { userInputStoreContext } from '../stores/stores'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import NumberInput from './NumberInput'
import type { UserInputStore } from '../stores/UserInputStore'

const EarnedIncome = observer((props:{store: UserInputStore}) => {
  const { store } = props
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h2' content='W2 Income'/>
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
    </Container>
  )
})

const IncomeDeductions = observer((props:{store: UserInputStore}) => {
  const { store } = props
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h2' content='Income Deductions'/>
      <Form widths='equal'>
        <SegmentGroup>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>HSA Contribution</label>
                <NumberInput value={store.hsaContribution} changeFunction={store.setHsaContribution.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>401k Contribution</label>
                <NumberInput value={store._401kContribution} changeFunction={store.set401kContribution.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>403b Contribution</label>
                <NumberInput value={store._403bContribution} changeFunction={store.set403bContribution.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
          <Segment inverted color={'grey'}>
            <FormGroup>
              <Form.Field>
                <label>Total Deductions</label>
                <NumberInput value={store.totalDeductions} />
              </Form.Field>
            </FormGroup>
          </Segment>
        </SegmentGroup>
      </Form>
    </Container>
  )
})

const InvestmentIncome = observer((props:{store: UserInputStore}) => {
  const { store } = props
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h2' content='Investment Income'/>
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
    </Container>
  )
})

const TaxesPaid = observer((props:{store: UserInputStore}) => {
  const { store } = props
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h2' content='Taxes Paid'/>
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
    </Container>
  )
})

const UserInputs = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  return (
    <>
      <EarnedIncome store={userInputStore} />
      <IncomeDeductions store={userInputStore} />
      <InvestmentIncome store={userInputStore} />
      <TaxesPaid store={userInputStore} />
    </>
  )
})

export default UserInputs