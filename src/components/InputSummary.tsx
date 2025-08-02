import { Container, Header, List } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { userInputStoreContext } from '../stores/stores'
import { NumericFormat } from 'react-number-format'

const InputSummary = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h2' content='Input Summary' />
      <List divided>
        <List.Item>
          <List.Content>
            <List.Header>W2 Income</List.Header>
            <NumericFormat value={userInputStore.totalW2Income} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </List.Content>
        </List.Item>
        
        <List.Item>
          <List.Content>
            <List.Header>Investment Income</List.Header>
            <NumericFormat value={
              userInputStore.taxFreeInterest + 
              userInputStore.taxableInterest + 
              userInputStore.totalDividends + 
              userInputStore.longTermCapitalGains + 
              userInputStore.shortTermCapitalGains
            } displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </List.Content>
        </List.Item>
        
        <List.Item>
          <List.Content>
            <List.Header>Deductions</List.Header>
            <NumericFormat value={userInputStore.totalDeductions} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </List.Content>
        </List.Item>
        
        <List.Item>
          <List.Content>
            <List.Header>Taxes Paid</List.Header>
            <NumericFormat value={
              userInputStore.totalWithholding + 
              userInputStore.totalEstimatedTaxPaid
            } displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </List.Content>
        </List.Item>
        
        <List.Item>
          <List.Content>
            <List.Header>Total Real Income</List.Header>
            <NumericFormat value={userInputStore.totalRealIncome} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }} />
          </List.Content>
        </List.Item>
      </List>
    </Container>
  )
})

export default InputSummary