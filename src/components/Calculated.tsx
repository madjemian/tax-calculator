import { H2 } from '@blueprintjs/core'
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
    <div style={{ marginTop: '2em', padding: '16px' }}>
      <H2>Calculated Taxes</H2>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Total Income</strong>
          <div>
            <NumericFormat value={appStore.totalIncome} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Total Tax</strong>
          <div>
            <NumericFormat value={appStore.tax} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Tax Payments</strong>
          <div>
            <NumericFormat value={appStore.payments} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          { appStore.refund > 0 ? (
            <>
              <strong>Tax Refund</strong>
              <div>
                <NumericFormat value={appStore.refund} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }}/>
              </div>
            </>) : (
            <>
              <strong>Amount Owed</strong>
              <div>
                <NumericFormat value={appStore.owed} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'red' }}/>
              </div>
            </>) }
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Effective Tax Rate</strong>
          <div>
            <NumericFormat value={Math.round(appStore.effectiveTaxRate * 1000) / 10} displayType={'text'} thousandSeparator={true} suffix={'%'} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default CalculatedValues