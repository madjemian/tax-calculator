import { Tab } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { userInputStoreContext } from '../../stores/stores'
import W2IncomeTab from './W2IncomeTab'
import InvestmentIncomeTab from './InvestmentIncomeTab'
import DeductionsTab from './DeductionsTab'
import TaxesPaidTab from './TaxesPaidTab'

const TabbedUserInputs = observer(() => {
  const userInputStore = useContext(userInputStoreContext)

  const panes = [
    {
      menuItem: 'W2 Income',
      render: () => <W2IncomeTab store={userInputStore} />,
    },
    {
      menuItem: 'Investment Income',
      render: () => <InvestmentIncomeTab store={userInputStore} />,
    },
    {
      menuItem: 'Income Deductions',
      render: () => <DeductionsTab store={userInputStore} />,
    },
    {
      menuItem: 'Taxes Paid',
      render: () => <TaxesPaidTab store={userInputStore} />,
    },
  ]

  return <Tab panes={panes} />
})

export default TabbedUserInputs