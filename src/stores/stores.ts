import { createContext } from 'react'
import { UserInputStore, type UserInputData } from './UserInputStore'
import { autorun } from 'mobx'
import { Form1040Store } from '../taxforms/1040'

const TAX_YEAR = '2025'
const LOCAL_STORAGE_KEY = `taxCalculatorData-${TAX_YEAR}`

const initialDataString = localStorage.getItem(LOCAL_STORAGE_KEY)
let userInputStore: UserInputStore
if (initialDataString) {
  try {
    const initialData = JSON.parse(initialDataString) as UserInputData
    userInputStore = new UserInputStore(initialData)
  } catch (error) {
    console.error('Failed to parse user input data from localStorage:', error)
    localStorage.setItem('errorUserInputData', initialDataString)
    console.error('Stored data has been saved to errorUserInputData in localStorage for debugging.')
    console.error(initialDataString)
    userInputStore = new UserInputStore() // Fallback to default store if parsing fails
  }
} else {
  userInputStore = new UserInputStore() // Initialize with default values if no data in localStorage
}
export const userInputStoreContext = createContext(userInputStore)

const form1040Store = new Form1040Store(userInputStore)
export const form1040StoreContext = createContext(form1040Store)

autorun(() => {
  const serializedData = userInputStore.serialize()
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedData))
  console.log(`User input data saved to localStorage[${LOCAL_STORAGE_KEY}]:`, serializedData)
})
