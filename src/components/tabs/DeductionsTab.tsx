import { Card, H3, FormGroup } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import type { UserInputStore } from '../../stores/UserInputStore'

const DeductionsTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <H3>Income Deductions</H3>
      <div>
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FormGroup label={<strong>HSA Contribution</strong>} style={{ minWidth: '200px' }}>
              <NumberInput value={store.hsaContribution} changeFunction={store.setHsaContribution.bind(store)} />
            </FormGroup>
            <FormGroup label={<strong>401k Contribution</strong>} style={{ minWidth: '200px' }}>
              <NumberInput value={store._401kContribution} changeFunction={store.set401kContribution.bind(store)} />
            </FormGroup>
            <FormGroup label={<strong>403b Contribution</strong>} style={{ minWidth: '200px' }}>
              <NumberInput value={store._403bContribution} changeFunction={store.set403bContribution.bind(store)} />
            </FormGroup>
          </div>
        </Card>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <FormGroup label={<strong>Total Deductions</strong>} style={{ minWidth: '200px' }}>
            <div className="bp4-input-group">
                <NumericFormat 
                    className="bp4-input"
                    value={Math.round(store.totalDeductions)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                />
            </div>
          </FormGroup>
        </Card>
      </div>
    </>
  )
})

export default DeductionsTab