import { ApiException } from '../errors'
import { GatewayUserSchema, type GatewayUser } from '../contracts'

export type UserProvider = (request: Request) => Promise<GatewayUser>
type GatewayFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

const developmentUser: GatewayUser = {
  id: 'ohurtado',
  email: 'ohurtado@westmonroe.com',
  permissions: [],
}

export function createEnvironmentUserProvider(nodeEnvironment = process.env.NODE_ENV): UserProvider {
  if (nodeEnvironment === 'development') {
    return async () => developmentUser
  }

  return createGatewayUserProvider()
}

export function createGatewayUserProvider(
  endpoint = process.env.GATEWAY_USERS_ME_URL ?? 'https://westmonroe-cloud.com/users/me',
  fetcher: GatewayFetch = fetch,
): UserProvider {
  return async (request) => {
    const headers = new Headers({ accept: 'application/json' })
    for (const headerName of ['authorization', 'cookie']) {
      const value = request.headers.get(headerName)
      if (value) headers.set(headerName, value)
    }

    let response: Response
    try {
      response = await fetcher(endpoint, { headers, signal: request.signal })
    } catch {
      throw new ApiException(503, 'GATEWAY_UNAVAILABLE', 'No se pudo validar la sesión. Intenta de nuevo.')
    }

    if (response.status === 401 || response.status === 403) {
      throw new ApiException(401, 'UNAUTHENTICATED', 'Inicia sesión para continuar.')
    }
    if (!response.ok) {
      throw new ApiException(503, 'GATEWAY_UNAVAILABLE', 'No se pudo validar la sesión. Intenta de nuevo.')
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new ApiException(502, 'INVALID_GATEWAY_RESPONSE', 'El servicio de identidad devolvió una respuesta inválida.')
    }

    const parsed = GatewayUserSchema.safeParse(payload)
    if (!parsed.success) {
      throw new ApiException(502, 'INVALID_GATEWAY_RESPONSE', 'El servicio de identidad devolvió una respuesta inválida.')
    }
    return parsed.data
  }
}
