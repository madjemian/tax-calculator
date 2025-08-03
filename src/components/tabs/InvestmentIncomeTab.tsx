import { H2, H3, Card, HTMLTable } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import { NumericFormat } from 'react-number-format'
import type { UserInputStore } from '../../stores/UserInputStore'
import type { InvestmentIncome, QuarterlyData } from '../../types'

const InvestmentIncomeTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  const incomeCategories: Array<{
    key: keyof InvestmentIncome | 'totalDividends'
    label: string
    data: QuarterlyData
    total: number
    isReadOnly?: boolean
  }> = [
    { key: 'taxableInterest', label: 'Taxable Interest', data: store.investmentIncome.taxableInterest, total: store.taxableInterest },
    { key: 'longTermCapitalGains', label: 'Long Term Capital Gains', data: store.investmentIncome.longTermCapitalGains, total: store.longTermCapitalGains },
    { key: 'shortTermCapitalGains', label: 'Short Term Capital Gains', data: store.investmentIncome.shortTermCapitalGains, total: store.shortTermCapitalGains },
    { key: 'qualifiedDividends', label: 'Qualified Dividends', data: store.investmentIncome.qualifiedDividends, total: store.qualifiedDividends },
    { key: 'nonQualifiedDividends', label: 'Non-Qualified Dividends', data: store.investmentIncome.nonQualifiedDividends, total: store.nonQualifiedDividends },
    { 
      key: 'totalDividends', 
      label: 'Total Dividends', 
      data: {
        q1: store.investmentIncome.qualifiedDividends.q1 + store.investmentIncome.nonQualifiedDividends.q1,
        q2: store.investmentIncome.qualifiedDividends.q2 + store.investmentIncome.nonQualifiedDividends.q2,
        q3: store.investmentIncome.qualifiedDividends.q3 + store.investmentIncome.nonQualifiedDividends.q3,
        q4: store.investmentIncome.qualifiedDividends.q4 + store.investmentIncome.nonQualifiedDividends.q4,
      }, 
      total: store.totalDividends,
      isReadOnly: true
    },
    { key: 'taxFreeInterest', label: 'Tax Free Interest', data: store.investmentIncome.taxFreeInterest, total: store.taxFreeInterest },
  ]

  return (
    <>
      <H2>Investment Income (Quarterly)</H2>
      <Card style={{ marginBottom: '16px' }}>
        <HTMLTable striped style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Category</th>
              <th style={{ width: '18.75%' }}>Q1</th>
              <th style={{ width: '18.75%' }}>Q2</th>
              <th style={{ width: '18.75%' }}>Q3</th>
              <th style={{ width: '18.75%' }}>Q4</th>
            </tr>
          </thead>
          
          <tbody>
            {incomeCategories.map((category) => (
              <tr key={category.key} style={category.isReadOnly ? { backgroundColor: '#f0f0f0' } : undefined}>
                <td><strong>{category.label}</strong></td>
                <td>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q1)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q1} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q1', value)} 
                    />
                  )}
                </td>
                <td>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q2} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q2', value)} 
                    />
                  )}
                </td>
                <td>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q3)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q3} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q3', value)} 
                    />
                  )}
                </td>
                <td>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q4)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q4} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q4', value)} 
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </Card>

      <H3>Investment Income Totals</H3>
      <Card>
        <HTMLTable style={{ width: '100%' }}>
          <tbody>
            {incomeCategories.map((category) => (
              <tr key={`total-${category.key}`}>
                <td style={{ width: '50%' }}><strong>{category.label}</strong></td>
                <td style={{ width: '50%' }}>
                  <NumericFormat 
                    value={Math.round(category.total)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    style={{ fontSize: '1.1em', fontWeight: 'bold' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </Card>
    </>
  )
})

export default InvestmentIncomeTab