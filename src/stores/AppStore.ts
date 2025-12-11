import { makeAutoObservable } from 'mobx';
import type { UserInputStore } from './UserInputStore';
import { Form1040 } from '../taxforms/1040';
import { CaliforniaTax } from '../taxforms/CaliforniaTax';

export class AppStore {
  private userInputStore: UserInputStore
  private form1040: Form1040
  private californiaTax: CaliforniaTax

  constructor(userInputStore: UserInputStore) {
    this.userInputStore = userInputStore
    this.form1040 = new Form1040(userInputStore)
    this.californiaTax = new CaliforniaTax(userInputStore)
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

  get agi(): number {
    return Math.round(this.form1040.getAgi())
  }

  get magi(): number {
    return Math.round(this.form1040.getModifiedAGI())
  }

  get effectiveTaxRate(): number {
    // Effective tax rate = total tax / total income
    const rate = this.tax / this.totalIncome
    return isNaN(rate) ? 0 : rate
  }

  // California tax calculations
  get caTaxableIncome(): number {
    return Math.round(this.californiaTax.fullTaxableIncome)
  }

  get caTaxableAmount(): number {
    return Math.round(this.californiaTax.caTaxableAmount)
  }

  get caRatio(): number {
    return this.californiaTax.caRatio
  }

  get caFullTax(): number {
    return Math.round(this.californiaTax.calculateFullCATax())
  }

  get caActualTax(): number {
    return Math.round(this.californiaTax.calculateActualCATax())
  }

  get marginalTaxBracket(): { rate: number, remaining: number } {
    return this.form1040.marginalTaxBracket
  }
}