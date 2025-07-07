import { Container, Header, List } from 'semantic-ui-react'
import { appStoreContext } from '../stores/stores'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { NumericFormat } from 'react-number-format'


const CalculatedValues = observer(() => {
  const appStore = useContext(appStoreContext)

  console.log('Calculated total 1040 tax:', appStore.tax)
  console.log('Calculated total payments:', appStore.payments)
  console.log('Calculated refund:', appStore.refund)
  console.log('Calculated amount owed:', appStore.owed)
  return (
    <Container style={{ marginTop: '2em' }}>
    <Header as='h2' content='Calculated Taxes'/>
    <List divided>
      <List.Item>
        <List.Content>
          <List.Header>Total Income</List.Header>
          <NumericFormat value={appStore.totalIncome} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Total Tax</List.Header>
          <NumericFormat value={appStore.tax} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Tax Payments</List.Header>
          <NumericFormat value={appStore.payments} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          { appStore.refund > 0 ? (
            <>
              <List.Header>Tax Refund</List.Header>
              <NumericFormat value={appStore.refund} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }}/>
            </>) : (
            <>
              <List.Header>Amount Owed</List.Header>
              <NumericFormat value={appStore.owed} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'red' }}/>
            </>) }
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Header>Effective Tax Rate</List.Header>
          <NumericFormat value={Math.round(appStore.effectiveTaxRate * 1000) / 10} displayType={'text'} thousandSeparator={true} suffix={'%'} />
        </List.Content>
      </List.Item>
    </List>
    </Container>
  )
})

export default CalculatedValues