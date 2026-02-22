import type { UserInputData } from '../stores/UserInputStore'

export interface BackupMetadata {
  version: string
  taxYear: string
  timestamp: string
  appVersion: string
}

export interface BackupFile {
  metadata: BackupMetadata
  data: UserInputData
}

export interface BackupValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class BackupService {
  private static readonly BACKUP_VERSION = '1.0'
  private static readonly APP_VERSION = '1.0.0'
  private static readonly TAX_YEAR = '2026'

  static generateBackupFilename(): string {
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0]
    return `tax-backup-${this.TAX_YEAR}-${timestamp}.json`
  }

  static createBackup(userData: UserInputData): BackupFile {
    const metadata: BackupMetadata = {
      version: this.BACKUP_VERSION,
      taxYear: this.TAX_YEAR,
      timestamp: new Date().toISOString(),
      appVersion: this.APP_VERSION,
    }

    return {
      metadata,
      data: userData,
    }
  }

  static exportToFile(userData: UserInputData): void {
    const backup = this.createBackup(userData)
    const jsonString = JSON.stringify(backup, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = this.generateBackupFilename()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static validateAndNormalizeBackupFile(backupData: any): BackupValidationResult & { normalizedData?: UserInputData } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!backupData || typeof backupData !== 'object') {
      errors.push('Invalid backup file format')
      return { isValid: false, errors, warnings }
    }

    if (!backupData.metadata) {
      warnings.push('Missing backup metadata')
    } else {
      if (!backupData.metadata.version) {
        warnings.push('Missing backup version')
      }
      if (!backupData.metadata.taxYear) {
        warnings.push('Missing tax year')
      } else if (backupData.metadata.taxYear !== this.TAX_YEAR) {
        warnings.push(`Backup is for tax year ${backupData.metadata.taxYear}, current app is for ${this.TAX_YEAR}`)
      }
      if (!backupData.metadata.timestamp) {
        warnings.push('Missing backup timestamp')
      }
    }

    if (!backupData.data) {
      errors.push('Missing backup data')
      return { isValid: false, errors, warnings }
    }

    // Create normalized data with defaults for missing fields
    const normalizedData: UserInputData = {
      w2Income: [],
      businessIncome: [],
      optionExercises: [],
      investmentIncome: {
        taxFreeInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
        taxableInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
        qualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
        nonQualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
        longTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
        shortTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
      },
      hsaContribution: 0,
      _401kContribution: 0,
      _403bContribution: 0,
      propertyTaxes: 0,
      withholding1: 0,
      withholding2: 0,
      taxPaidQ1: 0,
      taxPaidQ2: 0,
      taxPaidQ3: 0,
      taxPaidQ4: 0,
      optionExerciseWithholding: 0,
      foreignTaxCredit: 0,
    }

    // Copy over existing data, using defaults for missing fields
    if (Array.isArray(backupData.data.w2Income)) {
      normalizedData.w2Income = backupData.data.w2Income.filter((w2: any) =>
        w2.id && typeof w2.name === 'string' && typeof w2.income === 'number'
      )
      if (normalizedData.w2Income.length !== backupData.data.w2Income.length) {
        warnings.push('Some W2 entries were skipped due to invalid format')
      }
    } else if (backupData.data.w2Income) {
      warnings.push('W2 income data format invalid, using empty array')
    }

    if (Array.isArray(backupData.data.businessIncome)) {
      normalizedData.businessIncome = backupData.data.businessIncome.filter((b: any) =>
        b.id && typeof b.name === 'string' && typeof b.income === 'number'
      )
      if (normalizedData.businessIncome.length !== backupData.data.businessIncome.length) {
        warnings.push('Some business income entries were skipped due to invalid format')
      }
    } else if (backupData.data.businessIncome) {
      warnings.push('Business income data format invalid, using empty array')
    }

    if (Array.isArray(backupData.data.optionExercises)) {
      normalizedData.optionExercises = backupData.data.optionExercises.filter((option: any) =>
        option.id && typeof option.date === 'string' && typeof option.amount === 'number'
      )
      if (normalizedData.optionExercises.length !== backupData.data.optionExercises.length) {
        warnings.push('Some option exercise entries were skipped due to invalid format')
      }
    } else if (backupData.data.optionExercises) {
      warnings.push('Option exercises data format invalid, using empty array')
    }

    // Handle investment income with defaults
    if (backupData.data.investmentIncome && typeof backupData.data.investmentIncome === 'object') {
      const investmentFields = [
        'taxFreeInterest',
        'taxableInterest',
        'qualifiedDividends',
        'nonQualifiedDividends',
        'longTermCapitalGains',
        'shortTermCapitalGains',
      ]

      for (const field of investmentFields) {
        if (backupData.data.investmentIncome[field] && typeof backupData.data.investmentIncome[field] === 'object') {
          normalizedData.investmentIncome[field as keyof typeof normalizedData.investmentIncome] = {
            q1: backupData.data.investmentIncome[field].q1 || 0,
            q2: backupData.data.investmentIncome[field].q2 || 0,
            q3: backupData.data.investmentIncome[field].q3 || 0,
            q4: backupData.data.investmentIncome[field].q4 || 0,
          }
        } else if (backupData.data.investmentIncome[field]) {
          warnings.push(`Invalid format for ${field}, using defaults`)
        }
      }
    }

    // Handle numeric fields with defaults
    const numericFields = [
      'hsaContribution', '_401kContribution', '_403bContribution', 'propertyTaxes',
      'withholding1', 'withholding2', 'taxPaidQ1', 'taxPaidQ2', 'taxPaidQ3', 'taxPaidQ4',
      'optionExerciseWithholding', 'foreignTaxCredit'
    ]

    for (const field of numericFields) {
      if (typeof backupData.data[field] === 'number') {
        (normalizedData as any)[field] = backupData.data[field]
      } else if (backupData.data[field] !== undefined) {
        warnings.push(`Invalid value for ${field}, using default (0)`)
      } else {
        warnings.push(`Missing field ${field}, using default (0)`)
      }
    }

    return {
      isValid: true,
      errors,
      warnings,
      normalizedData,
    }
  }

  static validateBackupFile(backupData: any): BackupValidationResult {
    const result = this.validateAndNormalizeBackupFile(backupData)
    return {
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
    }
  }

  static async importFromFile(): Promise<{ success: boolean; data?: UserInputData; error?: string; warnings?: string[] }> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve({ success: false, error: 'No file selected' })
          return
        }

        try {
          const text = await file.text()
          const backupData = JSON.parse(text)
          const validation = this.validateAndNormalizeBackupFile(backupData)

          if (!validation.isValid) {
            resolve({
              success: false,
              error: `Invalid backup file: ${validation.errors.join(', ')}`
            })
            return
          }

          resolve({
            success: true,
            data: validation.normalizedData,
            warnings: validation.warnings,
          })
        } catch (error) {
          resolve({
            success: false,
            error: `Failed to parse backup file: ${error instanceof Error ? error.message : 'Unknown error'}`
          })
        }
      }

      input.click()
    })
  }
}