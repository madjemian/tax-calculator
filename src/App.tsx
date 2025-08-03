import { observer } from 'mobx-react-lite'
import TabbedUserInputs from './components/tabs/TabbedUserInputs'
import InputSummary from './components/InputSummary'
import Calculated from './components/Calculated'

const App = observer(() => {
  return (
    <div style={{ padding: '2em', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '20px', alignItems: 'start' }}>
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
