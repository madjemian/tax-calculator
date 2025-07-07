export abstract class TaxForm {
  // This class will represent a generic tax form
  protected calculations: { [key: string]: () => number } = {}

  // Method to get the value of a specific line
  public getLineValue(line: string): number {
    return this.calculations[line] ? this.calculations[line]() : 0
  }
}