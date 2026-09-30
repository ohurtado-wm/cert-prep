export class ApiException extends Error {
  constructor(
    readonly status: 400 | 401 | 404 | 502 | 503,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiException'
  }
}
