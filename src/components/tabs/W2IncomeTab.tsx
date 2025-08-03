import { Card, H2, H3, FormGroup, Button, InputGroup } from '@blueprintjs/core'
import { Trash, Plus } from '@blueprintjs/icons'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const W2IncomeTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <H2>W2 Income</H2>
      <div>
        {store.w2Income.map((w2) => (
          <Card key={w2.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'end' }}>
              <FormGroup label="Name" style={{ minWidth: '200px' }}>
                <InputGroup 
                  value={w2.name} 
                  onChange={(e) => store.updateW2Income(w2.id, { name: e.target.value })}
                />
              </FormGroup>
              <FormGroup label="Income" style={{ minWidth: '200px' }}>
                <NumberInput 
                  value={w2.income} 
                  changeFunction={(value) => store.updateW2Income(w2.id, { income: value })} 
                />
              </FormGroup>
              <FormGroup label="Withholding" style={{ minWidth: '200px' }}>
                <NumberInput 
                  value={w2.withholding} 
                  changeFunction={(value) => store.updateW2Income(w2.id, { withholding: value })} 
                />
              </FormGroup>
              <div>
                <Button 
                  intent="danger"
                  icon={<Trash />}
                  onClick={() => store.removeW2Income(w2.id)}
                  disabled={store.w2Income.length <= 1}
                />
              </div>
            </div>
          </Card>
        ))}
        
        <Card style={{ marginBottom: '16px' }}>
          <Button 
            intent="success"
            icon={<Plus />}
            text="Add W2"
            onClick={() => store.addW2Income()}
          />
        </Card>

        <H3>Option Exercise Batches</H3>

        {store.optionExercises.map((option) => (
          <Card key={option.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'end' }}>
              <FormGroup label="Date" style={{ minWidth: '200px' }}>
                <InputGroup 
                  type='date'
                  value={option.date} 
                  onChange={(e) => store.updateOptionExercise(option.id, { date: e.target.value })}
                />
              </FormGroup>
              <FormGroup label="Amount" style={{ minWidth: '200px' }}>
                <NumberInput 
                  value={option.amount} 
                  changeFunction={(value) => store.updateOptionExercise(option.id, { amount: value })} 
                />
              </FormGroup>
              <FormGroup label="Withholding" style={{ minWidth: '200px' }}>
                <NumberInput 
                  value={option.withholding} 
                  changeFunction={(value) => store.updateOptionExercise(option.id, { withholding: value })} 
                />
              </FormGroup>
              <div>
                <Button 
                  intent="danger"
                  icon={<Trash />}
                  onClick={() => store.removeOptionExercise(option.id)}
                />
              </div>
            </div>
          </Card>
        ))}

        <Card style={{ marginBottom: '16px' }}>
          <Button 
            intent="success"
            icon={<Plus />}
            text="Add Option Exercise"
            onClick={() => store.addOptionExercise()}
          />
        </Card>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <FormGroup label="Total W2 Income" style={{ minWidth: '200px' }}>
            <NumberInput value={Math.round(store.totalW2Income)} />
          </FormGroup>
        </Card>
      </div>
    </>
  )
})

export default W2IncomeTab