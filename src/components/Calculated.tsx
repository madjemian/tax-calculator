import { Grid } from 'semantic-ui-react'
import { form1040StoreContext } from '../stores/stores'
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

const CalculatedValues = observer(() => {
  const form1040Store = useContext(form1040StoreContext)

  console.log('Calculated total 1040 tax:', form1040Store.tax)
  console.log('Calculated total payments:', form1040Store.payments)
  console.log('Calculated refund:', form1040Store.refund)
  console.log('Calculated amount owed:', form1040Store.owed)
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={10}>
          yo
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
})

export default CalculatedValues