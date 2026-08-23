import { Card, H3, FormGroup, HTMLTable } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import type { UserInputStore } from '../../stores/UserInputStore'

const TaxesPaidTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <H3>Estimated Taxes</H3>
      
      <div>
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
            <FormGroup label={<strong>Q1</strong>} style={{ flex: '1' }}>
              <NumberInput value={store.taxPaidQ1} changeFunction={store.setTaxPaidQ1.bind(store)} />
            </FormGroup>
            <FormGroup label={<strong>Q2</strong>} style={{ flex: '1' }}>
              <NumberInput value={store.taxPaidQ2} changeFunction={store.setTaxPaidQ2.bind(store)} />
            </FormGroup>
            <FormGroup label={<strong>Q3</strong>} style={{ flex: '1' }}>
              <NumberInput value={store.taxPaidQ3} changeFunction={store.setTaxPaidQ3.bind(store)} />
            </FormGroup>
            <FormGroup label={<strong>Q4</strong>} style={{ flex: '1' }}>
              <NumberInput value={store.taxPaidQ4} changeFunction={store.setTaxPaidQ4.bind(store)} />
            </FormGroup>
          </div>
        </Card>
        
        <Card style={{ marginBottom: '16px' }}>
          <FormGroup label={<strong>Foreign Tax Credit</strong>} style={{ minWidth: '200px' }}>
            <NumberInput value={store.foreignTaxCredit} changeFunction={store.setForeignTaxCredit.bind(store)} />
          </FormGroup>
        </Card>

        <H3>Withholding Summary</H3>
        <Card style={{ marginBottom: '16px' }}>
          <HTMLTable compact style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%' }}><strong>W2 Withholding</strong></td>
                <td style={{ width: '50%' }}>
                  <NumericFormat 
                    value={Math.round(store.totalW2Withholding)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'}
                    style={{ fontSize: '1.1em', fontWeight: 'bold' }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}><strong>Option Exercise Withholding</strong></td>
                <td style={{ width: '50%' }}>
                  <NumericFormat 
                    value={Math.round(store.totalOptionWithholding)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    style={{ fontSize: '1.1em', fontWeight: 'bold' }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}><strong>Roth Conversion Withholding</strong></td>
                <td style={{ width: '50%' }}>
                  <NumericFormat 
                    value={Math.round(store.totalRothConversionWithholding)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    style={{ fontSize: '1.1em', fontWeight: 'bold' }}
                  />
                </td>
              </tr>
            </tbody>
          </HTMLTable>
        </Card>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FormGroup label={<strong>Total Withholding</strong>} style={{ minWidth: '200px' }}>
              <div className="bp4-input-group">
                <NumericFormat 
                  className="bp4-input"
                  value={Math.round(store.totalWithholding)} 
                  displayType={'text'} 
                  thousandSeparator={true} 
                  prefix={'$'} 
                  style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                />
              </div>
            </FormGroup>
            <FormGroup label={<strong>Total Estimated Tax Paid</strong>} style={{ minWidth: '200px' }}>
              <div className="bp4-input-group">
                <NumericFormat 
                  className="bp4-input"
                  value={Math.round(store.totalEstimatedTaxPaid)} 
                  displayType={'text'} 
                  thousandSeparator={true} 
                  prefix={'$'} 
                  style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                />
              </div>
            </FormGroup>
            <FormGroup label={<strong>Total Tax Credit</strong>} style={{ minWidth: '200px' }}>
              <div className="bp4-input-group">
                <NumericFormat 
                  className="bp4-input"
                  value={Math.round(store.totalTaxCredit)} 
                  displayType={'text'} 
                  thousandSeparator={true} 
                  prefix={'$'} 
                  style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                />
              </div>
            </FormGroup>
          </div>
        </Card>
      </div>
    </>
  )
})

export default TaxesPaidTab