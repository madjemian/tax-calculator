import { Form, FormGroup, Header, Segment, SegmentGroup } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import NumberInput from '../NumberInput'
import type { UserInputStore } from '../../stores/UserInputStore'

const DeductionsTab = observer((props: { store: UserInputStore }) => {
  const { store } = props
  
  return (
    <>
      <Header as='h2' content='Income Deductions' />
      <Form widths='equal'>
        <SegmentGroup>
          <Segment>
            <FormGroup>
              <Form.Field>
                <label>HSA Contribution</label>
                <NumberInput value={store.hsaContribution} changeFunction={store.setHsaContribution.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>401k Contribution</label>
                <NumberInput value={store._401kContribution} changeFunction={store.set401kContribution.bind(store)} />
              </Form.Field>
              <Form.Field>
                <label>403b Contribution</label>
                <NumberInput value={store._403bContribution} changeFunction={store.set403bContribution.bind(store)} />
              </Form.Field>
            </FormGroup>
          </Segment>
          <Segment inverted color={'grey'}>
            <FormGroup>
              <Form.Field>
                <label>Total Deductions</label>
                <NumberInput value={store.totalDeductions} />
              </Form.Field>
            </FormGroup>
          </Segment>
        </SegmentGroup>
      </Form>
    </>
  )
})

export default DeductionsTab