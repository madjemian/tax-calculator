import { H1 } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'
import TabbedUserInputs from './components/tabs/TabbedUserInputs'
import InputSummary from './components/InputSummary'
import Calculated from './components/Calculated'

const App = observer(() => {
  return (
    <div style={{ padding: '2em', maxWidth: '1400px', margin: '0 auto' }}>
      <H1 style={{ textAlign: 'center', marginBottom: '2em' }}>Tax Calculator</H1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px', alignItems: 'start' }}>
        <div>
          <InputSummary />
        </div>
        <div>
          <TabbedUserInputs />
        </div>
        <div>
          <Calculated />
        </div>
      </div>
    </div>
  )
})

export default App
