import { Container, Header, List } from 'semantic-ui-react'
import { form1040StoreContext } from '../stores/stores'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { NumericFormat } from 'react-number-format'


const CalculatedValues = observer(() => {
  const form1040Store = useContext(form1040StoreContext)

  console.log('Calculated total 1040 tax:', form1040Store.tax)
  console.log('Calculated total payments:', form1040Store.payments)
  console.log('Calculated refund:', form1040Store.refund)
  console.log('Calculated amount owed:', form1040Store.owed)
  return (
    <Container style={{ marginTop: '2em' }}>
    <Header as='h2' content='Calculated Taxes'/>
    <List divided>
      <List.Item>
        <List.Content>
          <List.Header>Total Income</List.Header>
          <NumericFormat value={form1040Store.totalIncome} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Total Tax</List.Header>
          <NumericFormat value={form1040Store.tax} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Tax Payments</List.Header>
          <NumericFormat value={form1040Store.payments} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          { form1040Store.refund > 0 ? (
            <>
              <List.Header>Tax Refund</List.Header>
              <NumericFormat value={form1040Store.refund} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }}/>
            </>) : (
            <>
              <List.Header>Amount Owed</List.Header>
              <NumericFormat value={form1040Store.owed} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'red' }}/>
            </>) }
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Effective Tax Rate</List.Header>
          <NumericFormat value={Math.round(form1040Store.effectiveTaxRate * 1000) / 10} displayType={'text'} thousandSeparator={true} suffix={'%'} />
        </List.Content>
      </List.Item>
    </List>
    </Container>
  )
})

export default CalculatedValues