import { Card, H2, FormGroup } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const DeductionsTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <H2>Income Deductions</H2>
      <div>
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FormGroup label="HSA Contribution" style={{ minWidth: '200px' }}>
              <NumberInput value={store.hsaContribution} changeFunction={store.setHsaContribution.bind(store)} />
            </FormGroup>
            <FormGroup label="401k Contribution" style={{ minWidth: '200px' }}>
              <NumberInput value={store._401kContribution} changeFunction={store.set401kContribution.bind(store)} />
            </FormGroup>
            <FormGroup label="403b Contribution" style={{ minWidth: '200px' }}>
              <NumberInput value={store._403bContribution} changeFunction={store.set403bContribution.bind(store)} />
            </FormGroup>
          </div>
        </Card>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <FormGroup label="Total Deductions" style={{ minWidth: '200px' }}>
            <NumberInput value={Math.round(store.totalDeductions)} />
          </FormGroup>
        </Card>
      </div>
    </>
  )
})

export default DeductionsTab