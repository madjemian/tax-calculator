import { Card, H3, FormGroup, Button, InputGroup, Divider } from '@blueprintjs/core'
import { Trash, Plus } from '@blueprintjs/icons'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import type { UserInputStore } from '../../stores/UserInputStore'

const WorkIncomeTab = observer((props: { store: UserInputStore }) => {
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

        <Divider style={{ margin: '24px 0' }} />

        <H3>1099 / Business Income</H3>
        {store.businessIncome.map((business) => (
          <Card key={business.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <FormGroup label={<strong>Name / Client</strong>} style={{ flex: '1', maxWidth: '120px' }}>
                  <InputGroup 
                    value={business.name} 
                    onChange={(e) => store.updateBusinessIncome(business.id, { name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup label={<strong>Income</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={business.income} 
                    changeFunction={(value) => store.updateBusinessIncome(business.id, { income: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>Expenses</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={business.expenses} 
                    changeFunction={(value) => store.updateBusinessIncome(business.id, { expenses: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>Net Profit</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                   <div className="bp4-input-group">
                        <NumericFormat 
                            className="bp4-input"
                            value={Math.round(business.income - business.expenses)} 
                            displayType={'text'} 
                            thousandSeparator={true} 
                            prefix={'$'} 
                            disabled={true}
                        />
                    </div>
                </FormGroup>
              </div>
              <FormGroup label={<span style={{ visibility: 'hidden' }}>.</span>}>
                <Button 
                  intent="danger"
                  icon={<Trash />}
                  onClick={() => store.removeBusinessIncome(business.id)}
                />
              </FormGroup>
            </div>
          </Card>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <Button 
            intent="success"
            icon={<Plus />}
            text="Add Business Income"
            onClick={() => store.addBusinessIncome()}
          />
        </div>

        <Divider style={{ margin: '24px 0' }} />

        <H3>Option Exercise Batches</H3>

        {store.optionExercises.map((option) => (
          <Card key={option.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <FormGroup label={<strong>Date</strong>} style={{ flex: '1', maxWidth: '140px' }}>
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

        <Divider style={{ margin: '24px 0' }} />

        <H3>Roth Conversions / 1099-R</H3>

        {store.rothConversions.map((conversion) => (
          <Card key={conversion.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <FormGroup label={<strong>Payer / Account</strong>} style={{ flex: '1', maxWidth: '140px' }}>
                  <InputGroup 
                    value={conversion.name} 
                    onChange={(e) => store.updateRothConversion(conversion.id, { name: e.target.value })}
                    placeholder="e.g. Fidelity 401k"
                  />
                </FormGroup>
                <FormGroup label={<strong>Date</strong>} style={{ flex: '1', maxWidth: '140px' }}>
                  <InputGroup 
                    type='date'
                    value={conversion.date} 
                    onChange={(e) => store.updateRothConversion(conversion.id, { date: e.target.value })}
                  />
                </FormGroup>
                <FormGroup label={<strong>Amount</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={conversion.amount} 
                    changeFunction={(value) => store.updateRothConversion(conversion.id, { amount: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>Withholding</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={conversion.withholding} 
                    changeFunction={(value) => store.updateRothConversion(conversion.id, { withholding: value })} 
                  />
                </FormGroup>
                <FormGroup label={<strong>CA Taxable %</strong>} style={{ flex: '1', maxWidth: '100px' }}>
                  <NumberInput 
                    value={conversion.caTaxablePercent ?? 0} 
                    changeFunction={(value) => store.updateRothConversion(conversion.id, { caTaxablePercent: value })} 
                  />
                </FormGroup>
              </div>
              <FormGroup label={<span style={{ visibility: 'hidden' }}>.</span>}>
                <Button 
                  intent="danger"
                  icon={<Trash />}
                  onClick={() => store.removeRothConversion(conversion.id)}
                />
              </FormGroup>
            </div>
          </Card>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <Button 
            intent="success"
            icon={<Plus />}
            text="Add Roth Conversion"
            onClick={() => store.addRothConversion()}
          />
        </div>
        
        <Card style={{ backgroundColor: '#f5f5f5' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <FormGroup label={<strong>Total W2 Income</strong>} style={{ minWidth: '150px' }}>
                <div className="bp4-input-group">
                    <NumericFormat 
                        className="bp4-input"
                        value={Math.round(store.totalW2Income)} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                    />
                </div>
            </FormGroup>
            <FormGroup label={<strong>Total Business Profit</strong>} style={{ minWidth: '150px' }}>
                <div className="bp4-input-group">
                    <NumericFormat 
                        className="bp4-input"
                        value={Math.round(store.totalBusinessProfit)} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        prefix={'$'} 
                        style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                    />
                </div>
            </FormGroup>
            <FormGroup label={<strong>Total Roth Conversions</strong>} style={{ minWidth: '150px' }}>
                <div className="bp4-input-group">
                    <NumericFormat 
                        className="bp4-input"
                        value={Math.round(store.totalRothConversions)} 
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

export default WorkIncomeTab