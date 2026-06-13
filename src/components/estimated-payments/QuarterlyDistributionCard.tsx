import { Card, Callout, FormGroup } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import { NumericFormat } from 'react-number-format'
import NumberInput from '../NumberInput'
import type { QuarterlyData } from '../../types'

interface QuarterlyDistributionCardProps {
  label: string
  totalAmount: number
  values: QuarterlyData
  onValueChange: (quarter: keyof QuarterlyData, value: number) => void
  gridRowCallout: number
  gridRowCard: number
}

export const QuarterlyDistributionCard = observer(({
  label,
  totalAmount,
  values,
  onValueChange,
  gridRowCallout,
  gridRowCard,
}: QuarterlyDistributionCardProps) => {
  const totalQuarterly =
    (values?.q1 ?? 0) +
    (values?.q2 ?? 0) +
    (values?.q3 ?? 0) +
    (values?.q4 ?? 0)

  const isMismatch = Math.abs(totalQuarterly - totalAmount) > 1

  return (
    <>
      {/* Callout Info */}
      <div style={{ gridRow: gridRowCallout }}>
        <Callout
          intent={isMismatch ? 'warning' : 'primary'}
          style={{ marginBottom: '16px', minHeight: '65px' }}
        >
          Total {label}:{' '}
          <NumericFormat
            value={totalAmount}
            displayType="text"
            thousandSeparator={true}
            prefix="$"
          />
          <br />
          Distributed:{' '}
          <NumericFormat
            value={totalQuarterly}
            displayType="text"
            thousandSeparator={true}
            prefix="$"
          />
          {isMismatch && <strong> (Mismatch!)</strong>}
        </Callout>
      </div>

      {/* Input Card */}
      <div style={{ gridRow: gridRowCard }}>
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
            <FormGroup label={<strong>Q1</strong>} style={{ flex: '1' }}>
              <NumberInput
                value={values.q1}
                changeFunction={(v) => onValueChange('q1', v)}
              />
            </FormGroup>
            <FormGroup label={<strong>Q2</strong>} style={{ flex: '1' }}>
              <NumberInput
                value={values.q2}
                changeFunction={(v) => onValueChange('q2', v)}
              />
            </FormGroup>
            <FormGroup label={<strong>Q3</strong>} style={{ flex: '1' }}>
              <NumberInput
                value={values.q3}
                changeFunction={(v) => onValueChange('q3', v)}
              />
            </FormGroup>
            <FormGroup label={<strong>Q4</strong>} style={{ flex: '1' }}>
              <NumberInput
                value={values.q4}
                changeFunction={(v) => onValueChange('q4', v)}
              />
            </FormGroup>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              className="bp4-button"
              onClick={() => {
                const quarter = totalAmount / 4
                onValueChange('q1', quarter)
                onValueChange('q2', quarter)
                onValueChange('q3', quarter)
                onValueChange('q4', quarter)
              }}
            >
              Distribute Evenly
            </button>
          </div>
        </Card>
      </div>
    </>
  )
})
