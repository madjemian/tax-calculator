import { Container, Grid, Header} from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import TabbedUserInputs from './components/tabs/TabbedUserInputs'
import InputSummary from './components/InputSummary'
import Calculated from './components/Calculated'

const App = observer(() => {
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as='h1' content='Tax Calculator' textAlign='center' />
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <InputSummary />
          </Grid.Column>
          <Grid.Column width={10}>
            <TabbedUserInputs />
          </Grid.Column>
          <Grid.Column width={3}>
            <Calculated />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
})

export default App
