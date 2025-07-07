import { makeAutoObservable } from 'mobx';
import type { UserInputStore } from './UserInputStore';
import { Form1040 } from '../taxforms/1040';

export class AppStore {
  private userInputStore: UserInputStore
  private form1040: Form1040

  constructor(userInputStore: UserInputStore) {
    this.userInputStore = userInputStore
    this.form1040 = new Form1040(userInputStore)
    makeAutoObservable(this)
  }

  get tax(): number {
    return this.form1040.tax
  }

  get payments(): number {
    return this.form1040.payments
  }

  get refund(): number {
    // if negative, return 0
    return this.form1040.refund
  }

  get owed(): number {
    // if negative, return 0
    return this.form1040.owed
  }

  get totalIncome(): number {
    return this.userInputStore.totalRealIncome
  }

  get effectiveTaxRate(): number {
    // Effective tax rate = total tax / total income
    const rate = this.tax / this.totalIncome
    return isNaN(rate) ? 0 : rate
  }
}