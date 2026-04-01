import { createContext } from 'react'
import { UserInputStore, type UserInputData } from './UserInputStore'
import { autorun } from 'mobx'
import { AppStore } from './AppStore'
import { Logger } from '../utils/Logger'

const TAX_YEAR = '2026'
const LOCAL_STORAGE_KEY = `taxCalculatorData-${TAX_YEAR}`

const initialDataString = localStorage.getItem(LOCAL_STORAGE_KEY)
let userInputStore: UserInputStore
if (initialDataString) {
  try {
    const initialData = JSON.parse(initialDataString) as UserInputData
    userInputStore = new UserInputStore(initialData)
  } catch (error) {
    Logger.error('Failed to parse user input data from localStorage:', error)
    localStorage.setItem('errorUserInputData', initialDataString)
    Logger.error('Stored data has been saved to errorUserInputData in localStorage for debugging.')
    Logger.error(initialDataString)
    userInputStore = new UserInputStore() // Fallback to default store if parsing fails
  }
} else {
  userInputStore = new UserInputStore() // Initialize with default values if no data in localStorage
}
export const userInputStoreContext = createContext(userInputStore)

const appStore = new AppStore(userInputStore)
export const appStoreContext = createContext(appStore)

autorun(() => {
  const serializedData = userInputStore.serialize()
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedData))
  Logger.log(`User input data saved to localStorage[${LOCAL_STORAGE_KEY}]:`, serializedData)
})
