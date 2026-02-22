import { Tabs, Tab } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { userInputStoreContext } from '../../stores/stores'
import WorkIncomeTab from './WorkIncomeTab'
import InvestmentIncomeTab from './InvestmentIncomeTab'
import DeductionsTab from './DeductionsTab'
import TaxesPaidTab from './TaxesPaidTab'
import EstimatedPaymentsTab from './EstimatedPaymentsTab'

const TabbedUserInputs = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  return (
    <Tabs id="user-input-tabs" defaultSelectedTabId="work-income">
      <Tab id="work-income" title={<strong>Work Income</strong>} panel={<WorkIncomeTab store={userInputStore} />} />
      <Tab id="investment-income" title={<strong>Investment Income</strong>} panel={<InvestmentIncomeTab store={userInputStore} />} />
      <Tab id="deductions" title={<strong>Income Deductions</strong>} panel={<DeductionsTab store={userInputStore} />} />
      <Tab id="taxes-paid" title={<strong>Taxes Paid</strong>} panel={<TaxesPaidTab store={userInputStore} />} />
      <Tab id="estimated-payments" title={<strong>Estimated Payments</strong>} panel={<EstimatedPaymentsTab store={userInputStore} />} />
    </Tabs>
  )
})

export default TabbedUserInputs