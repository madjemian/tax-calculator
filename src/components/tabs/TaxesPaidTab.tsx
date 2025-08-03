import { Card, H2, H3, FormGroup } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import type { UserInputStore } from '../../stores/UserInputStore'

const TaxesPaidTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <H2>Taxes Paid</H2>
      
      <H3>Withholding Summary</H3>
      <Card style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>W2 Withholding</strong>
            <div>
              <NumericFormat value={Math.round(store.totalW2Withholding)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
          </div>
          <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>Option Exercise Withholding</strong>
            <div>
              <NumericFormat value={Math.round(store.totalOptionWithholding)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
          </div>
        </div>
      </Card>

      <div>
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FormGroup label="Estimated Taxes Q1" style={{ minWidth: '200px' }}>
              <NumberInput value={store.taxPaidQ1} changeFunction={store.setTaxPaidQ1.bind(store)} />
            </FormGroup>
            <FormGroup label="Estimated Taxes Q2" style={{ minWidth: '200px' }}>
              <NumberInput value={store.taxPaidQ2} changeFunction={store.setTaxPaidQ2.bind(store)} />
            </FormGroup>
            <FormGroup label="Estimated Taxes Q3" style={{ minWidth: '200px' }}>
              <NumberInput value={store.taxPaidQ3} changeFunction={store.setTaxPaidQ3.bind(store)} />
            </FormGroup>
            <FormGroup label="Estimated Taxes Q4" style={{ minWidth: '200px' }}>
              <NumberInput value={store.taxPaidQ4} changeFunction={store.setTaxPaidQ4.bind(store)} />
            </FormGroup>
          </div>
        </Card>
        
        <Card style={{ marginBottom: '16px' }}>
          <FormGroup label="Foreign Tax Credit" style={{ minWidth: '200px' }}>
            <NumberInput value={store.foreignTaxCredit} changeFunction={store.setForeignTaxCredit.bind(store)} />
          </FormGroup>
        </Card>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FormGroup label="Total Withholding" style={{ minWidth: '200px' }}>
              <NumberInput value={Math.round(store.totalWithholding)} />
            </FormGroup>
            <FormGroup label="Total Estimated Tax Paid" style={{ minWidth: '200px' }}>
              <NumberInput value={Math.round(store.totalEstimatedTaxPaid)} />
            </FormGroup>
            <FormGroup label="Total Tax Credit" style={{ minWidth: '200px' }}>
              <NumberInput value={Math.round(store.totalTaxCredit)} />
            </FormGroup>
          </div>
        </Card>
      </div>
    </>
  )
})

export default TaxesPaidTab