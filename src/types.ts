export interface TaxForm {
  calculations: {
    [key: string]: () => number
  }
}