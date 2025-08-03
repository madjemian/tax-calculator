import { H3 } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { userInputStoreContext } from '../stores/stores'
import { NumericFormat } from 'react-number-format'

const InputSummary = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  return (
    <div style={{ marginTop: '2em', padding: '16px' }}>
      <H3>Input Summary</H3>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>W2 Income</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalW2Income)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Investment Income</strong>
          <div>
            <NumericFormat value={Math.round(
              userInputStore.taxFreeInterest + 
              userInputStore.taxableInterest + 
              userInputStore.totalDividends + 
              userInputStore.longTermCapitalGains + 
              userInputStore.shortTermCapitalGains
            )} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Deductions</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalDeductions)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Taxes Paid</strong>
          <div>
            <NumericFormat value={Math.round(
              userInputStore.totalWithholding + 
              userInputStore.totalEstimatedTaxPaid
            )} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Total Real Income</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalRealIncome)} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default InputSummary