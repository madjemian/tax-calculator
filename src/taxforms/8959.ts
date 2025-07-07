import type { TaxForm } from '../types';
import { ADDITIONAL_MEDICARE_TAX_THRESHOLD } from './1040';

export class Form8959 implements TaxForm {

  medicareWages: number

  calculations: {
    [key: string]: () => number
  }

  constructor(medicareWages: number) {
    // Initialize the form with user input data
    this.medicareWages = medicareWages;

    this.calculations = {
      line4: () => this.medicareWages,
      line5: () => ADDITIONAL_MEDICARE_TAX_THRESHOLD,
      line6: () => Math.max(0, this.calculations.line4() - this.calculations.line5()), // excess wages over threshold
      line7: () => this.calculations.line6() * 0.009, // 0.9% tax on excess wages
      line18: () => this.calculations.line7(), // total additional medicare tax
    }
  }

  additionalMedicareTax(): number {
    return this.calculations.line18()
  }
}