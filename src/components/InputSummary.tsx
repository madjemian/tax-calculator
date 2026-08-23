import { H3, Button, Divider, Intent } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { userInputStoreContext } from '../stores/stores'
import { NumericFormat } from 'react-number-format'
import { Logger } from '../utils/Logger'

const InputSummary = observer(() => {
  const userInputStore = useContext(userInputStoreContext)
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const handleExportBackup = () => {
    try {
      userInputStore.exportBackup()
      setMessage({ text: 'Backup exported successfully!', isError: false })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ text: 'Failed to export backup', isError: true })
      Logger.error('Error exporting backup:', error)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleImportBackup = async () => {
    if (isImporting) return
    
    const userConfirmed = window.confirm(
      'This will restore data from a backup file and replace all current data. ' +
      'Your current data will be automatically backed up first. Continue?'
    )
    
    if (!userConfirmed) return

    setIsImporting(true)
    try {
      const result = await userInputStore.importBackup()
      setMessage({ text: result.message, isError: !result.success })
      setTimeout(() => setMessage(null), result.success ? 3000 : 5000)
    } catch (error) {
      setMessage({ text: 'Unexpected error during import', isError: true })
      Logger.error('Error importing backup:', error)
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div style={{ marginTop: '2em', padding: '16px' }}>
      <H3>Input Summary</H3>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>W2 Income</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalW2Income)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Business Profit</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalBusinessProfit)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>

        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Roth Conversions</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalRothConversions)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Investment Income</strong>
          <div>
            <NumericFormat value={Math.round(
              userInputStore.taxFreeInterest + 
              userInputStore.taxableInterest + 
              userInputStore.totalDividends + 
              userInputStore.longTermCapitalGains + 
              userInputStore.shortTermCapitalGains
            )} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Deductions</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalDeductions)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Taxes Paid</strong>
          <div>
            <NumericFormat value={Math.round(
              userInputStore.totalWithholding + 
              userInputStore.totalEstimatedTaxPaid
            )} displayType={'text'} thousandSeparator={true} prefix={'$'} />
          </div>
        </div>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
          <strong>Total Real Income</strong>
          <div>
            <NumericFormat value={Math.round(userInputStore.totalRealIncome)} displayType={'text'} thousandSeparator={true} prefix={'$'} style={{ color: 'green' }} />
          </div>
        </div>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div>
          <H3 style={{ fontSize: '16px', marginBottom: '12px' }}>Data Backup</H3>
          
          <div style={{ marginBottom: '8px' }}>
            <Button
              text="Download Backup"
              intent={Intent.PRIMARY}
              small
              style={{ width: '100%', marginBottom: '8px' }}
              onClick={handleExportBackup}
            />
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <Button
              text="Restore from Backup"
              intent={Intent.WARNING}
              small
              style={{ width: '100%' }}
              loading={isImporting}
              onClick={handleImportBackup}
            />
          </div>
          
          {message && (
            <div style={{ 
              fontSize: '12px', 
              padding: '8px',
              backgroundColor: message.isError ? '#ffebee' : '#e8f5e8',
              color: message.isError ? '#d32f2f' : '#2e7d32',
              borderRadius: '3px',
              border: `1px solid ${message.isError ? '#ffcdd2' : '#c8e6c9'}`,
              whiteSpace: 'pre-line'
            }}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default InputSummary