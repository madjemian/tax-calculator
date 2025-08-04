import { Card, H3, FormGroup, Button, InputGroup } from '@blueprintjs/core'
import { Trash, Plus } from '@blueprintjs/icons'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const W2IncomeTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <H3>W2 Income</H3>
      <div>
        {store.w2Income.map((w2) => (
          <Card key={w2.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <FormGroup label={<strong>Name</strong>} style={{ flex: '1', maxWidth: '120px' }}>
                  <InputGroup 
                    value={w2.name} 
                    onChange={(e) => store.updateW2Income(w2.id, { name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup label={<strong>Income</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={w2.income} 
                    changeFunction={(value) => store.updateW2Income(w2.id, { income: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>Withholding</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={w2.withholding} 
                    changeFunction={(value) => store.updateW2Income(w2.id, { withholding: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>Days in CA</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={w2.daysInCA ?? 0} 
                    changeFunction={(value) => store.updateW2Income(w2.id, { daysInCA: value })} 
                  />
                </FormGroup>
              </div>
              <FormGroup label={<span style={{ visibility: 'hidden' }}>.</span>}>
                <Button 
                  intent="danger"
                  icon={<Trash />}
                  onClick={() => store.removeW2Income(w2.id)}
                  disabled={store.w2Income.length <= 1}
                />
              </FormGroup>
            </div>
          </Card>
        ))}
        
        <div style={{ marginBottom: '16px' }}>
          <Button 
            intent="success"
            icon={<Plus />}
            text="Add W2"
            onClick={() => store.addW2Income()}
          />
        </div>

        <H3>Option Exercise Batches</H3>

        {store.optionExercises.map((option) => (
          <Card key={option.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <FormGroup label={<strong>Date</strong>} style={{ flex: '1', maxWidth: '110px' }}>
                  <InputGroup 
                    type='date'
                    value={option.date} 
                    onChange={(e) => store.updateOptionExercise(option.id, { date: e.target.value })}
                  />
                </FormGroup>
                <FormGroup label={<strong>Amount</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={option.amount} 
                    changeFunction={(value) => store.updateOptionExercise(option.id, { amount: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>Withholding</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={option.withholding} 
                    changeFunction={(value) => store.updateOptionExercise(option.id, { withholding: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>CA Taxable %</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={option.caTaxablePercent ?? 0} 
                    changeFunction={(value) => store.updateOptionExercise(option.id, { caTaxablePercent: value })} 
                  />
                </FormGroup>
              </div>
              <FormGroup label={<span style={{ visibility: 'hidden' }}>.</span>}>
                <Button 
                  intent="danger"
                  icon={<Trash />}
                  onClick={() => store.removeOptionExercise(option.id)}
                />
              </FormGroup>
            </div>
          </Card>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <Button 
            intent="success"
            icon={<Plus />}
            text="Add Option Exercise"
            onClick={() => store.addOptionExercise()}
          />
        </div>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <FormGroup label={<strong>Total W2 Income</strong>} style={{ minWidth: '200px' }}>
            <NumberInput value={Math.round(store.totalW2Income)} />
          </FormGroup>
        </Card>
      </div>
    </>
  )
})

export default W2IncomeTab