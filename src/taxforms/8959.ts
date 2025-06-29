import { ADDITIONAL_MEDICARE_TAX_THRESHOLD } from './1040';

export class Form8959 {

  medicareWages: number

  constructor(medicareWages: number) {
    // Initialize the form with user input data
    this.medicareWages = medicareWages;
  }

  // Add methods to calculate the tax based on user inputs
  additionalMedicareTax(): number {
    // PART I
    const l4 = this.medicareWages // all taxable wages
    const l5 = ADDITIONAL_MEDICARE_TAX_THRESHOLD
    const l6 = Math.max(0, l4 - l5) // excess wages over threshold
    const l7 = l6 * 0.009 // 0.9% tax on excess wages

    // PART II

    // PART III

    // PART IV
    const l18 = l7
    return l18 // total additional medicare tax
  }
}