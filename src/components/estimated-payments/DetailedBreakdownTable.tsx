import { HTMLTable } from '@blueprintjs/core'
import { NumericFormat } from 'react-number-format'
import { INSTALLMENT_RATIOS, type ScheduleAICalculationResult } from '../../taxforms/ScheduleAI'

interface DetailedBreakdownTableProps {
  calculations: ScheduleAICalculationResult[]
  targetPercentage: number
}

export function DetailedBreakdownTable({ calculations, targetPercentage }: DetailedBreakdownTableProps) {
  return (
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
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.periodW2)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(2) Period Business Profit</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.periodBusinessProfit)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(3) Period Investment Income</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.periodInvestment)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(4) Period Options Income</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.periodOptions)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr style={{ borderTop: '1px solid #ddd' }}>
            <td><strong>(5) Total Period Income (1+2+3+4)</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <strong>
                  <NumericFormat
                    value={Math.round(c.totalPeriodIncome)}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                  />
                </strong>
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(6) Annualization Factor</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>x {c.annualizationFactor}</td>
            ))}
          </tr>
          <tr style={{ borderTop: '1px solid #ddd' }}>
            <td><strong>(7) Annualized Gross Income (5 x 6)</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.annualizedGross)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(8) Less: Annual Adjustments</strong></td>
            {calculations.map((c, i) => (
              <td key={i} style={{ color: '#d32f2f' }}>
                (
                <NumericFormat
                  value={Math.round(c.annualizedGross - c.annualizedAGI)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
                )
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(9) Annualized AGI (7 - 8)</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.annualizedAGI)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(10) Calculated Tax on (9)</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.annualizedTax)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(11) Target Percentage</strong></td>
            <td colSpan={4} style={{ textAlign: 'center' }}>
              {Math.round(targetPercentage * 100)}%
            </td>
          </tr>
          <tr>
            <td><strong>(12) Installment Ratio</strong></td>
            {INSTALLMENT_RATIOS.map((r, i) => (
              <td key={i}>{r * 100}%</td>
            ))}
          </tr>
          <tr style={{ backgroundColor: '#fff9e6' }}>
            <td><strong>(13) Cumulative Target (10 x 11 x 12)</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <strong>
                  <NumericFormat
                    value={Math.round(c.cumulativeTarget)}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                  />
                </strong>
              </td>
            ))}
          </tr>
          <tr>
            <td><strong>(14) Withholding for Period</strong></td>
            {calculations.map((c, i) => (
              <td key={i}>
                <NumericFormat
                  value={Math.round(c.withholdingDeemedPaid)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix="$"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </HTMLTable>
    </div>
  )
}
