import { Card, H3, HTMLTable, FormGroup, Callout, RadioGroup, Radio, Button, Collapse } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import { UserInputStore } from '../../stores/UserInputStore'
import { calculateScheduleAI, INSTALLMENT_RATIOS } from '../../taxforms/ScheduleAI'
import { useState } from 'react'

// PERIODS and INSTALLMENT_RATIOS are imported from ScheduleAI

const EstimatedPaymentsTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  const [targetPercentage, setTargetPercentage] = useState<number>(0.9)
  const [showDetails, setShowDetails] = useState(false)

  // Calculate total W2 entered in the quarterly fields
  const totalQuarterlyW2 = 
    store.w2IncomeQuarterly.q1 + 
    store.w2IncomeQuarterly.q2 + 
    store.w2IncomeQuarterly.q3 + 
    store.w2IncomeQuarterly.q4

  const totalActualW2 = store.w2Income.reduce((sum, w) => sum + w.income, 0)
  
  const w2Mismatch = Math.abs(totalQuarterlyW2 - totalActualW2) > 1

  // Calculate total Business Profit entered in the quarterly fields
  const totalQuarterlyBusinessProfit = 
    store.businessProfitQuarterly.q1 + 
    store.businessProfitQuarterly.q2 + 
    store.businessProfitQuarterly.q3 + 
    store.businessProfitQuarterly.q4

  const totalActualBusinessProfit = store.totalBusinessProfit
  const businessProfitMismatch = Math.abs(totalQuarterlyBusinessProfit - totalActualBusinessProfit) > 1

  // Calculate total Withholding entered in quarterly fields
  const totalQuarterlyWithholding = 
    store.withholdingQuarterly.q1 + 
    store.withholdingQuarterly.q2 + 
    store.withholdingQuarterly.q3 + 
    store.withholdingQuarterly.q4
  
  const totalActualWithholding = store.totalWithholding
  const withholdingMismatch = Math.abs(totalQuarterlyWithholding - totalActualWithholding) > 1

  // Perform Schedule AI Calculations using external utility function
  const calculations = calculateScheduleAI(store, targetPercentage)

  const totalRequired = calculations.reduce((sum, c) => sum + c.requiredPayment, 0)

  return (
    <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '0 20px', 
        alignItems: 'start' 
      }}>
        {/* Row 1: Headers */}
        <H3 style={{ gridRow: 1, margin: '0 0 16px 0' }}>W2 Income Quarterly Distribution</H3>
        <H3 style={{ gridRow: 1, margin: '0 0 16px 0' }}>Business Profit Quarterly Distribution</H3>

        {/* Row 2: Callouts */}
        <div style={{ gridRow: 2 }}>
          <Callout intent={w2Mismatch ? "warning" : "primary"} style={{ marginBottom: '16px', minHeight: '65px' }}>
            Total W2 Income: <NumericFormat value={totalActualW2} displayType="text" thousandSeparator={true} prefix="$" />
            <br />
            Distributed: <NumericFormat value={totalQuarterlyW2} displayType="text" thousandSeparator={true} prefix="$" />
            {w2Mismatch && <strong> (Mismatch!)</strong>}
          </Callout>
        </div>
        <div style={{ gridRow: 2 }}>
          <Callout intent={businessProfitMismatch ? "warning" : "primary"} style={{ marginBottom: '16px', minHeight: '65px' }}>
            Total Business Profit: <NumericFormat value={totalActualBusinessProfit} displayType="text" thousandSeparator={true} prefix="$" />
            <br />
            Distributed: <NumericFormat value={totalQuarterlyBusinessProfit} displayType="text" thousandSeparator={true} prefix="$" />
            {businessProfitMismatch && <strong> (Mismatch!)</strong>}
          </Callout>
        </div>

        {/* Row 3: Cards */}
        <div style={{ gridRow: 3 }}>
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
                <FormGroup label={<strong>Q1</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.w2IncomeQuarterly.q1} changeFunction={(v) => store.updateW2IncomeQuarterly('q1', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q2</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.w2IncomeQuarterly.q2} changeFunction={(v) => store.updateW2IncomeQuarterly('q2', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q3</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.w2IncomeQuarterly.q3} changeFunction={(v) => store.updateW2IncomeQuarterly('q3', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q4</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.w2IncomeQuarterly.q4} changeFunction={(v) => store.updateW2IncomeQuarterly('q4', v)} />
                </FormGroup>
            </div>
            <div style={{ marginTop: '10px' }}>
                <button 
                    type="button" 
                    className="bp4-button" 
                    onClick={() => {
                        const quarter = totalActualW2 / 4
                        store.updateW2IncomeQuarterly('q1', quarter)
                        store.updateW2IncomeQuarterly('q2', quarter)
                        store.updateW2IncomeQuarterly('q3', quarter)
                        store.updateW2IncomeQuarterly('q4', quarter)
                    }}
                >
                    Distribute Evenly
                </button>
            </div>
          </Card>
        </div>
        <div style={{ gridRow: 3 }}>
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
                <FormGroup label={<strong>Q1</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.businessProfitQuarterly.q1} changeFunction={(v) => store.updateBusinessProfitQuarterly('q1', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q2</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.businessProfitQuarterly.q2} changeFunction={(v) => store.updateBusinessProfitQuarterly('q2', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q3</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.businessProfitQuarterly.q3} changeFunction={(v) => store.updateBusinessProfitQuarterly('q3', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q4</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.businessProfitQuarterly.q4} changeFunction={(v) => store.updateBusinessProfitQuarterly('q4', v)} />
                </FormGroup>
            </div>
            <div style={{ marginTop: '10px' }}>
                <button 
                    type="button" 
                    className="bp4-button" 
                    onClick={() => {
                        const quarter = totalActualBusinessProfit / 4
                        store.updateBusinessProfitQuarterly('q1', quarter)
                        store.updateBusinessProfitQuarterly('q2', quarter)
                        store.updateBusinessProfitQuarterly('q3', quarter)
                        store.updateBusinessProfitQuarterly('q4', quarter)
                    }}
                >
                    Distribute Evenly
                </button>
            </div>
          </Card>
        </div>

        {/* Row 4: Withholding Header */}
        <H3 style={{ gridRow: 4, margin: '8px 0 16px 0' }}>Withholding Quarterly Distribution</H3>
        
        {/* Row 5: Withholding Callout */}
        <div style={{ gridRow: 5 }}>
          <Callout intent={withholdingMismatch ? "warning" : "primary"} style={{ marginBottom: '16px', minHeight: '65px' }}>
            Total Withholding: <NumericFormat value={totalActualWithholding} displayType="text" thousandSeparator={true} prefix="$" />
            <br />
            Distributed: <NumericFormat value={totalQuarterlyWithholding} displayType="text" thousandSeparator={true} prefix="$" />
            {withholdingMismatch && <strong> (Mismatch!)</strong>}
          </Callout>
        </div>

        {/* Row 6: Withholding Card */}
        <div style={{ gridRow: 6 }}>
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
                <FormGroup label={<strong>Q1</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.withholdingQuarterly.q1} changeFunction={(v) => store.updateWithholdingQuarterly('q1', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q2</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.withholdingQuarterly.q2} changeFunction={(v) => store.updateWithholdingQuarterly('q2', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q3</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.withholdingQuarterly.q3} changeFunction={(v) => store.updateWithholdingQuarterly('q3', v)} />
                </FormGroup>
                <FormGroup label={<strong>Q4</strong>} style={{ flex: '1' }}>
                  <NumberInput value={store.withholdingQuarterly.q4} changeFunction={(v) => store.updateWithholdingQuarterly('q4', v)} />
                </FormGroup>
            </div>
            <div style={{ marginTop: '10px' }}>
                <button 
                    type="button" 
                    className="bp4-button" 
                    onClick={() => {
                        const quarter = totalActualWithholding / 4
                        store.updateWithholdingQuarterly('q1', quarter)
                        store.updateWithholdingQuarterly('q2', quarter)
                        store.updateWithholdingQuarterly('q3', quarter)
                        store.updateWithholdingQuarterly('q4', quarter)
                    }}
                >
                    Distribute Evenly
                </button>
            </div>
          </Card>
        </div>
      </div>


      <H3>Schedule AI (Annualized Income Installment)</H3>
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '20px' }}>
          <FormGroup label="Target Liability Percentage (Safe Harbor Rule)" inline>
            <RadioGroup
              inline
              onChange={(e) => setTargetPercentage(parseFloat(e.currentTarget.value))}
              selectedValue={targetPercentage}
            >
              <Radio label="90% (Standard)" value={0.9} />
              <Radio label="100% (High Earner >$150k)" value={1.0} />
              <Radio label="110% (High Earner Safe Harbor)" value={1.1} />
            </RadioGroup>
          </FormGroup>
        </div>

        <HTMLTable striped style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Annualized Tax</th>
                    <th>Cumulative Target ({Math.round(targetPercentage * 100)}%)</th>
                    <th>Withholding Applied</th>
                    <th>Required Payment</th>
                </tr>
            </thead>
            <tbody>
                {calculations.map((row, i) => (
                    <tr key={i}>
                        <td>{row.periodName}</td>
                        <td><NumericFormat value={Math.round(row.annualizedTax)} displayType="text" thousandSeparator={true} prefix="$" /></td>
                        <td><NumericFormat value={Math.round(row.cumulativeTarget)} displayType="text" thousandSeparator={true} prefix="$" /></td>
                        <td>
                          <NumericFormat value={Math.round(row.withholdingDeemedPaid)} displayType="text" thousandSeparator={true} prefix="$" />
                        </td>
                        <td style={{ fontWeight: 'bold', color: '#106ba3' }}>
                            <NumericFormat value={Math.round(row.requiredPayment)} displayType="text" thousandSeparator={true} prefix="$" />
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr style={{ borderTop: '2px solid #ccc' }}>
                    <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Estimated Payments Required:</td>
                    <td style={{ fontWeight: 'bold' }}>
                        <NumericFormat value={Math.round(totalRequired)} displayType="text" thousandSeparator={true} prefix="$" />
                    </td>
                </tr>
            </tfoot>
        </HTMLTable>
        
        <div style={{ marginTop: '20px' }}>
          <Button 
            minimal 
            small 
            rightIcon={showDetails ? "chevron-up" : "chevron-down"} 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Detailed Calculation Breakdown" : "Show Detailed Calculation Breakdown"}
          </Button>
          
          <Collapse isOpen={showDetails}>
            <div style={{ marginTop: '10px', overflowX: 'auto' }}>
              <HTMLTable bordered compact style={{ width: '100%', fontSize: '0.85em' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f8fa' }}>
                    <th style={{ width: '30%' }}>Calculation Step</th>
                    <th style={{ width: '17.5%' }}>Period 1 (3mo)</th>
                    <th style={{ width: '17.5%' }}>Period 2 (5mo)</th>
                    <th style={{ width: '17.5%' }}>Period 3 (8mo)</th>
                    <th style={{ width: '17.5%' }}>Period 4 (12mo)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>(1) Period W2 Income</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.periodW2)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr>
                    <td><strong>(2) Period Business Profit</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.periodBusinessProfit)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr>
                    <td><strong>(3) Period Investment Income</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.periodInvestment)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr>
                    <td><strong>(4) Period Options Income</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.periodOptions)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr style={{ borderTop: '1px solid #ddd' }}>
                    <td><strong>(5) Total Period Income (1+2+3+4)</strong></td>
                    {calculations.map((c, i) => <td key={i}><strong><NumericFormat value={Math.round(c.totalPeriodIncome)} displayType="text" thousandSeparator={true} prefix="$" /></strong></td>)}
                  </tr>
                  <tr>
                    <td><strong>(6) Annualization Factor</strong></td>
                    {calculations.map((c, i) => <td key={i}>x {c.annualizationFactor}</td>)}
                  </tr>
                  <tr style={{ borderTop: '1px solid #ddd' }}>
                    <td><strong>(7) Annualized Gross Income (5 x 6)</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.annualizedGross)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr>
                    <td><strong>(8) Less: Annual Adjustments</strong></td>
                    {calculations.map((c, i) => <td key={i} style={{color: '#d32f2f'}}>(<NumericFormat value={Math.round(c.annualizedGross - c.annualizedAGI)} displayType="text" thousandSeparator={true} prefix="$" />)</td>)}
                  </tr>
                  <tr>
                    <td><strong>(9) Annualized AGI (7 - 8)</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.annualizedAGI)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr>
                    <td><strong>(10) Calculated Tax on (9)</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.annualizedTax)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                  <tr>
                    <td><strong>(11) Target Percentage</strong></td>
                    <td colSpan={4} style={{ textAlign: 'center' }}>{Math.round(targetPercentage * 100)}%</td>
                  </tr>
                  <tr>
                    <td><strong>(12) Installment Ratio</strong></td>
                    {INSTALLMENT_RATIOS.map((r, i) => <td key={i}>{r * 100}%</td>)}
                  </tr>
                  <tr style={{ backgroundColor: '#fff9e6' }}>
                    <td><strong>(13) Cumulative Target (10 x 11 x 12)</strong></td>
                    {calculations.map((c, i) => <td key={i}><strong><NumericFormat value={Math.round(c.cumulativeTarget)} displayType="text" thousandSeparator={true} prefix="$" /></strong></td>)}
                  </tr>
                  <tr>
                    <td><strong>(14) Withholding for Period</strong></td>
                    {calculations.map((c, i) => <td key={i}><NumericFormat value={Math.round(c.withholdingDeemedPaid)} displayType="text" thousandSeparator={true} prefix="$" /></td>)}
                  </tr>
                </tbody>
              </HTMLTable>
            </div>
          </Collapse>
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.9em', color: '#666' }}>
            * This tool uses the Annualized Income Installment Method (Schedule AI). 
            Withholding is calculated based on the quarterly distribution entered above.
            "Required Payment" is the amount needed by check/direct pay for the period, after accounting for that quarter's share of withholding.
        </div>
      </Card>
    </>
  )
})

export default EstimatedPaymentsTab