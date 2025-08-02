import { Header, Table, Segment } from 'semantic-ui-react'
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
      <Header as='h2' content='Investment Income (Quarterly)' />
      <Segment>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={4}>Category</Table.HeaderCell>
              <Table.HeaderCell width={3}>Q1</Table.HeaderCell>
              <Table.HeaderCell width={3}>Q2</Table.HeaderCell>
              <Table.HeaderCell width={3}>Q3</Table.HeaderCell>
              <Table.HeaderCell width={3}>Q4</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {incomeCategories.map((category) => (
              <Table.Row key={category.key} style={category.isReadOnly ? { backgroundColor: '#f0f0f0' } : undefined}>
                <Table.Cell><strong>{category.label}</strong></Table.Cell>
                <Table.Cell>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q1)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q1} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q1', value)} 
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q2} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q2', value)} 
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q3)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q3} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q3', value)} 
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {category.isReadOnly ? (
                    <NumericFormat value={Math.round(category.data.q4)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  ) : (
                    <NumberInput 
                      value={category.data.q4} 
                      changeFunction={(value) => store.updateInvestmentIncome(category.key as keyof InvestmentIncome, 'q4', value)} 
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>

      <Header as='h3' content='Investment Income Totals' />
      <Segment>
        <Table basic='very' celled>
          <Table.Body>
            {incomeCategories.map((category) => (
              <Table.Row key={`total-${category.key}`}>
                <Table.Cell width={8}><strong>{category.label}</strong></Table.Cell>
                <Table.Cell width={8}>
                  <NumericFormat 
                    value={Math.round(category.total)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    style={{ fontSize: '1.1em', fontWeight: 'bold' }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </>
  )
})

export default InvestmentIncomeTab