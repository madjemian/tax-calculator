import { H3 } from '@blueprintjs/core'
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
      <H3>Federal Tax</H3>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Total Income</strong>
          <div>
            <NumericFormat value={Math.round(appStore.totalIncome)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>AGI (Adjusted Gross Income)</strong>
          <div>
            <NumericFormat value={appStore.agi} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>MAGI (Modified AGI)</strong>
          <div>
            <NumericFormat value={appStore.magi} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
          {appStore.refund > 0 ? (
            <>
              <strong>Tax Refund</strong>
              <div>
                <NumericFormat value={appStore.refund} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }} />
              </div>
            </>) : (
            <>
              <strong>Amount Owed</strong>
              <div>
                <NumericFormat value={appStore.owed} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'red' }} />
              </div>
            </>)}
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Effective Tax Rate</strong>
          <div>
            <NumericFormat value={Math.round(appStore.effectiveTaxRate * 1000) / 10} displayType={'text'} thousandSeparator={true} suffix={'%'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Marginal Tax Bracket</strong>
          <div>
            <NumericFormat value={Math.round(appStore.marginalTaxBracket.rate * 100)} displayType={'text'} suffix={'%'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Income Room Remaining</strong>
          <div>
            {appStore.marginalTaxBracket.remaining === Infinity ? (
              'Unlimited'
            ) : (
              <NumericFormat value={Math.round(appStore.marginalTaxBracket.remaining)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '12px' }}>
          <H3>California Tax</H3>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>CA Taxable Income (Full)</strong>
          <div>
            <NumericFormat value={appStore.caTaxableIncome} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>CA Tax (on Full Income)</strong>
          <div>
            <NumericFormat value={appStore.caFullTax} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>CA Taxable Amount</strong>
          <div>
            <NumericFormat value={appStore.caTaxableAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>CA Tax Ratio</strong>
          <div>
            <NumericFormat value={Math.round(appStore.caRatio * 1000) / 10} displayType={'text'} thousandSeparator={true} suffix={'%'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>CA Tax Owed</strong>
          <div>
            <NumericFormat value={appStore.caActualTax} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'red' }} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px' }}>
          <strong>CA Effective Tax Rate</strong>
          <div>
            <NumericFormat value={Math.round((appStore.caActualTax / appStore.totalIncome) * 1000) / 10} displayType={'text'} thousandSeparator={true} suffix={'%'} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default CalculatedValues