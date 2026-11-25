export class ApiException extends Error {
  constructor(
    readonly status: 400 | 401 | 404 | 409 | 422 | 429 | 500 | 502 | 503,
    readonly code: string,
    message: string,
    readonly diagnostic?: { operation: 'advanced_bank'; category: import('./simulations/advanced-bank/bank').AdvancedBankFailure; reason?: import('./simulations/advanced-bank/bank').AdvancedBankReason },
  ) {
    super(message)
    this.name = 'ApiException'
  }
}
