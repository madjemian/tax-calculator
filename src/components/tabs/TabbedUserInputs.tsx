import { Tabs, Tab } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { userInputStoreContext } from '../../stores/stores'
import W2IncomeTab from './W2IncomeTab'
import InvestmentIncomeTab from './InvestmentIncomeTab'
import DeductionsTab from './DeductionsTab'
import TaxesPaidTab from './TaxesPaidTab'

const TabbedUserInputs = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  return (
    <Tabs id="user-input-tabs" defaultSelectedTabId="w2-income">
      <Tab id="w2-income" title="W2 Income" panel={<W2IncomeTab store={userInputStore} />} />
      <Tab id="investment-income" title="Investment Income" panel={<InvestmentIncomeTab store={userInputStore} />} />
      <Tab id="deductions" title="Income Deductions" panel={<DeductionsTab store={userInputStore} />} />
      <Tab id="taxes-paid" title="Taxes Paid" panel={<TaxesPaidTab store={userInputStore} />} />
    </Tabs>
  )
})

export default TabbedUserInputs