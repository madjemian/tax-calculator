import { Card, H3, HTMLTable, FormGroup, Callout, RadioGroup, Radio } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import { UserInputStore } from '../../stores/UserInputStore'
import { Form1040 } from '../../taxforms/1040'
import { useMemo, useState } from 'react'

const PERIODS = [
  { name: 'Jan 1 - Mar 31', months: 3, factor: 4, label: 'Q1' },
  { name: 'Jan 1 - May 31', months: 5, factor: 2.4, label: 'Q2' },
  { name: 'Jan 1 - Aug 31', months: 8, factor: 1.5, label: 'Q3' },
  { name: 'Jan 1 - Dec 31', months: 12, factor: 1, label: 'Q4' },
] as const

const INSTALLMENT_RATIOS = [0.225, 0.45, 0.675, 0.90]

const EstimatedPaymentsTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  const [targetPercentage, setTargetPercentage] = useState<number>(0.9)

  // Calculate total W2 entered in the quarterly fields
  const totalQuarterlyW2 = 
    store.w2IncomeQuarterly.q1 + 
    store.w2IncomeQuarterly.q2 + 
    store.w2IncomeQuarterly.q3 + 
    store.w2IncomeQuarterly.q4

  const totalActualW2 = store.w2Income.reduce((sum, w) => sum + w.income, 0)
  
  const w2Mismatch = Math.abs(totalQuarterlyW2 - totalActualW2) > 1

  // Calculate total Withholding entered in quarterly fields
  const totalQuarterlyWithholding = 
    store.withholdingQuarterly.q1 + 
    store.withholdingQuarterly.q2 + 
    store.withholdingQuarterly.q3 + 
    store.withholdingQuarterly.q4
  
  const totalActualWithholding = store.totalWithholding
  const withholdingMismatch = Math.abs(totalQuarterlyWithholding - totalActualWithholding) > 1

  // Perform Schedule AI Calculations
  const calculations = useMemo(() => {
    const results = []
    let priorRequiredPayments = 0

    // Clone base data to avoid mutating original store during serialization
    // We only need the scalar values (deductions, etc)
    const baseData = store.serialize()

    for (let i = 0; i < 4; i++) {
      const period = PERIODS[i]
      const installmentRatio = INSTALLMENT_RATIOS[i]

      // 1. Calculate Period Income
      
      // W2:
      // For P1 (3mo): Q1
      // For P2 (5mo): Q1 + Q2 * (2/3)
      // For P3 (8mo): Q1 + Q2 + Q3 * (2/3)
      // For P4 (12mo): Q1 + Q2 + Q3 + Q4
      let periodW2 = 0
      if (i === 0) periodW2 = store.w2IncomeQuarterly.q1
      else if (i === 1) periodW2 = store.w2IncomeQuarterly.q1 + (store.w2IncomeQuarterly.q2 * 2/3)
      else if (i === 2) periodW2 = store.w2IncomeQuarterly.q1 + store.w2IncomeQuarterly.q2 + (store.w2IncomeQuarterly.q3 * 2/3)
      else periodW2 = totalQuarterlyW2

      // Calculate Withholding for the period (using same proration logic as income)
      // This estimates "withholding paid during the period"
      let periodWithholding = 0
      if (i === 0) periodWithholding = store.withholdingQuarterly.q1
      else if (i === 1) periodWithholding = store.withholdingQuarterly.q1 + (store.withholdingQuarterly.q2 * 2/3)
      else if (i === 2) periodWithholding = store.withholdingQuarterly.q1 + store.withholdingQuarterly.q2 + (store.withholdingQuarterly.q3 * 2/3)
      else periodWithholding = totalQuarterlyWithholding

      // Investment Income:
      // Same logic for each category
      const getPeriodAmount = (qData: {q1: number, q2: number, q3: number, q4: number}) => {
        if (i === 0) return qData.q1
        if (i === 1) return qData.q1 + (qData.q2 * 2/3)
        if (i === 2) return qData.q1 + qData.q2 + (qData.q3 * 2/3)
        return qData.q1 + qData.q2 + qData.q3 + qData.q4
      }

      // Options:
      // Filter by date. 
      // P1: <= 3/31
      // P2: <= 5/31
      // P3: <= 8/31
      // P4: <= 12/31
      const periodOptions = store.optionExercises.filter(opt => {
        const month = parseInt(opt.date.split('-')[1], 10)
        if (i === 0) return month <= 3
        if (i === 1) return month <= 5
        if (i === 2) return month <= 8
        return true
      }).reduce((sum, opt) => sum + opt.amount, 0)


      // 2. Annualize
      const factor = period.factor
      const annualizedW2 = periodW2 * factor
      const annualizedOptions = periodOptions * factor
      
      // Create Mock Store
      const mockStore = new UserInputStore()
      
      // Copy Deductions (Assumed annual)
      mockStore.hsaContribution = baseData.hsaContribution
      mockStore._401kContribution = baseData._401kContribution
      mockStore._403bContribution = baseData._403bContribution
      mockStore.propertyTaxes = baseData.propertyTaxes
      mockStore.foreignTaxCredit = baseData.foreignTaxCredit

      // Set Annualized Income
      // We clear existing arrays and add one large entry
      mockStore.w2Income = []
      mockStore.addW2Income('Annualized W2', annualizedW2)
      
      mockStore.optionExercises = []
      if (annualizedOptions > 0) {
        mockStore.addOptionExercise('2026-12-31', annualizedOptions)
      }

      // Set Annualized Investment Income
      // We'll just put everything in Q1 of the mock store
      mockStore.investmentIncome.taxableInterest.q1 = getPeriodAmount(store.investmentIncome.taxableInterest) * factor
      mockStore.investmentIncome.taxFreeInterest.q1 = getPeriodAmount(store.investmentIncome.taxFreeInterest) * factor
      mockStore.investmentIncome.qualifiedDividends.q1 = getPeriodAmount(store.investmentIncome.qualifiedDividends) * factor
      mockStore.investmentIncome.nonQualifiedDividends.q1 = getPeriodAmount(store.investmentIncome.nonQualifiedDividends) * factor
      mockStore.investmentIncome.longTermCapitalGains.q1 = getPeriodAmount(store.investmentIncome.longTermCapitalGains) * factor
      mockStore.investmentIncome.shortTermCapitalGains.q1 = getPeriodAmount(store.investmentIncome.shortTermCapitalGains) * factor

      // Calculate Tax
      const form1040 = new Form1040(mockStore)
      const annualizedTax = form1040.tax
      
      // 3. Calculate Required Installment
      const targetAnnualPayment = annualizedTax * targetPercentage
      const cumulativeTarget = targetAnnualPayment * installmentRatio
      
      // Withholding is treated as paid based on actual distribution
      // Use the calculated periodWithholding (which includes proration for 5/8 month periods)
      // Note: Schedule AI instructions say "Enter tax withheld... for the months shown". 
      // This implies actuals. Our 'periodWithholding' variable calculates this.
      const withholdingDeemedPaid = periodWithholding
      
      const neededTotal = Math.max(0, cumulativeTarget - withholdingDeemedPaid)
      const requiredPayment = Math.max(0, neededTotal - priorRequiredPayments)
      
      results.push({
        periodName: period.name,
        annualizedIncome: form1040.getAgi(),
        annualizedTax,
        cumulativeTarget,
        withholdingDeemedPaid,
        requiredPayment
      })

      priorRequiredPayments += requiredPayment
    }

    return results
  }, [store.w2IncomeQuarterly, store.w2Income, store.investmentIncome, store.optionExercises, 
      store.hsaContribution, store.propertyTaxes, store.foreignTaxCredit,
      totalQuarterlyW2, totalActualW2, targetPercentage, store.totalWithholding, 
      store.withholdingQuarterly, totalQuarterlyWithholding]) // Add dependencies

  const totalRequired = calculations.reduce((sum, c) => sum + c.requiredPayment, 0)

  return (
    <>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <H3>W2 Income Quarterly Distribution</H3>
          <Callout intent={w2Mismatch ? "warning" : "primary"} style={{ marginBottom: '16px' }}>
            Total W2 Income: <NumericFormat value={totalActualW2} displayType="text" thousandSeparator={true} prefix="$" />
            <br />
            Distributed: <NumericFormat value={totalQuarterlyW2} displayType="text" thousandSeparator={true} prefix="$" />
            {w2Mismatch && <strong> (Mismatch!)</strong>}
          </Callout>

          <Card style={{ marginBottom: '16px' }}>
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

        <div style={{ flex: 1 }}>
          <H3>Withholding Quarterly Distribution</H3>
          <Callout intent={withholdingMismatch ? "warning" : "primary"} style={{ marginBottom: '16px' }}>
            Total Withholding: <NumericFormat value={totalActualWithholding} displayType="text" thousandSeparator={true} prefix="$" />
            <br />
            Distributed: <NumericFormat value={totalQuarterlyWithholding} displayType="text" thousandSeparator={true} prefix="$" />
            {withholdingMismatch && <strong> (Mismatch!)</strong>}
          </Callout>

          <Card style={{ marginBottom: '16px' }}>
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
      <Card>
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
                          <div style={{ fontSize: '0.8em', color: '#888' }}>
                            ({(i + 1) * 25}% of <NumericFormat value={store.totalWithholding} displayType="text" thousandSeparator={true} prefix="$" />)
                          </div>
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