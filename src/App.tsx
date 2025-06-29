import { Container, Header} from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import UserInputs from './components/UserInputs'
import Calculated from './components/Calculated'

const App = observer(() => {
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h1' content='Tax Calculator' textAlign='center' />
      <UserInputs />
      <Calculated />
    </Container>
  )
})

export default App
